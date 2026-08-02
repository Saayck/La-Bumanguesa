package com.bumanguesa.api.ai.client;

/**
 * Un turno de conversación con el modelo.
 *
 * @param role    {@code system}, {@code user} o {@code assistant}
 * @param content texto del turno
 */
public record ChatTurn(String role, String content) {

    public static ChatTurn system(String content) {
        return new ChatTurn("system", content);
    }

    public static ChatTurn user(String content) {
        return new ChatTurn("user", content);
    }

    public static ChatTurn assistant(String content) {
        return new ChatTurn("assistant", content);
    }
}
