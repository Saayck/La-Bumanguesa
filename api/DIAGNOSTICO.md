# Diagnóstico del Backend — La Bumanguesa API

> Estado: **✅ compila y los tests pasan** (`./mvnw test` → BUILD SUCCESS).
> Fecha: 2026-07-20

Este documento describe el backend creado para la landing de **La Bumanguesa**,
las decisiones de arquitectura, el modelo de datos, los endpoints, las
validaciones y los pasos para ejecutarlo.

---

## 1. Stack tecnológico

| Componente        | Versión / elección                          |
|-------------------|---------------------------------------------|
| Lenguaje          | Java 21                                      |
| Framework         | Spring Boot 4.1.0 (Spring MVC)               |
| Persistencia      | Spring Data JPA + Hibernate                  |
| Base de datos     | **Microsoft SQL Server** (driver `com.microsoft.sqlserver:mssql-jdbc`) |
| Migraciones       | Flyway (`flyway-core` + `flyway-sqlserver`)  |
| Validación        | Jakarta Bean Validation (`spring-boot-starter-validation`) |
| Utilidades        | Lombok                                        |
| Build             | Maven (wrapper incluido `mvnw`)              |
| Test              | JUnit 5 + H2 en memoria (perfil de test)     |

> **Nota sobre la BD:** se usa **Microsoft SQL Server**. Todo el texto se almacena
> en columnas `NVARCHAR` (unicode) y Hibernate se configura con
> `use_nationalized_character_data=true` para que caracteres como `ñ`, `é` o `★`
> (usados en el marquee y las descripciones) se guarden correctamente.

---

## 2. Arquitectura

Se eligió una **arquitectura por capas organizada por feature (package-by-feature)**,
la más adecuada para una API CRUD de catálogo como esta: es simple, testeable y
cada dominio queda autocontenido.

```
com.bumanguesa.api
├── ApiApplication.java
├── config/                     ← SecurityConfig (seguridad + CORS)
├── common/                     ← código transversal
│   ├── domain/                 ← BrandAccent, VideoPlatform (enums), Auditable (base)
│   └── exception/              ← ApiError, GlobalExceptionHandler, excepciones
│
├── auth/                       ← autenticación (JWT)
│   ├── domain/ repository/ service/ security/ web/ dto/
│
├── settings/                   ← configuración global del sitio (singleton)
├── menu/                       ← ítems del menú
├── video/                      ← tarjetas de videos (TikTok/Reels/Shorts)
├── location/                   ← sedes con mapa embebido
└── hero/                       ← slides del carrusel principal
```

Cada feature está ordenada en subpaquetes por responsabilidad:

```
feature/
├── domain/       ← Entity (JPA)
├── repository/   ← Repository (Spring Data)
├── service/      ← Service (negocio) + Mapper
├── web/          ← Controller (HTTP)
└── dto/          ← Request/Response (records, nunca se exponen entidades)

   web → service → repository → domain
```

**Principios aplicados:**
- **Separación DTO ↔ Entidad:** las entidades JPA nunca salen por HTTP. Se usan
  `record` inmutables como DTOs.
- **Transaccionalidad explícita:** servicios `@Transactional(readOnly = true)` por
  defecto y escritura marcada puntualmente.
- **`open-in-view=false`:** se evita el anti-patrón de lazy loading en la vista.
- **Schema versionado con Flyway:** la BD es propiedad de las migraciones
  (`ddl-auto=none`); Hibernate nunca modifica ni valida el esquema, evitando
  fricciones de mapeo de tipos entre Hibernate y SQL Server.
- **Manejo de errores centralizado:** un único `@RestControllerAdvice` traduce
  todas las excepciones a un cuerpo `ApiError` consistente.

---

## 3. Modelo de datos

El dominio se derivó **1:1 de lo que el frontend Angular ya tenía hardcodeado**
(`site.config.ts`, servicios de `menu`, `videos`, `hero`, `locations` y el `marquee`).

| Tabla           | Origen en el frontend                     | Campos clave |
|-----------------|-------------------------------------------|--------------|
| `site_setting`  | `SITE_CONFIG` + marquee                   | brand, city, whatsapp, redes, horarios, promo bar, marquee |
| `menu_item`     | `MenuService`                             | slug, title, description, imageUrl, badge, badgeRotation, accent, ctaLabel |
| `video`         | `VideosService`                           | slug, platform, label, thumbnailUrl, accentColor, offsetY, url |
| `location`      | `LocationsService`                        | slug, name, address, accent, mapEmbedUrl |
| `hero_slide`    | `HeroService`                             | imageUrl, delaySeconds |

**Columnas comunes de auditoría/gestión** (en todas menos donde no aplica):
`order_index` (orden de render), `active` (soft toggle de visibilidad),
`created_at`, `updated_at` (gestionados por Hibernate).

**Enums** (`accent`, `platform`) se guardan como `NVARCHAR` en MAYÚSCULAS
(`YELLOW`, `TIKTOK`…) y se serializan a JSON en minúsculas (`yellow`, `tiktok`)
mediante `@JsonValue`/`@JsonCreator`, para respetar exactamente los tipos
TypeScript del frontend.

Los datos semilla (`V2__seed_data.sql`) reproducen **exactamente** el contenido
actual de la web, de modo que la API arranca ya poblada y el frontend puede
consumirla sin ninguna diferencia visual.

---

## 4. Endpoints

Convención: rutas **públicas** de solo lectura bajo `/api/**` (las que consume el
sitio) y rutas de **administración** (CRUD completo) bajo `/api/admin/**`.

### Público (lo que consume el Angular)
| Método | Ruta                 | Descripción                          |
|--------|----------------------|--------------------------------------|
| GET    | `/api/site-config`   | Configuración del sitio (shape = `SiteConfig`) |
| GET    | `/api/menu-items`    | Ítems del menú activos, ordenados    |
| GET    | `/api/videos`        | Videos activos, ordenados            |
| GET    | `/api/locations`     | Sedes activas, ordenadas             |
| GET    | `/api/hero-slides`   | Slides del hero activos, ordenados   |
| POST   | `/api/auth/login`    | Login → devuelve un JWT              |

### Autenticación
| Método | Ruta            | Acceso        | Descripción                    |
|--------|-----------------|---------------|--------------------------------|
| POST   | `/api/auth/login` | Público     | Credenciales → `{ token, ... }` |
| GET    | `/api/auth/me`    | Autenticado | Admin actual (username, role)  |

### Administración (CRUD con validación)
| Recurso     | Rutas |
|-------------|-------|
| Site config | `PUT /api/site-config` |
| Menu        | `GET/POST /api/admin/menu-items`, `GET/PUT/DELETE /api/admin/menu-items/{slug}` |
| Videos      | `GET/POST /api/admin/videos`, `GET/PUT/DELETE /api/admin/videos/{slug}` |
| Locations   | `GET/POST /api/admin/locations`, `GET/PUT/DELETE /api/admin/locations/{slug}` |
| Hero        | `GET/POST /api/admin/hero-slides`, `GET/PUT/DELETE /api/admin/hero-slides/{id}` |

> Menu/Video/Location usan el **slug** como identificador externo (coincide con el
> `id: string` del frontend). Hero usa id numérico porque no tiene slug natural.
>
> 🔒 **Todas las rutas `/api/admin/**` y `PUT /api/site-config` requieren un JWT
> válido** (`Authorization: Bearer <token>`). Sin token responden **401**.

---

## 4b. Seguridad (JWT stateless)

- **Login:** `POST /api/auth/login` con `{ username, password }` valida contra la
  tabla `admin_user` (contraseñas **BCrypt**) y devuelve un **JWT HS256**.
- **Protección:** un `JwtAuthenticationFilter` lee el header `Authorization: Bearer`,
  valida la firma/expiración y puebla el `SecurityContext`. Sesiones **STATELESS**.
- **Reglas:** público → `POST /api/auth/login` y los `GET` de contenido; todo lo
  demás requiere autenticación. `401` se devuelve como JSON (`RestAuthenticationEntryPoint`).
- **Admin inicial:** `AdminUserSeeder` crea la cuenta en el primer arranque a partir
  de `ADMIN_USERNAME` / `ADMIN_PASSWORD` (por defecto `admin` / `Bumanguesa2026!`).
  **Cámbiala en producción**, junto con `JWT_SECRET`.
- **CORS:** integrado en la cadena de seguridad (`CorsConfigurationSource`), permite
  el origen del Angular (`app.cors.allowed-origins`).

| Variable         | Default                         | Uso                          |
|------------------|---------------------------------|------------------------------|
| `JWT_SECRET`     | *(clave de ejemplo, cámbiala)*  | Firma de tokens (≥32 bytes)  |
| `JWT_EXPIRATION_MS` | `86400000` (24 h)            | Vigencia del token           |
| `ADMIN_USERNAME` | `admin`                         | Usuario admin inicial        |
| `ADMIN_PASSWORD` | `Bumanguesa2026!`               | Contraseña admin inicial     |

---

## 5. Validaciones

Todas las peticiones de escritura (`@Valid @RequestBody`) validan a nivel de campo:

- **Obligatoriedad:** `@NotBlank` / `@NotNull` en todos los campos requeridos.
- **Longitudes:** `@Size(max = …)` alineado con las columnas de la BD.
- **Slugs:** `@Pattern(^[a-z0-9]+(?:-[a-z0-9]+)*$)` → minúsculas separadas por guiones.
- **WhatsApp:** `@Pattern(\d{8,15})` → solo dígitos.
- **Rangos numéricos:** `badgeRotation ∈ [-15,15]`, `offsetY ∈ [0,500]`,
  `delaySeconds ∈ [0,60]`, `copyrightYear ∈ [2000,2100]`,
  `marqueeDurationSeconds ∈ [5,120]`, `orderIndex ≥ 0`.
- **Enums:** valores inválidos (ej. `accent="blue"`) devuelven **400** con mensaje claro.
- **Unicidad de slug:** verificada en el servicio → **409 Conflict** si se duplica.

Errores → cuerpo uniforme `ApiError`:
```json
{
  "timestamp": "2026-07-20T22:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Los datos enviados no son válidos.",
  "path": "/api/admin/menu-items",
  "details": [ { "field": "slug", "message": "debe ser un slug en minúsculas (ej: burgers-clasica)" } ]
}
```

| Situación                     | HTTP |
|-------------------------------|------|
| Validación fallida / JSON inválido / enum inválido | 400 |
| Recurso no encontrado         | 404  |
| Slug duplicado                | 409  |
| Error inesperado              | 500  |

---

## 6. Dependencias añadidas

Al `pom.xml` original (que solo traía `webmvc` + Lombok) se agregaron:

```xml
spring-boot-starter-data-jpa               <!-- persistencia -->
spring-boot-starter-validation             <!-- Bean Validation -->
com.microsoft.sqlserver:mssql-jdbc         <!-- driver SQL Server (runtime) -->
org.flywaydb:flyway-core                   <!-- migraciones -->
org.flywaydb:flyway-sqlserver              <!-- soporte SQL Server para Flyway -->
com.h2database:h2                          <!-- BD en memoria para tests (scope test) -->
```

---

## 7. Cómo ejecutar

### Requisitos
- JDK 21
- Microsoft SQL Server (2019+ recomendado) en ejecución

### Configuración (variables de entorno, con defaults)
| Variable       | Default            |
|----------------|--------------------|
| `DB_HOST`      | `localhost`        |
| `DB_PORT`      | `1433`             |
| `DB_NAME`      | `labumanguesa`     |
| `DB_USER`      | `sa`               |
| `DB_PASSWORD`  | *(vacío)*          |
| `CORS_ORIGINS` | `http://localhost:4200` |
| `SERVER_PORT`  | `8080`             |

> **La base de datos debe existir antes del primer arranque** (SQL Server no la
> crea desde la cadena de conexión). Créala una vez:
> ```sql
> CREATE DATABASE labumanguesa;
> ```
> Al arrancar, Flyway crea el esquema (`V1`), carga los datos semilla (`V2`) y la
> tabla de administradores (`V3`); el usuario admin lo crea `AdminUserSeeder`.
>
> **Carga manual de datos (opcional):** si prefieres poblar la BD a mano (SSMS),
> ejecuta [`scripts/seed_data.sql`](scripts/seed_data.sql) — es **idempotente**
> (no duplica) y convive con el seed de Flyway. Necesario porque el frontend ya no
> tiene datos por defecto: sin datos en la BD, la página se muestra vacía.

### Comandos
```bash
cd api
./mvnw spring-boot:run     # levanta la API en http://localhost:8080
./mvnw test                # ejecuta los tests (usa H2, no requiere SQL Server)
./mvnw clean package       # genera el .jar
```

Prueba rápida:
```bash
# Login (obtiene el token)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Bumanguesa2026!"}'

# Endpoint público
curl http://localhost:8080/api/menu-items
```

---

## 8. Panel de administración (Angular)

El panel vive dentro de la **misma app Angular** (`angular/`), bajo la ruta `/admin`.
Se añadió el router: la landing pública queda en `/` y el panel en `/admin`.

- **`/admin/login`** — pantalla de acceso (usuario/contraseña → JWT).
- **`/admin`** — protegido por `authGuard`; layout con menú lateral:
  - **Dashboard** — monitoreo: totales y activos/ocultos de menú, videos, sedes,
    hero y estado de la configuración.
  - **Menú / Videos / Sedes / Hero** — CRUD completo (crear, editar, eliminar,
    mostrar/ocultar) con validación en los formularios.
  - **Configuración** — editor de toda la config del sitio (marca, WhatsApp,
    redes, promo bar, horarios, marquesina).
- **Auth en el cliente:** `AuthService` (token en `localStorage`), `authGuard`
  (bloquea el área admin) y `authInterceptor` (adjunta el `Bearer` y cierra sesión
  automáticamente ante un `401`).
- **Sitio público 100% conectado a la API:** los servicios `menu/videos/hero/locations`
  y `SiteConfigService` consumen el backend. **Ya no hay datos hardcodeados en el
  Angular** — `site.config.ts` solo define el _tipo_ `SiteConfig`; todos los valores
  (marca, WhatsApp, redes, horarios, marquesina, menú, videos, sedes, hero) vienen de
  la base de datos, por lo que **todo lo editado en el panel se refleja en la página**.
  Mientras la config carga, la señal es `null` y los componentes usan cadenas vacías.

Ejecutar el frontend:
```bash
cd angular
pnpm install
pnpm start            # http://localhost:4200  (panel en /admin)
```
> Ajusta la URL del backend en `angular/src/app/core/config/api.config.ts`
> (`API_BASE`, por defecto `http://localhost:8080/api`).

---

## 9. Recomendaciones / próximos pasos

Priorizadas, para llevar esto a producción:

1. **Rotar secretos** — cambiar `JWT_SECRET` y la contraseña admin por defecto;
   nunca commitear credenciales reales.
2. **Refresh tokens / expiración corta** — hoy el token dura 24 h; para mayor
   seguridad, reducir la vigencia y añadir refresh.
3. **Gestión de usuarios** — pantalla CRUD de administradores con roles (hoy hay un
   único admin seed).
4. **Documentación viva (Swagger)** — añadir `springdoc-openapi` cuando su versión
   sea compatible con Spring Boot 4 (se omitió para garantizar un build estable).
5. **Tests de capa web/servicio** — añadir `@WebMvcTest` por controlador, tests de
   seguridad (401/200) y de servicio.
6. **Paginación** — si los catálogos crecen, exponer `Pageable` en los listados admin.
7. **Perfiles** — separar `application-dev` / `application-prod`.
8. **Subida de imágenes** — hoy se guardan URLs (Unsplash placeholder). Evaluar un
   endpoint de carga o integración con un bucket (S3/Cloudinary).

---

## 10. Inventario de archivos

### Backend (`api/`)
```
api/
├── pom.xml                                   (+JPA, validation, SQL Server, Flyway, Security, JWT)
├── DIAGNOSTICO.md                            (este documento)
├── src/main/resources/
│   ├── application.properties                (datasource SQL Server, JPA, Flyway, CORS, JWT)
│   └── db/migration/
│       ├── V1__init_schema.sql               (5 tablas de contenido)
│       ├── V2__seed_data.sql                 (datos = contenido del frontend)
│       └── V3__admin_user.sql                (tabla de administradores)
├── src/test/resources/application.properties (perfil test con H2)
└── src/main/java/com/bumanguesa/api/
    ├── common/{domain,exception}/            (enums + base entity, errores)
    ├── config/                               (SecurityConfig)
    ├── auth/
    │   ├── domain/      AdminUser
    │   ├── repository/  AdminUserRepository
    │   ├── service/     JwtService, AdminUserDetailsService, AdminUserSeeder
    │   ├── security/    JwtAuthenticationFilter, RestAuthenticationEntryPoint
    │   ├── web/         AuthController
    │   └── dto/         LoginRequest, LoginResponse, MeResponse
    └── menu/ video/ location/ hero/ settings/  (misma forma en cada feature)
        ├── domain/      <Entity>
        ├── repository/  <Entity>Repository
        ├── service/     <Entity>Service, <Entity>Mapper
        ├── web/         <Entity>Controller
        └── dto/         <Entity>Request, <Entity>Response
```

### Frontend (`angular/src/app/`)
```
├── app.routes.ts / app.config.ts             (router + HttpClient + interceptor)
├── core/config/api.config.ts                 (URL del backend)
├── core/services/*                           (menu/videos/hero/locations/site-config → API)
├── features/home/                            (landing pública, antes en App)
└── admin/
    ├── auth/ (auth.service, auth.guard, auth.interceptor)
    ├── admin-api.service.ts, models.ts, admin.scss
    └── pages/ (login, layout, dashboard, menu, videos, locations, hero, site-config)
```
