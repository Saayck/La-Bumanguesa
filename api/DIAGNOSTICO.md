# Diagnóstico del Backend — trasladado

> ⚠️ **Este documento quedó obsoleto y se ha vaciado a propósito.**

La versión que vivía aquí databa del 20 de julio de 2026 y describía un stack que
ya no existe: hablaba de **SQL Server** y `NVARCHAR` cuando la base de datos es
**PostgreSQL 16**, y no cubría nada de lo añadido después (migraciones V4–V8,
seguridad OWASP LLM, asistente de IA, base de conocimiento, adicionales).

Mantener dos diagnósticos en paralelo garantizaba que uno de los dos mintiera.
Es la misma regla que el proyecto aplica a los datos: **un dato, una fuente**.
El histórico sigue disponible en git.

## 📄 Documentación vigente

**[`../DIAGNOSTICO_COMPLETO.md`](../DIAGNOSTICO_COMPLETO.md)**

| Sección | Contenido |
| :--- | :--- |
| 1 | Arquitectura global y diagramas |
| 2 | Seguridad OWASP Top 10 (backend) |
| 3 | Frontend Angular |
| 4 | Base de datos y migraciones Flyway (V1–V8) |
| 4.b | Inteligencia Artificial: arquitectura, seguridad LLM, rendimiento, entrenamiento |
| 4.c | Principio de cero contenido hardcodeado |
| 4.d | **Deuda pendiente (D1–D7) con plan detallado** |
| 6 | Roadmap priorizado |

## Puesta en marcha

Ver el [README de la raíz](../README.md).
