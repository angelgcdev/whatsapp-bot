# 🏛️ Guía de Arquitectura Angular: Feature-Based (Core / Shared / Layout / Features)

> Guía de referencia técnica para la estructura estándar de proyectos Angular modernos (v17+ Standalone).

---

## 📁 Árbol de Estructura de Directorios

```text
src/
└── app/
    ├── core/                  # 🛡️ INFRAESTRUCTURA & SINGLETONS GLOBALES
    │   ├── guards/            # auth.guard.ts, role.guard.ts
    │   ├── interceptors/      # auth.interceptor.ts, error.interceptor.ts, loading.interceptor.ts
    │   ├── models/            # auth.model.ts, session.model.ts, toast.model.ts
    │   └── services/          # auth.service.ts, toast.service.ts, loading.service.ts
    │
    ├── shared/                # 🧩 ELEMENTOS 100% REUTILIZABLES EN TODA LA APP
    │   ├── components/        # spinner/, toast-container/, button/, modal/ (Dumb UI)
    │   ├── directives/        # auto-focus.directive.ts, prevent-double-click.directive.ts
    │   ├── pipes/             # relative-time.pipe.ts, currency-format.pipe.ts
    │   └── models/            # pagination.model.ts, api-response.model.ts
    │
    ├── layout/                # 🖼️ ESTRUCTURA VISUAL BASE (Estilo Next.js layout)
    │   ├── header/            # header.component.ts (Logo, usuario, logout)
    │   ├── sidebar/           # sidebar.component.ts (Menú de navegación lateral)
    │   └── footer/            # footer.component.ts
    │
    ├── features/              # 📦 MÓDULOS DE NEGOCIO ENCAPSULADOS (Vertical Slices)
    │   ├── auth/              # Módulo de Autenticación
    │   │   └── pages/         # login-page/, register-page/
    │   │
    │   └── tasks/             # Módulo de Dominio (ej. Tareas)
    │       ├── components/    # task-form/, task-item/, task-list/, task-stats/
    │       ├── models/        # task.model.ts
    │       ├── pages/         # tasks-page/, task-detail-page/
    │       └── services/      # tasks.service.ts (Servicio HTTP exclusivo de este dominio)
    │
    ├── app.component.ts       # Contenedor raíz limpio (<app-spinner />, <app-header />, <router-outlet />)
    ├── app.config.ts          # Providers globales (provideRouter, provideHttpClient, interceptors)
    └── app.routes.ts          # Rutas principales con Lazy Loading
```

---

## 🎯 Reglas de Oro por Carpeta

| Carpeta         | Propósito                                                                  | Regla de Oro                                                                               |
| :-------------- | :------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| **`core/`**     | Servicios globales, interceptores, guards y modelos de sesión.             | **Solo lógica de infraestructura.** No contiene vistas ni HTML.                            |
| **`shared/`**   | Componentes UI tontos, directivas y pipes reutilizables.                   | **Cero lógica de negocio.** Un componente de `shared` no debe importar nada de `features`. |
| **`layout/`**   | Header, navbar, sidebar, footer y contenedores de diseño.                  | Define el armazón donde se renderizan las páginas con `<router-outlet />`.                 |
| **`features/`** | Cada funcionalidad de negocio independiente (`tasks`, `users`, `billing`). | **Autocontenido.** Todo lo que la feature necesita para funcionar vive en su carpeta.      |

---
