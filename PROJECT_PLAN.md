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
* **Backend:** NestJS 11+ (TypeScript estricto, Módulos, Controladores, Servicios, DTOs con `class-validator`).
* **HTTP Client:** API nativa `fetch` (Node.js 18+) para comunicación saliente con Meta Graph API (sin dependencias externas).
* **Configuración:** `@nestjs/config` con variables de entorno (`.env`) seguras.
* **Túnel de Desarrollo:** `ngrok` (para exponer el webhook en desarrollo local).
* **Testing:** Jest y Supertest (E2E y pruebas unitarias con tipado estricto).

---

## 📡 Contrato de API del Webhook

| Método | Endpoint | Query / Body | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/webhook` | `hub.mode`, `hub.verify_token`, `hub.challenge` | Handshake de verificación con Meta |
| `POST` | `/webhook` | Payload JSON de evento de Meta | Recepción de mensajes y cambios de estado |

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
- [ ] **US-4.1 (Comando Ayuda / Menú):** Responder con una lista de opciones al recibir `"hola"`, `"menu"` o `"ayuda"`.
- [ ] **US-4.2 (Manejo de Fallback):** Responder con un mensaje de orientación amigable cuando el mensaje no coincida con ningún comando conocido.
- [ ] **TS-4.3 (Arquitectura de Servicios):** Separar `WebhookController` (recibe la petición), `WebhookService` (valida y rutea) y `BotLogicService` (decide qué responder).

---

### 🔹 Sprint 5: Testing Automatizado y Robustez
**Objetivo del Sprint:** Garantizar que el webhook y el servicio de mensajería cuenten con pruebas unitarias y de integración, mockeando la API de Meta.

#### Historias Técnicas:
- [ ] **TS-5.1:** Pruebas unitarias de `WebhookController` y verificación del handshake.
- [ ] **TS-5.2:** Pruebas unitarias de `WhatsAppService` mockeando llamadas HTTP salientes.
- [ ] **TS-5.3:** Pruebas E2E de simulación de webhook entrante con Supertest.

---

## 🔮 Backlog de Futuras Mejoras (Fase 2)
- [ ] Integración con LLM (Gemini / OpenAI) para respuestas inteligentes con memoria de conversación.
- [ ] Soporte para mensajes multimedia (imágenes, audios, documentos).
- [ ] Mensajes interactivos de WhatsApp (botones de respuesta rápida y listas desplegables).
- [ ] Base de datos (PostgreSQL / SQLite con Prisma) para persistir historial de conversaciones y perfiles de usuarios.
- [ ] Panel administrativo en Angular para monitorear conversaciones y métricas en tiempo real.

---

## 📊 Tablero de Progreso

| Sprint | Enfoque Principal | Estado |
| :--- | :--- | :--- |
| **Sprint 0** | Setup de Entorno, Cuenta Meta for Developers & Túnel | 🟢 Completado |
| **Sprint 1** | Handshake y Verificación del Webhook (`GET /webhook`) | 🟢 Completado |
| **Sprint 2** | Recepción de Mensajes Entrantes (`POST /webhook`) | 🟢 Completado |
| **Sprint 3** | Envío de Mensajes con Graph API (Echo Bot Funcional) | 🟢 Completado |
| **Sprint 4** | Lógica de Comandos y Arquitectura Limpia | ⚪ Por Iniciar |
| **Sprint 5** | Pruebas Unitarias y E2E con Mocks | ⚪ Por Iniciar |


