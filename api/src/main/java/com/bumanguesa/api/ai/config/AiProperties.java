package com.bumanguesa.api.ai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Configuración de la IA. El motor por defecto es <b>Ollama</b> con modelos
 * open source (Llama 3.2, Qwen 2.5, Mistral…): se ejecuta en la propia
 * infraestructura, sin API key y sin costo por token.
 *
 * <p>Se habla con él por la <i>API compatible con OpenAI</i>
 * ({@code POST {base-url}/chat/completions}), que es un estándar de facto. Eso
 * permite cambiar de proveedor gratuito sin tocar código, solo variables de
 * entorno:
 *
 * <ul>
 *   <li><b>Ollama local</b> (por defecto):
 *       {@code AI_BASE_URL=http://ollama:11434/v1}, sin key.</li>
 *   <li><b>Groq</b> (capa gratuita, modelos Llama):
 *       {@code AI_BASE_URL=https://api.groq.com/openai/v1} + {@code AI_API_KEY}.</li>
 *   <li><b>OpenRouter</b> (modelos con sufijo {@code :free}):
 *       {@code AI_BASE_URL=https://openrouter.ai/api/v1} + {@code AI_API_KEY}.</li>
 * </ul>
 *
 * <p>Si {@code app.ai.enabled} es {@code false} los endpoints responden 503 y la
 * web oculta las funciones de IA, sin romper nada.
 */
@Component
public class AiProperties {

    private final boolean enabled;
    private final String baseUrl;
    private final String apiKey;
    private final String model;
    private final String embeddingModel;
    private final int timeoutSeconds;
    private final int maxTokens;
    private final double temperature;

    public AiProperties(@Value("${app.ai.enabled:true}") boolean enabled,
                        @Value("${app.ai.base-url:http://localhost:11434/v1}") String baseUrl,
                        @Value("${app.ai.api-key:}") String apiKey,
                        @Value("${app.ai.model:llama3.2:3b}") String model,
                        @Value("${app.ai.embedding-model:all-minilm}") String embeddingModel,
                        @Value("${app.ai.timeout-seconds:90}") int timeoutSeconds,
                        @Value("${app.ai.max-tokens:700}") int maxTokens,
                        @Value("${app.ai.temperature:0.4}") double temperature) {
        this.enabled = enabled;
        this.baseUrl = stripTrailingSlash(baseUrl);
        this.apiKey = apiKey == null ? "" : apiKey.trim();
        this.model = model;
        this.embeddingModel = embeddingModel;
        this.timeoutSeconds = timeoutSeconds;
        this.maxTokens = maxTokens;
        this.temperature = temperature;
    }

    /** Modelo de embeddings para el clasificador semántico (open source, local). */
    public String getEmbeddingModel() {
        return embeddingModel;
    }

    private static String stripTrailingSlash(String url) {
        String value = url == null ? "" : url.trim();
        while (value.endsWith("/")) {
            value = value.substring(0, value.length() - 1);
        }
        return value;
    }

    public boolean isEnabled() {
        return enabled && !baseUrl.isEmpty();
    }

    /** Los backends locales (Ollama, LM Studio) no requieren autenticación. */
    public boolean hasApiKey() {
        return !apiKey.isEmpty();
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public String getApiKey() {
        return apiKey;
    }

    public String getModel() {
        return model;
    }

    public int getTimeoutSeconds() {
        return timeoutSeconds;
    }

    public int getMaxTokens() {
        return maxTokens;
    }

    public double getTemperature() {
        return temperature;
    }
}
