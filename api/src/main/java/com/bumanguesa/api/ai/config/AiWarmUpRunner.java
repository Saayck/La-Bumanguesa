package com.bumanguesa.api.ai.config;

import com.bumanguesa.api.ai.client.OpenAiCompatibleChatClient;
import com.bumanguesa.api.ai.dto.ChatRequest;
import com.bumanguesa.api.ai.security.SemanticGuard;
import com.bumanguesa.api.ai.service.AiAssistantService;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * Precalienta el asistente al arrancar la API.
 *
 * <p>Manda una pregunta real, no un saludo trivial, y la razón importa: el coste
 * dominante no es cargar el modelo sino <b>procesar el prompt</b> (instrucciones
 * + carta + sedes, varios miles de tokens). Medido en este proyecto: <b>61 s</b>
 * la primera vez frente a <b>~3 s</b> las siguientes, porque Ollama cachea el
 * prefijo del prompt. Un precalentamiento con un texto corto cargaría el modelo
 * pero no llenaría esa caché, y el primer cliente seguiría esperando un minuto.
 *
 * <p>Es {@code @Async} a propósito: si el motor de IA está caído, la API debe
 * arrancar igual — el chat se degrada solo (ver {@code AiController.status}).
 */
@Component
@Order(Integer.MAX_VALUE)
public class AiWarmUpRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AiWarmUpRunner.class);

    private final OpenAiCompatibleChatClient client;
    private final AiAssistantService assistant;
    private final SemanticGuard semanticGuard;

    public AiWarmUpRunner(OpenAiCompatibleChatClient client,
                          AiAssistantService assistant,
                          SemanticGuard semanticGuard) {
        this.client = client;
        this.assistant = assistant;
        this.semanticGuard = semanticGuard;
    }

    @Override
    @Async
    public void run(ApplicationArguments args) {
        if (!client.isEnabled()) {
            return;
        }
        long start = System.currentTimeMillis();
        try {
            // Vectoriza los corpus del clasificador semántico antes de aceptar
            // tráfico: si no, las primeras peticiones se saltarían esa capa.
            semanticGuard.warmUp();

            // Va por chat() para que el prompt sea exactamente el de producción:
            // solo así el prefijo cacheado sirve para las peticiones reales.
            assistant.chat(new ChatRequest(List.of(new ChatRequest.Turn("user", "hola"))));
            log.info("Asistente de IA precalentado en {} ms (modelo '{}'). "
                            + "El prompt ya está cacheado: los clientes no pagan el primer prefill.",
                    System.currentTimeMillis() - start, client.model());
        } catch (RuntimeException ex) {
            log.warn("No se pudo precalentar el asistente ({}). "
                    + "La primera respuesta será más lenta.", ex.getMessage());
        }
    }
}
