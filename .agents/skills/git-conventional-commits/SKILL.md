---
name: git-conventional-commits
description: Generación estandarizada de mensajes de commit basados en git diff siguiendo la especificación de Conventional Commits v1.0.0.
---

# Conventional Commits Skill

Esta habilidad establece el formato estandarizado para la creación de commits en el proyecto basados en el análisis de `git diff` o `git status`.

## 📌 Formato Estándar

```text
<tipo>[ámbito opcional]: <descripción breve en presente imperativo>

[cuerpo opcional con explicación detallada del por qué y qué cambió]

[pie de página opcional para Breaking Changes o referencia a tickets]
```

## 🏷️ Tipos Permitidos
- **`feat`**: Una nueva funcionalidad para el usuario final (ej. `feat(menu): agregar filtro por categoría`).
- **`fix`**: Corrección de un error o bug en el código (ej. `fix(auth): corregir manejo de token expirado`).
- **`docs`**: Cambios exclusivamente en documentación (ej. `docs: actualizar DIAGNOSTICO_COMPLETO.md`).
- **`style`**: Cambios de formato, espacios o linting sin afectar lógica (ej. `style(angular): formatear código con prettier`).
- **`refactor`**: Reestructuración de código sin añadir features ni corregir bugs.
- **`perf`**: Cambio de código que mejora el rendimiento (ej. `perf(db): agregar índices a tablas de catálogo`).
- **`test`**: Añadir o corregir pruebas unitarias/integración (ej. `test(api): agregar tests de controlador auth`).
- **`chore`**: Tareas de mantenimiento, actualización de dependencias o builds (ej. `chore(deps): actualizar pnpm lockfile`).
- **`ci`**: Cambios en archivos de configuración CI/CD o scripts de deployment.

## 🛠️ Reglas de Redacción
1. Usar letras minúsculas en el tipo y ámbito.
2. La descripción breve debe ser clara, en modo imperativo ("agregar", "corregir", "refactorizar") y sin punto final.
3. Si incluye un **BREAKING CHANGE**, agregar `!` después del tipo/ámbito (ej. `feat(api)!: cambiar estructura de respuesta de site-config`).
