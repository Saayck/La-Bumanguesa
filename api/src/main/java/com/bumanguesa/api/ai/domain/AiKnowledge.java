package com.bumanguesa.api.ai.domain;

import com.bumanguesa.api.common.domain.Auditable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Un hecho que el negocio le enseña al asistente.
 *
 * <p>Es el mecanismo de "entrenamiento" del asistente: en lugar de reentrenar
 * los pesos del modelo (caro, lento y que además congelaría los datos), estos
 * registros se inyectan en el contexto y surten efecto en la siguiente pregunta.
 */
@Entity
@Table(name = "ai_knowledge")
@Getter
@Setter
@NoArgsConstructor
public class AiKnowledge extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** De qué trata el dato ("Tiempo de delivery"). Ayuda al modelo a localizarlo. */
    @Column(nullable = false, length = 120)
    private String topic;

    /** La respuesta tal cual debe darla el asistente. */
    @Column(nullable = false, length = 1000)
    private String answer;

    @Column(name = "order_index", nullable = false)
    private int orderIndex;

    @Column(nullable = false)
    private boolean active = true;
}
