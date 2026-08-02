package com.bumanguesa.api.ai.client;

/** El motor de IA está apagado, caído o tardó demasiado en responder. */
public class AiUnavailableException extends RuntimeException {

    public AiUnavailableException(String message) {
        super(message);
    }

    public AiUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
