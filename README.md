# Authentication Backend

API REST de autenticación completa construida con **NestJS** sobre **Fastify**, siguiendo los principios de **Arquitectura Limpia** y **DDD (Domain-Driven Design)**. Gestiona el ciclo completo de identidad de usuarios: registro, confirmación de cuenta, inicio de sesión, gestión de sesiones con JWT, recuperación y restablecimiento de contraseña.

---

## Tabla de contenidos

- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Variables de entorno](#variables-de-entorno)
- [Endpoints](#endpoints)
- [Flujos principales](#flujos-principales)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Docker](#docker)
- [Documentación API](#documentación-api)

---

## Tecnologías

| Categoría              | Tecnología                                                               |
| ---------------------- | ------------------------------------------------------------------------ |
| **Runtime**            | Node.js ≥ 24 · TypeScript                                                |
| **Framework**          | NestJS 11 sobre **Fastify**                                              |
| **Base de datos**      | **PostgreSQL** con Prisma ORM (`@prisma/adapter-pg`)                     |
| **Caché**              | **Redis** vía `@keyv/redis` + `@nestjs/cache-manager`                    |
| **Colas / Workers**    | **BullMQ** con Redis (`@nestjs/bullmq`)                                  |
| **Email**              | **Nodemailer** (SMTP con soporte TLS/STARTTLS)                           |
| **Tokens**             | **JWT** (`@nestjs/jwt`) — 3 tipos independientes                         |
| **Contraseñas**        | **bcrypt**                                                               |
| **Cookies**            | `@fastify/cookie` (httpOnly · secure · sameSite: lax)                    |
| **Validación**         | `class-validator` · `class-transformer` · **Zod** (variables de entorno) |
| **Documentación API**  | `@nestjs/swagger` + `@scalar/nestjs-api-reference`                       |
| **Eventos internos**   | `@nestjs/event-emitter`                                                  |
| **User-Agent parsing** | `ua-parser-js`                                                           |
| **Gestor de paquetes** | pnpm ≥ 9                                                                 |
| **Zona horaria**       | `America/Bogota` (UTC-5)                                                 |

---

## Arquitectura

El proyecto sigue **Arquitectura Limpia** con **Ports & Adapters (Hexagonal)** y separación **CQRS** de comandos y consultas.

```
Contexto/
  domain/          ← Entidades, Value Objects, Servicios de dominio, Puertos (interfaces), Excepciones
  application/     ← Handlers de casos de uso (Commands & Queries), Servicios de aplicación
  infrastructure/  ← Controladores HTTP, DTOs, Guards, Eventos, Workers, Persistencia (adaptadores Prisma)
```

Cada caso de uso vive en su propia carpeta con un archivo `.command.ts` / `.query.ts` y un `.handler.ts`.

La infraestructura compartida (BD, caché, JWT, email, logger, env) está en `src/shared/`, con `ports/` (clases abstractas) y `adapters/` (implementaciones concretas).

### Contextos de dominio

| Contexto            | Responsabilidad                                                                                                                                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **auth**            | Todos los flujos de autenticación: registro, inicio de sesión, confirmación de cuenta, logout, refresh token, recuperación/restablecimiento de contraseña. Gestiona sesiones y emite eventos de cola para emails. |
| **users**           | Agregado Usuario: creación, validaciones de unicidad (email / teléfono / username), búsqueda por ID, actualización de estado de confirmación, control de intentos fallidos de inicio de sesión.                   |
| **users-passwords** | Agregado Contraseña: creación de contraseñas hasheadas, consulta de la contraseña activa de un usuario.                                                                                                           |

---

## Estructura del proyecto

```
src/
├── main.ts                          # Bootstrap (Fastify, pipes, CORS, cookies, Swagger)
├── app/
│   ├── app.module.ts                # Módulo raíz
│   ├── constants/                   # Rutas, colas, nombres de cookies, regex
│   ├── exception-filter/            # Filtro global de excepciones HTTP
│   └── interceptors/                # RequestAgent · ResponseTime
├── contexts/
│   ├── context.module.ts
│   ├── auth/                        # Contexto de autenticación (stack DDD completo)
│   ├── users/                       # Contexto de usuarios
│   └── users-passwords/             # Contexto de contraseñas
└── shared/
    ├── database/                    # PrismaPostgresAdapter (global)
    ├── env/                         # Config de entorno validada con Zod (global)
    ├── integrations/                # Redis caché + BullMQ + Nodemailer (global)
    ├── logger/                      # Adaptador de logger personalizado
    ├── security/                    # Adaptadores JWT · Bcrypt · Crypto
    └── domain/                      # Value Objects y excepciones compartidas
```

---

## Variables de entorno

Copia `.env.example` a `.env` y completa los valores. La aplicación valida el esquema al iniciar con **Zod** y falla rápido si falta alguna variable requerida.

```bash
cp .env.example .env
```

| Variable                 | Descripción                                                                | Requerida |
| ------------------------ | -------------------------------------------------------------------------- | :-------: |
| `PORT`                   | Puerto del servidor (1000–65535)                                           |    ✅     |
| `NODE_ENV`               | `development` \| `production` \| `test`                                    |    ✅     |
| `SECRET_COOKIE`          | Secreto para firmar cookies (se autogenera si no se define)                |     —     |
| `APP_URL`                | URL base del frontend (usada en el enlace de recuperación de contraseña)   |    ✅     |
| `DB_HOST`                | Host de PostgreSQL                                                         |    ✅     |
| `DB_NAME`                | Nombre de la base de datos                                                 |    ✅     |
| `DB_USERNAME`            | Usuario de la base de datos                                                |    ✅     |
| `DB_PASSWORD`            | Contraseña de la base de datos                                             |    ✅     |
| `DB_PORT`                | Puerto de PostgreSQL                                                       |    ✅     |
| `JWT_SECRET`             | Secreto para tokens de acceso                                              |    ✅     |
| `JWT_REFRESH_SECRET`     | Secreto para tokens de refresco                                            |    ✅     |
| `JWT_CONFIRM_SECRET`     | Secreto para tokens de confirmación de cuenta                              |    ✅     |
| `JWT_EXPIRES_IN`         | Duración del token de acceso (ej. `10m`)                                   |    ✅     |
| `JWT_REFRESH_EXPIRES_IN` | Duración del token de refresco (ej. `7d`)                                  |    ✅     |
| `REDIS_HOST`             | Host de Redis                                                              |    ✅     |
| `REDIS_PORT`             | Puerto de Redis                                                            |    ✅     |
| `REDIS_PASSWORD`         | Contraseña de Redis                                                        |     —     |
| `SMTP_HOST`              | Host del servidor SMTP                                                     |    ✅     |
| `SMTP_PORT`              | Puerto SMTP (465 para TLS, 587 para STARTTLS)                              |    ✅     |
| `SMTP_USERNAME`          | Usuario SMTP                                                               |    ✅     |
| `SMTP_PASSWORD`          | Contraseña SMTP                                                            |    ✅     |
| `SMTP_TLS`               | `true` para TLS implícito (puerto 465), `false` para STARTTLS (puerto 587) |    ✅     |

---

## Endpoints

Todos los endpoints se sirven bajo el prefijo global **`/api/v1`**.

### Auth — `/api/v1/auth`

| Método  | Ruta                                 | Guard                   | Descripción                                                                                                                                                               |
| ------- | ------------------------------------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST`  | `/auth/sing-up`                      | —                       | Registro de nuevo usuario. Envía email de confirmación y establece cookie `account_confirmed`.                                                                            |
| `POST`  | `/auth/sing-in`                      | —                       | Inicio de sesión. Establece cookies `access_token` + `refresh_token`. Si la cuenta no está confirmada, devuelve cookie `account_confirmed` para el flujo de confirmación. |
| `PATCH` | `/auth/sing-up/confirm`              | `SingUpConfirmGuard`    | Confirma la cuenta con el código OTP recibido por email. Establece sesión completa.                                                                                       |
| `POST`  | `/auth/sing-up/resend-token-confirm` | `SingUpConfirmGuard`    | Reenvía el email de confirmación con un nuevo código OTP.                                                                                                                 |
| `GET`   | `/auth/sing-up/check-email`          | —                       | Verifica si un email ya está registrado.                                                                                                                                  |
| `GET`   | `/auth/sing-up/check-phone`          | —                       | Verifica si un teléfono ya está registrado.                                                                                                                               |
| `GET`   | `/auth/sing-up/check-username`       | —                       | Verifica si un username ya está en uso.                                                                                                                                   |
| `POST`  | `/auth/recover-password`             | —                       | Solicita el restablecimiento de contraseña. Envía email con enlace de reset.                                                                                              |
| `GET`   | `/auth/reset-password/verify-token`  | —                       | Verifica que el token de restablecimiento siga siendo válido.                                                                                                             |
| `POST`  | `/auth/reset-password`               | —                       | Restablece la contraseña usando el token del email.                                                                                                                       |
| `GET`   | `/auth/me`                           | `AuthSingInGuard`       | Retorna la información del usuario autenticado.                                                                                                                           |
| `POST`  | `/auth/refresh-token`                | `AuthRefreshTokenGuard` | Rota el par de tokens de acceso y refresco.                                                                                                                               |
| `POST`  | `/auth/logout`                       | `AuthSingInGuard`       | Cierra la sesión activa y elimina las cookies.                                                                                                                            |

---

## Flujos principales

### Registro de usuario

```
Cliente                    API                          Workers / Redis
  │                         │                               │
  ├─ POST /auth/sing-up ───►│                               │
  │                         ├─ Valida DTO                   │
  │                         ├─ Crea usuario (Postgres)      │
  │                         ├─ Hashea contraseña (bcrypt)   │
  │                         ├─ Genera OTP numérico          │
  │                         ├─ Guarda hash OTP en Redis     │
  │                         ├─ Encola email de confirmación │──► AuthSingUpWorker
  │                         ├─ Genera JWT de confirmación   │         │
  │◄── Cookie account_confirmed + { create: true } ─────────│    Nodemailer envía email HTML
  │                         │                               │    con código OTP (15 min TTL)
```

### Inicio de sesión

```
POST /auth/sing-in
  ├─ Busca usuario por username
  ├─ Compara contraseña con bcrypt
  ├─ Si intentos fallidos ≥ 4 → AccountBlockWarningException
  ├─ Si cuenta bloqueada (lockUntil) → AccountLockException
  ├─ Si cuenta no confirmada → devuelve cookie account_confirmed (redirige a confirmar)
  ├─ Genera accessToken + refreshToken (JWT)
  ├─ Crea sesión en PostgreSQL y en Redis (session:{sid})
  └─ Establece cookies access_token + refresh_token
```

### Recuperación de contraseña

```
POST /auth/recover-password
  ├─ Verifica que el usuario exista
  ├─ Genera token único
  ├─ Guarda hash del token en Redis (15 min TTL)
  ├─ Encola email de reset ──► AuthRecoverPasswordWorker
  │                                 │
  │                          Nodemailer envía email HTML
  │                          con enlace: APP_URL/reset-password?token=...
  │
GET /auth/reset-password/verify-token?token=...
  └─ Valida que el token aún exista en Redis

POST /auth/reset-password
  ├─ Verifica token en Redis
  ├─ Actualiza la contraseña hasheada en Postgres
  └─ Elimina el token de Redis
```

### Gestión de sesiones

Cada sesión activa se registra en **dos lugares**:

- **PostgreSQL** (`UserSession`) — persistencia duradera con metadatos (IP, browser, device, OS, `expiresAt`).
- **Redis** (`session:{sid}`) — validación rápida en cada request autenticado. Si la clave no existe en Redis, la sesión se considera inválida aunque el JWT sea correcto.

El `AuthRefreshTokenGuard` valida la sesión activa en Redis y rota el `refreshTokenHash` para prevenir reutilización de tokens.

---

## Instalación y ejecución

### Prerrequisitos

- Node.js ≥ 24
- pnpm ≥ 9
- PostgreSQL
- Redis

### Instalación

```bash
pnpm install
```

### Base de datos

```bash
# Generar cliente Prisma
pnpm prisma generate

# Ejecutar migraciones
pnpm prisma migrate deploy
```

### Ejecución

```bash
# Desarrollo con hot-reload
pnpm start:dev

# Producción
pnpm build
pnpm start:prod
```

### Pruebas

```bash
# Unitarias
pnpm test

# Con cobertura
pnpm test:cov

# E2E
pnpm test:e2e
```

---

## Docker

El proyecto incluye soporte completo de Docker con un build multi-stage optimizado para producción.

### Estructura

| Archivo              | Descripción                                                 |
| -------------------- | ----------------------------------------------------------- |
| `Dockerfile`         | Build multi-stage (builder + production) con Node 24 Alpine |
| `docker-compose.yml` | Orquesta la app + PostgreSQL 16 + Redis 7                   |
| `.dockerignore`      | Excluye `node_modules`, `dist`, `.env`, logs                |

### Levantar todo el entorno con Docker Compose

```bash
# Levantar todos los servicios (app + postgres + redis)
docker compose up -d

# Ver logs en tiempo real
docker compose logs -f app

# Detener todo
docker compose down

# Detener y eliminar volúmenes (⚠️ borra datos)
docker compose down -v
```

### Solo infraestructura (desarrollo local)

Si quieres correr la app en local pero necesitas PostgreSQL y Redis:

```bash
# Solo levanta postgres y redis
docker compose up -d postgres redis

# Luego en otra terminal:
pnpm start:dev
```

### Build manual de la imagen

```bash
# Construir la imagen
docker build -t auth-backend .

# Ejecutar el contenedor
docker run -p 8000:8000 --env-file .env auth-backend
```

### Variables de entorno con Docker Compose

Docker Compose lee el `.env` automáticamente. Las variables relevantes son:

| Variable         | Uso en Docker Compose                          |
| ---------------- | ---------------------------------------------- |
| `PORT`           | Puerto expuesto del contenedor (default: 8000) |
| `DB_PORT`        | Puerto externo de PostgreSQL (default: 5432)   |
| `DB_USERNAME`    | Usuario de PostgreSQL                          |
| `DB_PASSWORD`    | Contraseña de PostgreSQL                       |
| `DB_NAME`        | Nombre de la base de datos                     |
| `REDIS_PORT`     | Puerto externo de Redis (default: 6379)        |
| `REDIS_PASSWORD` | Contraseña de Redis (opcional)                 |

### Healthchecks

Los servicios de infraestructura incluyen healthchecks. La app no arranca hasta que PostgreSQL y Redis estén listos (`depends_on` con `condition: service_healthy`).

### Migraciones en Docker

Después de levantar los servicios, aplica las migraciones:

```bash
# Desde el host (con pnpm local)
pnpm prisma migrate deploy

# O dentro del contenedor
docker compose exec app npx prisma migrate deploy
```

---

## Documentación API

Con el servidor en ejecución, la documentación interactiva está disponible en:

```
http://localhost:{PORT}/docs
```

Usa el tema **deepSpace** de Scalar. Las rutas protegidas por cookie muestran el candado 🔒 en la interfaz y permiten autenticarse directamente desde el navegador.

---

## Patrones destacados

**Guards**

- `AuthSingInGuard` — valida cookie `access_token` (JWT + sesión activa en Redis).
- `AuthRefreshTokenGuard` — valida cookie `refresh_token` (JWT + sesión activa en Redis).
- `SingUpConfirmGuard` — valida cookie `account_confirmed` (JWT de confirmación).

**Interceptors globales**

- `RequestAgentInterceptor` — parsea el `User-Agent` y popula `request.userAgentData` con `browser`, `version`, `device`, `os`.
- `ResponseTimeInterceptor` — añade el header `X-Response-Time` y registra duración de cada petición en el logger.

**Exception Filter global**

- `HttpExceptionFilter` — normaliza todas las excepciones al formato `{ statusCode, timestamp, error }` y las registra con el logger.

**Value Objects**

- `StringValueObject<T>` — base para todos los VOs de texto con validaciones encadenables (`ensureIsDefined`, `ensureNotEmpty`, `ensureIsFulfillRegExp`, `ensureLength`).
- `UuidV4ValueObject` — garantiza formato UUID v4 en todos los IDs de dominio.

**Cola de emails (BullMQ)**

| Cola                     | Worker                      | Plantilla                                |
| ------------------------ | --------------------------- | ---------------------------------------- |
| `email-confirm-account`  | `AuthSingUpWorker`          | `uploads/templates/confirm-account.html` |
| `email-recover-password` | `AuthRecoverPasswordWorker` | `uploads/templates/reset-password.html`  |

Las plantillas HTML usan los placeholders `{{NAMES}}` y `{{CODE}}` / `{{RESET_URL}}` que se reemplazan en tiempo de ejecución antes del envío.
