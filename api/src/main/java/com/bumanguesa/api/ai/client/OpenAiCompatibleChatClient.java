package com.bumanguesa.api.ai.client;

import com.bumanguesa.api.ai.config.AiProperties;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import tools.jackson.databind.JsonNode;

/**
 * Cliente mínimo contra cualquier motor con API compatible con OpenAI
 * ({@code POST {base-url}/chat/completions}).
 *
 * <p>Pensado para <b>Ollama</b> con modelos open source (gratis, self-hosted),
 * pero funciona igual con Groq, OpenRouter o LM Studio cambiando solo
 * {@code AI_BASE_URL}, {@code AI_MODEL} y (si hace falta) {@code AI_API_KEY}.
 *
 * <p>No usa DTOs de respuesta: navega el JSON con Jackson para tolerar las
 * pequeñas diferencias de formato entre proveedores.
 */
@Component
public class OpenAiCompatibleChatClient {

    private static final Logger log = LoggerFactory.getLogger(OpenAiCompatibleChatClient.class);

    /** Segundos que se reutiliza el resultado del chequeo de salud. */
    private static final int HEALTH_CACHE_SECONDS = 60;

    private final AiProperties properties;
    private final RestClient restClient;

    private volatile boolean healthy;
    private volatile long healthCheckedAt;

    public OpenAiCompatibleChatClient(AiProperties properties) {
        this.properties = properties;

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(10));
        factory.setReadTimeout(Duration.ofSeconds(properties.getTimeoutSeconds()));

        RestClient.Builder builder = RestClient.builder()
                .baseUrl(properties.getBaseUrl())
                .requestFactory(factory)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);

        if (properties.hasApiKey()) {
            builder.defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + properties.getApiKey());
        }
        this.restClient = builder.build();
    }

    public boolean isEnabled() {
        return properties.isEnabled();
    }

    public String model() {
        return properties.getModel();
    }

    /**
     * Comprueba que el motor responda de verdad, no solo que esté configurado.
     *
     * <p>Sin esto, un despliegue sin Ollama (por ejemplo la API en un PaaS y el
     * modelo en otro sitio) mostraría el chat al cliente para luego fallar en
     * cada mensaje. El resultado se cachea {@value #HEALTH_CACHE_SECONDS}s para
     * no sondear en cada carga de página.
     */
    public boolean isReachable() {
        if (!properties.isEnabled()) {
            return false;
        }
        long now = System.currentTimeMillis() / 1000;
        if (now - healthCheckedAt < HEALTH_CACHE_SECONDS) {
            return healthy;
        }
        try {
            restClient.get().uri("/models").retrieve().toBodilessEntity();
            healthy = true;
        } catch (RestClientException ex) {
            log.warn("El motor de IA en {} no responde: {}", properties.getBaseUrl(), ex.getMessage());
            healthy = false;
        }
        healthCheckedAt = now;
        return healthy;
    }

    /**
     * Envía la conversación y devuelve el texto de la respuesta.
     *
     * @param turns     conversación completa (el primer turno suele ser el system prompt)
     * @param maxTokens tope de tokens de salida
     * @param jsonMode  pide al motor que responda estrictamente con un objeto JSON
     * @throws AiUnavailableException si la IA está apagada o el motor no responde
     */
    public String complete(List<ChatTurn> turns, int maxTokens, boolean jsonMode) {
        if (!properties.isEnabled()) {
            throw new AiUnavailableException("El asistente de IA está deshabilitado en este entorno.");
        }

        List<Map<String, String>> messages = new ArrayList<>(turns.size());
        for (ChatTurn turn : turns) {
            messages.add(Map.of("role", turn.role(), "content", turn.content()));
        }

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("model", properties.getModel());
        payload.put("messages", messages);
        payload.put("max_tokens", maxTokens);
        payload.put("temperature", properties.getTemperature());
        payload.put("stream", false);
        if (jsonMode) {
            payload.put("response_format", Map.of("type", "json_object"));
        }

        JsonNode body;
        try {
            body = restClient.post()
                    .uri("/chat/completions")
                    .body(payload)
                    .retrieve()
                    .body(JsonNode.class);
        } catch (RestClientException ex) {
            log.error("Fallo al llamar al motor de IA en {} (modelo {}): {}",
                    properties.getBaseUrl(), properties.getModel(), ex.getMessage());
            throw new AiUnavailableException(
                    "El asistente no está disponible en este momento. Inténtalo de nuevo en unos segundos.", ex);
        }

        String content = extractContent(body);
        if (content == null || content.isBlank()) {
            throw new AiUnavailableException("El asistente devolvió una respuesta vacía.");
        }
        return content.trim();
    }

    private static String extractContent(JsonNode body) {
        if (body == null) {
            return null;
        }
        JsonNode choices = body.path("choices");
        if (!choices.isArray() || choices.isEmpty()) {
            return null;
        }
        JsonNode message = choices.get(0).path("message");
        JsonNode content = message.path("content");
        return content.isString() ? content.stringValue() : null;
    }
}
