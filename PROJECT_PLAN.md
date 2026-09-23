# 🚀 Especificación Técnica y Plan de Proyecto (Scrum Roadmap)

## Sistema: WhatsApp Bot con Meta Cloud API (WhatsApp Cloud API Bot)

> **Propósito:** Esta guía de planificación define la arquitectura, el flujo de comunicación con la API de Meta (WhatsApp Business Cloud API), contratos de endpoints, criterios de aceptación y el desglose de Sprints para construir un bot de WhatsApp funcional de forma ultra-incremental y con mejores prácticas de ingeniería de software.

---

## 🧭 Metodología de Aprendizaje y Scrum

Seguimos las directrices establecidas en [`.agents/rules/REGLAS_DE_APRENDIZAJE.md`](.agents/rules/REGLAS_DE_APRENDIZAJE.md):

1. **Rol del Tutor:** Guiar, explicar conceptos paso a paso y dar retroalimentación. **El tutor NO escribe código directamente en el proyecto.**
2. **Rol del Alumno:** Tú escribes el código, ejecutas comandos, pruebas y solucionas errores.
3. **Metodología Conceptual:** Cada nuevo concepto se explicará bajo la regla de:
   - **¿Qué es?**
   - **¿Para qué sirve?**
   - **¿Por qué existe?**
   - **¿Cómo se ve (sintaxis básica)?**
   - **Práctica aplicada al proyecto.**
4. **Construcción Ultra-Incremental:** Desde el esqueleto mínimo absoluto hasta la solución completa, justificando cada archivo y línea de código.
5. **Estándar de la Industria:** Código, tipos, variables y tests 100% en inglés (`messages.service.ts`, `WebhookController`, etc.). Explicaciones y tutoría en español.

---

## 🏛️ Arquitectura del Sistema y Funcionamiento de Meta Cloud API

Para que un bot de WhatsApp funcione con la infraestructura oficial de Meta, intervienen 3 actores clave:

```
┌──────────────┐         ┌────────────────────────┐         ┌──────────────────────┐
│   Usuario    │ ──────> │ Servidores de Meta     │ ──────> │ Nuestro Backend      │
│  (WhatsApp)  │         │ (WhatsApp Cloud API)   │ (POST)  │ (NestJS / Webhook)   │
└──────────────┘         └────────────────────────┘         └──────────────────────┘
       ▲                                                               │
       │                 ┌────────────────────────┐                    │
       └──────────────── │ Graph API de Meta      │ <──────────────────┘
            (Mensaje)    │ (POST /messages)       │    (Envío de respuesta HTTP)
                         └────────────────────────┘
```

### 1. ¿Cómo entran los mensajes? (Inbound / Webhook)

- El usuario envía un mensaje de WhatsApp a nuestro número de negocio/prueba.
- Meta recibe el mensaje en sus servidores y dispara una petición HTTP `POST` a una URL pública de nuestro backend (**Webhook**).
- **El reto en local:** Como nuestro backend corre en `localhost:3000`, Meta no puede verlo. Necesitamos un túnel seguro (ej. **ngrok**) para darle una URL pública HTTPS temporal (`https://xxxx.ngrok-free.app/webhook`).

### 2. ¿Cómo validamos el Webhook? (Handshake / Verificación)

- Antes de que Meta empiece a enviarnos mensajes, nos pide verificar que somos los dueños del servidor.
- Meta envía una petición HTTP `GET` con un token de verificación (`hub.verify_token`) y un reto (`hub.challenge`).
- Si el token coincide con el que configuramos en el panel de desarrolladores de Meta, devolvemos el valor del `hub.challenge` con status `200 OK`.

### 3. ¿Cómo enviamos mensajes de vuelta? (Outbound / Graph API)

- Para responderle al usuario, nuestro backend hace una petición HTTP `POST` a la Graph API de Meta:
  `https://graph.facebook.com/v22.0/{PHONE_NUMBER_ID}/messages`
- Enviamos en el Header un `Bearer Token` de acceso y en el Body un JSON indicando a qué número responder (`to`), el tipo de mensaje (`type: "text"`) y el contenido (`text: { "body": "..." }`).

---

## 🛠️ Stack Tecnológico

- **Backend:** NestJS 11+ (TypeScript estricto, Módulos, Controladores, Servicios, DTOs con `class-validator`).
- **HTTP Client:** API nativa `fetch` (Node.js 18+) para comunicación saliente con Meta Graph API (sin dependencias externas).
- **Configuración:** `@nestjs/config` con variables de entorno (`.env`) seguras.
- **Túnel de Desarrollo:** `ngrok` (para exponer el webhook en desarrollo local).
- **Testing:** Jest y Supertest (E2E y pruebas unitarias con tipado estricto).

---

## 📡 Contrato de API del Webhook

| Método | Endpoint   | Query / Body                                    | Descripción                               |
| :----- | :--------- | :---------------------------------------------- | :---------------------------------------- |
| `GET`  | `/webhook` | `hub.mode`, `hub.verify_token`, `hub.challenge` | Handshake de verificación con Meta        |
| `POST` | `/webhook` | Payload JSON de evento de Meta                  | Recepción de mensajes y cambios de estado |

---

## 🎯 Definition of Done (DoD) por Sprint

Para considerar cualquier historia técnica o Sprint como **TERMINADO**:

1. **Compilación Limpia:** `npm run build` compila con cero errores.
2. **Tipado Estricto:** Código y pruebas 100% en inglés con TypeScript estricto.
3. **Verificación en Vivo:** El hito se valida funcionalmente (en terminal, con curl o en WhatsApp real).
4. **Commit Semántico Obligatorio:** Se debe realizar un commit en Git (`feat:`, `test:`, etc.) antes de avanzar al siguiente Sprint.

---

## 📅 Roadmap de Sprints

---

### 🔹 Sprint 0: Setup de Entorno y Cuenta de Meta for Developers

**Objetivo del Sprint:** Configurar la cuenta de desarrollador de Meta, obtener credenciales de prueba de WhatsApp y preparar el entorno de desarrollo local con túnel seguro.

#### Tareas Técnicas:

- [x] **TS-0.1:** Crear/configurar App tipo "Other / Business" en [Meta for Developers](https://developers.facebook.com/) y añadir el producto **WhatsApp**.
- [x] **TS-0.2:** Obtener credenciales iniciales en el panel de WhatsApp:
  - `WHATSAPP_TOKEN` (Token de acceso de prueba).
  - `PHONE_NUMBER_ID` (ID del número de prueba).
  - `VERIFY_TOKEN` (Cadena secreta elegida por nosotros para el handshake).
- [x] **TS-0.3:** Inicializar proyecto Backend NestJS con TypeScript estricto.
- [x] **TS-0.4:** Instalar y verificar herramienta de túnel local (`ngrok`).

---

### 🔹 Sprint 1: Handshake y Verificación del Webhook (`GET /webhook`)

**Objetivo del Sprint:** Lograr que Meta valide con éxito la URL de nuestro webhook local mediante el endpoint de verificación `GET`.

#### Historias Técnicas:

- [x] **TS-1.1 (Configuración de Entorno):** Configurar `@nestjs/config` y archivo `.env` con variables tipadas.
- [x] **TS-1.2 (Endpoint de Verificación):** Implementar `GET /webhook` validando `hub.mode === 'subscribe'` y `hub.verify_token === VERIFY_TOKEN`.
- [x] **TS-1.3 (Registro en Meta):** Exponer con `ngrok`, ingresar la URL en el panel de Meta y obtener confirmación de suscripción exitosa.

---

### 🔹 Sprint 2: Recepción de Mensajes Entrantes (`POST /webhook`)

**Objetivo del Sprint:** Recibir los mensajes enviados por el usuario desde WhatsApp en tiempo real, parsear el payload de Meta y extraer el remitente y texto.

#### Historias de Usuario / Técnicas:

- [x] **US-2.1 (Recepción de Eventos):** Recibir eventos de Meta, devolver inmediatamente HTTP `200 OK` (requerido por Meta para evitar reintentos) y procesar de forma asíncrona.
- [x] **TS-2.2 (Payload Parser):** Extraer con seguridad la información relevante:
  - Número de teléfono del remitente (`from`).
  - Tipo de mensaje (`type === 'text'`).
  - Contenido del mensaje (`text.body`).
  - Evitar procesar eventos de status (leído, entregado, enviado) para no duplicar lógica.

---

### 🔹 Sprint 3: Envío de Mensajes Salientes - Echo Bot Mínimo Funcional

**Objetivo del Sprint:** Conectar nuestro backend con la Graph API de Meta para responderle al usuario en WhatsApp con un mensaje de eco ("Tú dijiste: ...").

#### Historias de Usuario / Técnicas:

- [x] **TS-3.1 (Servicio WhatsApp API):** Crear servicio WhatsApp con API nativa `fetch` para ejecutar peticiones `POST` a `https://graph.facebook.com/v22.0/{PHONE_NUMBER_ID}/messages`.
- [x] **US-3.2 (Echo Bot):** Cuando el usuario escriba cualquier texto al bot, el bot responderá automáticamente: `"🤖 Eco: <mensaje_recibido>"`.
- [x] **TS-3.3 (Validación en Vivo):** Enviar un mensaje desde un teléfono real de WhatsApp al número de prueba de Meta y verificar la respuesta automática inmediata.

---

### 🔹 Sprint 4: Lógica de Bot y Comandos Básicos

**Objetivo del Sprint:** Estructurar una arquitectura limpia para procesar diferentes comandos de texto y estructurar respuestas interactivas.

#### Historias de Usuario:

- [x] **US-4.1 (Comando Ayuda / Menú):** Responder con una lista de opciones al recibir `"hola"`, `"menu"` o `"ayuda"`.
- [x] **US-4.2 (Manejo de Fallback):** Responder con un mensaje de orientación amigable cuando el mensaje no coincida con ningún comando conocido.
- [x] **TS-4.3 (Arquitectura de Servicios):** Separar `WebhookController` (recibe la petición), `WebhookService` (valida y rutea) y `BotLogicService` (decide qué responder).

---

### 🔹 Sprint 5: Testing Automatizado y Robustez

**Objetivo del Sprint:** Garantizar que el webhook y el servicio de mensajería cuenten con pruebas unitarias y de integración, mockeando la API de Meta.

#### Historias Técnicas:

- [x] **TS-5.1:** Pruebas unitarias de `WebhookController` y verificación del handshake.
- [x] **TS-5.2:** Pruebas unitarias de `WhatsAppService` mockeando llamadas HTTP salientes.
- [x] **TS-5.3:** Pruebas E2E de simulación de webhook entrante con Supertest.

---

## 🚀 Fase 2: Gestión Dinámica de Respuestas desde Angular (Sprints 6 al 10)

---

### 🔹 Sprint 6: Persistencia y Modelo de Datos con Prisma ORM 7 y SQLite

**Objetivo del Sprint:** Configurar Prisma ORM 7 en el backend de NestJS con SQLite, definir el modelo `BotResponse` y ejecutar la primera migración con script de seed inicial para preservar los comandos existentes.

#### Historias Técnicas:

- [x] **TS-6.1 (Instalación de Prisma 7):** Instalar `prisma@7`, `@prisma/client@7`, `@prisma/adapter-better-sqlite3` y configurar `prisma.config.ts` y `.env` según `docs/PRISMA_7_NESTJS_SETUP.md`.
- [x] **TS-6.2 (Modelado en schema.prisma):** Definir el modelo `BotResponse` (`id`, `keyword`, `response`, `isActive`, `createdAt`, `updatedAt`).
- [x] **TS-6.3 (PrismaService & PrismaModule):** Crear el servicio global `PrismaService` y su módulo en NestJS para inyección de dependencias.
- [x] **TS-6.4 (Migración & Seed Inicial):** Ejecutar migración y poblar la base de datos con los comandos iniciales (`hola`, `menu`, `1`, `2` y fallback).

---

### 🔹 Sprint 7: API REST de Gestión de Respuestas (`/bot-responses`)

**Objetivo del Sprint:** Exponer endpoints CRUD en NestJS con DTOs fuertemente tipados y validados con `class-validator`, y habilitar CORS para consumo desde Angular.

#### Historias de Usuario / Técnicas:

- [ ] **TS-7.1 (Generación de Módulo):** Crear módulo `BotResponsesModule` (`controller`, `service`).
- [ ] **TS-7.2 (DTOs con Validación):** Implementar `CreateBotResponseDto` y `UpdateBotResponseDto` con validaciones de campos requeridos y tipos.
- [ ] **TS-7.3 (Endpoints CRUD):** Implementar `GET /bot-responses`, `POST /bot-responses`, `PATCH /bot-responses/:id` y `DELETE /bot-responses/:id`.
- [ ] **TS-7.4 (Habilitación de CORS & Pruebas):** Habilitar CORS en `main.ts` y crear pruebas unitarias para el controlador y servicio de respuestas.

---

### 🔹 Sprint 8: Conexión Dinámica de `BotService` con Base de Datos

**Objetivo del Sprint:** Reemplazar el `switch-case` estático en `BotService` por consultas asíncronas a la base de datos a través de Prisma.

#### Historias Técnicas:

- [ ] **TS-8.1 (Inyección de Dependencias):** Inyectar `PrismaService` en `BotService` y convertir `processMessage` a método asíncrono.
- [ ] **TS-8.2 (Búsqueda de Comandos):** Consultar en SQLite la palabra clave normalizada (`keyword`) con estado `isActive = true`.
- [ ] **TS-8.3 (Fallback Dinámico):** Obtener mensaje de fallback configurado en BD si el comando no coincide.
- [ ] **TS-8.4 (Actualización de Tests):** Adaptar `bot.service.spec.ts` y `webhook.service.spec.ts` mockeando el acceso a Prisma.

---

### 🔹 Sprint 9: Frontend Angular - Módulo de Gestión (`bot-responses`)

**Objetivo del Sprint:** Construir en Angular (Feature-Based) la interfaz de usuario para listar, crear, editar y eliminar respuestas del bot con Tailwind CSS.

#### Historias Técnicas / UI:

- [ ] **TS-9.1 (Configuración HTTP):** Configurar `provideHttpClient()` en `app.config.ts`.
- [ ] **TS-9.2 (Servicio Angular):** Crear `BotResponsesService` consumiendo la API de NestJS con tipado estricto.
- [ ] **TS-9.3 (Vista de Listado):** Diseñar tabla o tarjetas con Tailwind CSS para mostrar comandos, respuestas y estado activo.
- [ ] **TS-9.4 (Formulario Reactivo):** Crear formulario con `ReactiveFormsModule` para crear y editar respuestas con validación visual.
- [ ] **TS-9.5 (Eliminación con Confirmación):** Implementar eliminación reactiva de respuestas con actualización en vivo de la lista.

---

### 🔹 Sprint 10: Validación Integral End-to-End (UI ➔ Backend ➔ WhatsApp)

**Objetivo del Sprint:** Validar en vivo el flujo completo desde la interfaz web hasta la respuesta enviada por WhatsApp al usuario real.

#### Historias Técnicas:

- [ ] **TS-10.1 (Creación desde UI):** Crear un comando nuevo desde la pantalla de Angular en `http://localhost:4200`.
- [ ] **TS-10.2 (Validación en WhatsApp):** Enviar la palabra clave desde WhatsApp y verificar que el bot devuelva la respuesta recién configurada.
- [ ] **TS-10.3 (Edición y Eliminación en Vivo):** Modificar la respuesta desde la UI y validar que el cambio se refleje inmediatamente en el chat.
- [ ] **TS-10.4 (DoD y Commit):** Realizar compilación de producción en ambos proyectos y commit semántico de cierre de Fase 2.

---

## 🔮 Backlog de Futuras Mejoras (Fase 3)

- [ ] Integración con LLM (Gemini / OpenAI) para respuestas inteligentes con memoria de conversación.
- [ ] Soporte para mensajes multimedia (imágenes, audios, documentos).
- [ ] Mensajes interactivos de WhatsApp (botones de respuesta rápida y listas desplegables).
- [ ] Historial de conversaciones de chat persistido en base de datos.
- [ ] Dashboard con métricas de mensajes en tiempo real.

---

## 📊 Tablero de Progreso

| Sprint        | Enfoque Principal                                     | Estado         |
| :------------ | :---------------------------------------------------- | :------------- |
| **Sprint 0**  | Setup de Entorno, Cuenta Meta for Developers & Túnel  | 🟢 Completado  |
| **Sprint 1**  | Handshake y Verificación del Webhook (`GET /webhook`) | 🟢 Completado  |
| **Sprint 2**  | Recepción de Mensajes Entrantes (`POST /webhook`)     | 🟢 Completado  |
| **Sprint 3**  | Envío de Mensajes con Graph API (Echo Bot Funcional)  | 🟢 Completado  |
| **Sprint 4**  | Lógica de Comandos y Arquitectura Limpia              | 🟢 Completado  |
| **Sprint 5**  | Pruebas Unitarias y E2E con Mocks                     | 🟢 Completado  |
| **Sprint 6**  | Persistencia y Modelo Prisma 7 + SQLite en Backend    | ⚪ Por Iniciar |
| **Sprint 7**  | API REST de Gestión de Respuestas (`/bot-responses`)  | ⚪ Por Iniciar |
| **Sprint 8**  | Conexión Dinámica de `BotService` con Base de Datos   | ⚪ Por Iniciar |
| **Sprint 9**  | Frontend Angular - Gestión de Respuestas con Tailwind | ⚪ Por Iniciar |
| **Sprint 10** | Validación Integral End-to-End (UI ➔ WhatsApp)        | ⚪ Por Iniciar |
