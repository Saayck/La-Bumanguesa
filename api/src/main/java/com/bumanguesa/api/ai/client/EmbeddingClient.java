package com.bumanguesa.api.ai.client;

import com.bumanguesa.api.ai.config.AiProperties;
import java.time.Duration;
import java.util.LinkedHashMap;
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
 * Convierte texto en vectores usando el mismo motor open source y self-hosted
 * que el chat ({@code POST {base-url}/embeddings}, formato compatible con
 * OpenAI). Sin API key y sin coste por llamada.
 *
 * <p>El modelo por defecto, {@code all-minilm}, pesa 46 MB y tarda ~200 ms en
 * CPU — despreciable frente a los ~3 s que cuesta generar una respuesta.
 */
@Component
public class EmbeddingClient {

    private static final Logger log = LoggerFactory.getLogger(EmbeddingClient.class);

    private final AiProperties properties;
    private final RestClient restClient;

    public EmbeddingClient(AiProperties properties) {
        this.properties = properties;

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(5));
        factory.setReadTimeout(Duration.ofSeconds(20));

        RestClient.Builder builder = RestClient.builder()
                .baseUrl(properties.getBaseUrl())
                .requestFactory(factory)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);

        if (properties.hasApiKey()) {
            builder.defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + properties.getApiKey());
        }
        this.restClient = builder.build();
    }

    /**
     * @return el vector del texto, o {@code null} si el motor no responde.
     *         Devolver {@code null} en vez de lanzar es deliberado: quien llama
     *         decide cómo degradar, y una caída del embebedor no debe tumbar el chat.
     */
    public float[] embed(String text) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("model", properties.getEmbeddingModel());
        payload.put("input", text);

        try {
            JsonNode body = restClient.post()
                    .uri("/embeddings")
                    .body(payload)
                    .retrieve()
                    .body(JsonNode.class);
            return extractVector(body);
        } catch (RestClientException ex) {
            log.warn("No se pudo calcular el embedding con '{}': {}",
                    properties.getEmbeddingModel(), ex.getMessage());
            return null;
        }
    }

    private static float[] extractVector(JsonNode body) {
        if (body == null) {
            return null;
        }
        JsonNode data = body.path("data");
        if (!data.isArray() || data.isEmpty()) {
            return null;
        }
        JsonNode embedding = data.get(0).path("embedding");
        if (!embedding.isArray() || embedding.isEmpty()) {
            return null;
        }
        float[] vector = new float[embedding.size()];
        for (int i = 0; i < embedding.size(); i++) {
            vector[i] = (float) embedding.get(i).asDouble();
        }
        return vector;
    }

    /**
     * Similitud coseno. Ambos vectores deben tener la misma dimensión.
     *
     * @return valor en [-1, 1]; 1 = semánticamente idénticos
     */
    public static double cosineSimilarity(float[] a, float[] b) {
        if (a == null || b == null || a.length != b.length) {
            return 0d;
        }
        double dot = 0d;
        double normA = 0d;
        double normB = 0d;
        for (int i = 0; i < a.length; i++) {
            dot += (double) a[i] * b[i];
            normA += (double) a[i] * a[i];
            normB += (double) b[i] * b[i];
        }
        if (normA == 0d || normB == 0d) {
            return 0d;
        }
        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}
