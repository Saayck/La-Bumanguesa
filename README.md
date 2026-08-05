# La Bumanguesa

Landing comercial y panel de administración para una hamburguesería en Ica, Perú.
Carta digital con asistente de IA; los pedidos se cierran por WhatsApp.

```
Angular (nginx) ──/api──> Spring Boot 4 ──> PostgreSQL 16
                                │
                                └────────> Ollama (IA open source, self-hosted)
```

## Puesta en marcha

```bash
cp .env.example .env          # y edita JWT_SECRET y ADMIN_PASSWORD
docker compose up -d --build

# Modelos de IA — una sola vez (~2,6 GB)
docker compose exec ollama ollama pull llama3.2:3b
docker compose exec ollama ollama pull paraphrase-multilingual
```

| Servicio | URL |
| :--- | :--- |
| Web | http://localhost:4200 |
| Panel | http://localhost:4200/admin |
| API (debug directo) | http://localhost:8081/api |

> Tras arrancar hay **~45 s de precalentamiento** del modelo. Es al inicio, no en
> cada visita: se hace para que ningún cliente pague el primer procesamiento del
> prompt (61 s frente a los ~3 s habituales).

## Qué hace

**Landing** — carta, adicionales, videos, sedes con mapa, valoraciones de 1 a 5
estrellas con ranking bayesiano, y pedido por WhatsApp con pago Yape/Plin.

**Asistente de IA** (open source, sin coste por consulta):

| Función | Dónde |
| :--- | :--- |
| Chat sobre carta, precios, horarios y sedes | botón flotante en la landing |
| Recomendador: hamburguesa + adicionales + sede | sección Carta |
| Redacción de descripciones y marquesina | `/admin/menu`, `/admin/site` |
| Análisis de opiniones de clientes | `/admin` |
| Base de conocimiento editable | `/admin/ai` |

**Panel** — carta, videos, sedes, hero, configuración del sitio y entrenamiento
del asistente. Todo el contenido del negocio se edita aquí: **el código no lleva
textos ni precios** ([ver principio](DIAGNOSTICO_COMPLETO.md#4c-principio-rector-cero-contenido-hardcodeado)).

## Desarrollo

```bash
# Backend  (requiere PostgreSQL en localhost:5432)
cd api && ./mvnw spring-boot:run
./mvnw test                       # 54 tests

# Frontend (proxy a localhost:8080)
cd angular && pnpm install && pnpm start

# Calidad del asistente de IA (requiere el stack levantado)
./api/scripts/eval-ai.sh          # 21 casos
```

`mvnw test` cubre la lógica y la seguridad anti inyección de prompts.
`eval-ai.sh` mide la calidad de las respuestas contra el modelo real: exactitud,
honestidad, alcance, seguridad y falsos positivos.

## Documentación

| Documento | Para qué |
| :--- | :--- |
| **[DIAGNOSTICO_COMPLETO.md](DIAGNOSTICO_COMPLETO.md)** | Arquitectura, seguridad, IA y **deuda pendiente (D1–D7)** |
| [PROMPT_CONTINUACION.md](PROMPT_CONTINUACION.md) | Punto de partida para retomar el trabajo con un asistente de IA |

## Configuración

Todo por variables de entorno (`.env`). Las que hay que tocar sí o sí en
producción: `JWT_SECRET` (≥32 bytes), `ADMIN_PASSWORD`, `DB_PASSWORD` y
`CORS_ORIGINS`.

La IA habla el formato de API de OpenAI, así que se puede cambiar de motor sin
tocar código — solo `AI_BASE_URL`, `AI_MODEL` y `AI_API_KEY`. Alternativas
gratuitas si el servidor no aguanta el modelo local: Groq u OpenRouter (ver
`.env.example`).

Con `AI_ENABLED=false` la web oculta el chat y el recomendador y sigue
funcionando con normalidad.

## Estado

| | |
| :--- | :--- |
| Tests backend | 54/54 |
| Evaluación del asistente | 21/21 |
| Migraciones | V1 → V12 (verificadas contra PostgreSQL) |
| RAM del stack de IA | ~3 GB (tope 4 GB) |
| Deuda técnica D1–D7 | implementada y verificada en ejecución |

**Completado:** precios, categorías, recargo para llevar, adicionales, títulos de
sección y sugerencias de la IA se configuran desde `/admin`, sin tocar código.

**Pendiente conocido:**

- **Flyway está desactivado en los tests.** El perfil de test usa H2 con
  `ddl-auto=create-drop`, así que las migraciones **no se validan en CI**. Ya ha
  costado dos incidencias, la última con la API sin arrancar por una palabra
  reservada de PostgreSQL. Migrar el test de contexto a Testcontainers cierra el
  hueco y es la mejora de mayor valor pendiente.
- La interfaz **no se ha probado en un navegador**: todo está verificado por HTTP
  y con tests.
- Falta la propiedad `url` del JSON-LD con el dominio real (ver D4 en el
  diagnóstico).

