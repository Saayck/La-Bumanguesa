# Prompt de continuación

Para retomar el trabajo en este proyecto con un asistente de IA.
**Copia el bloque de abajo y pégalo como primer mensaje.**

---

```
Vas a continuar el desarrollo de La Bumanguesa: una landing comercial con panel
de administración y asistente de IA para una hamburguesería en Ica, Perú.

ANTES DE ESCRIBIR CÓDIGO, lee estos dos ficheros:
  1. README.md                  — arranque, estado y comandos
  2. DIAGNOSTICO_COMPLETO.md    — arquitectura, seguridad e IA
     · sección 4.c → el principio de cero contenido hardcodeado
     · sección 4.d → la deuda pendiente D1-D7, con archivo y línea de cada punto

TAREA
Implementa [ ELIGE: D1 / D2 / D3 / D4 / D5 / D6 / D7 · o describe otra cosa ].
El plan de cada punto ya está escrito en 4.d: sigue esos pasos y desvíate solo
si encuentras que el plan está equivocado, diciéndomelo.

CÓMO QUIERO QUE TRABAJES

Verifica, no supongas. Este proyecto ya arrastró varios fallos por dar cosas por
buenas sin comprobarlas: una migración rompía el guardado de calificaciones, la
IA filtraba las claves primarias de la base de datos, y los adicionales estaban
duplicados en dos listas que no coincidían. Levanta el stack y pruébalo de
verdad; los tests que pasan no demuestran que la función haga lo que debe.

Reglas del proyecto que no se negocian:
  · Cero contenido hardcodeado. Si el dueño querría cambiarlo sin llamar a un
    programador, va a la base de datos y se edita desde /admin. Nunca importes
    ni textos de negocio en el código.
  · Un dato, una fuente. Si un valor aparece en dos sitios, se desincronizará.
  · Nunca deducir datos del nombre. Si hace falta una categoría o un estado, es
    una columna, no una subcadena del título.
  · Toda tabla nueva de contenido nace con su CRUD de admin. Si solo se puede
    editar por SQL, sigue siendo hardcodeado.
  · Un modelo de lenguaje no es una frontera de seguridad. La protección vive en
    código determinista (ai/security/PromptGuard, SemanticGuard) y en no poner
    nada sensible en el prompt.

Antes de dar algo por terminado:
  cd api && ./mvnw test           # 54 tests, deben seguir en verde
  ./api/scripts/eval-ai.sh        # 21 casos; requiere el stack levantado
  cd angular && npx ng build

Si tocas la IA, añade el caso a eval-ai.sh. Si tocas seguridad, añade el test de
regresión a PromptGuardTest o SemanticGuardTest.

Sé honesto en el reporte. Si algo no lo has probado, dilo. Si un cambio tuyo
rompió otra cosa, dilo. Prefiero un "esto no lo verifiqué" que un "está listo"
que resulte falso.
```

---

## Contexto para quien retome el trabajo

### El estado real

| | |
| :--- | :--- |
| Tests backend | 54/54 |
| Evaluación del asistente | 21/21 |
| Migraciones | V1 → V12 aplicadas y verificadas en PostgreSQL |
| Build Angular | ✅ |
| Deuda técnica D1–D7 | implementada; ver la advertencia de abajo |
| Nunca verificado | **la interfaz en un navegador** |

Todo se ha probado por HTTP y con tests, pero nadie ha hecho clic en el chat ni
guardado un dato desde el panel. Un binding roto o un fallo de CSS no lo
detectaría nada de lo que hay montado.

> ⚠️ **Verifica antes de fiarte de esta tabla.** Una versión anterior de este
> documento decía «D1–D7 100% resuelta y verificada» mientras **la API no
> arrancaba**: la migración V11 usaba `leading` como nombre de columna, que es
> palabra reservada en PostgreSQL, y Flyway abortaba el arranque. `mvnw test`
> daba 54/54 en verde porque el perfil de test **desactiva Flyway**. Levanta el
> stack y comprueba `flyway_schema_history` antes de dar nada por bueno.

### Errores ya cometidos en este proyecto

Están documentados para no repetirlos:

- **Dar por buena una migración sin ejecutarla.** Ha pasado **dos veces**, y es
  el fallo más caro del proyecto porque `mvnw test` no lo detecta: el perfil de
  test usa H2 con `ddl-auto=create-drop` y **Flyway desactivado**, así que 54/54
  en verde no dice nada sobre las migraciones.
  1. `burger_rating` se creó sin la columna `updated_at` que la entidad exige;
     guardar una calificación devolvía 500.
  2. V11 usó `leading` como nombre de columna — **palabra reservada de
     PostgreSQL**. La migración fallaba, Flyway abortaba el arranque y **la API
     entera no levantaba**, mientras la documentación afirmaba «100% verificado».
- **Editar una migración ya aplicada.** Al «mejorar» V9 y V10 después de que
  hubieran corrido, Flyway falló con `checksum mismatch` y la API dejó de
  arrancar. Una migración aplicada es inmutable: los arreglos van en una nueva.
- **Confiar en el prompt como control de seguridad.** El asistente volcaba las
  claves primarias, sus instrucciones y el contexto entero. Se arregló con
  cuatro capas, pero la que de verdad protege es no poner nada sensible en el
  prompt.
- **Sobrecorregir.** Al acotar el alcance, el asistente empezó a responder "eso
  se coordina por WhatsApp" cuando le pedían *el número de WhatsApp*. Cada regla
  nueva puede romper un caso que ya funcionaba: por eso existe `eval-ai.sh`.
- **Comparar mal para verificar.** Comparé el hash del bundle servido con el de
  un build local y concluí que el despliegue estaba roto. No lo estaba: el
  contenedor compila con `pnpm` y localmente se usa `npx ng`. Verifica el
  contenido, no el hash.
- **Duplicar la documentación.** Había dos diagnósticos y el segundo mentía
  (decía SQL Server cuando es PostgreSQL). Ahora `api/DIAGNOSTICO.md` es solo un
  puntero.

### Particularidades que sorprenden

- **El modelo tarda ~45 s en precalentar al arrancar.** Es deliberado: el coste
  real no es cargar el modelo sino procesar el prompt, y se paga una vez en el
  arranque en lugar de en la primera visita de un cliente.
- **Temperatura 0.** El asistente es determinista a propósito; recita hechos y
  deriva lo que no le toca. Subirla vuelve la suite de evaluación poco fiable.
- **Máximo 2 modelos cargados.** Al cambiar de modelo generativo se expulsa el
  de embeddings. Descarga el viejo (`ollama stop <modelo>`) y reinicia la API
  para que revectorice el clasificador.
- **`llama3.2:1b` fue evaluado y rechazado.** Ahorraba 0,75 GB pero fallaba 5 de
  19 pruebas: erraba precios e inventaba un proceso de reservas.
- **Los modelos pequeños copian los marcadores.** Un ejemplo con
  `"es [el número]"` hizo que el asistente respondiera literalmente
  `"es [el número]"`. En los ejemplos hay que inyectar el valor real.
