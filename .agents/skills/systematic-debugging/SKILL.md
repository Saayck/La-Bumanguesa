---
name: systematic-debugging
description: Protocolo estricto para análisis de logs, reproducción de bugs, diagnóstico de causa raíz y resolución de errores de compilación o runtime.
---

# Systematic Debugging Protocol

Este protocolo define el flujo estricto y paso a paso para diagnosticar, aislar y corregir fallos de software (build, runtime, pruebas o comportamiento inesperado) en el proyecto.

## 📌 Principios Fundamentales
1. **Evidencia empírica primero:** NUNCA adivines ni asumas la causa raíz sin leer los logs o tracebacks completos.
2. **Sin parches superficiales:** No ocultes excepciones con bloques `try/except` vacíos, ni devuelvas datos sintéticos para evitar un fallo. Corrige el contrato roto.
3. **Verificación obligatoria:** Todo fix debe probarse ejecutando los comandos de build/test correspondientes antes de declarar el problema resuelto.

## 🛠️ Procedimiento de 4 Pasos

### Paso 1: Extracción e Inspección Silenciosa de Logs
- Obtén los logs completos y sin truncar del fallo (ejemplo: `mvnw test`, `pnpm build`, `docker logs`).
- Examina el stack trace completo de abajo hacia arriba para identificar la excepción origen y la línea exacta del fallo.

### Paso 2: Análisis de Causa Raíz
- Inspecciona las firmas de métodos, tipos de datos, valores nulos o llamadas de red involucradas usando las herramientas de lectura de código (`view_file`, `grep_search`).
- Comprueba si el error proviene de datos ausentes, desalineación de esquemas (JPA / SQL / DTO) o problemas de configuración de entorno.

### Paso 3: Corrección Focalizada (Root Cause Fix)
- Aplica los cambios necesarios respetando los contratos de las APIs existentes.
- Actualiza todos los sitios de invocación si modificaste la firma de una función.

### Paso 4: Verificación y Validación
- Ejecuta los comandos de compilación o pruebas (`pnpm test`, `mvnw test`, `docker compose build`).
- Confirma que el código compila y los tests pasan sin lanzar advertencias ni errores residuales.
