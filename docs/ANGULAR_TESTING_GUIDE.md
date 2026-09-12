# 🧪 Guía de Testing Automatizado en Angular Moderno (v18 - v21+)

> **Stack de Testing del Proyecto:** Angular Moderno + Vitest (`@angular/build:unit-test`) + JSDOM + TestBed.

Esta guía documenta los estándares, patrones, mejores prácticas y recetas de pruebas unitarias y de integración para nuestra aplicación.

---

## 🏛️ 1. Filosofía y Estructura Universal: Patrón AAA

Todas las pruebas deben seguir de manera visible y estricta el patrón **Arrange-Act-Assert**:

```typescript
it('debe registrar y mostrar un nuevo toast', () => {
  // 1. ARRANGE (Preparar el escenario, datos iniciales y mocks)
  const mensaje = 'Operación completada';

  // 2. ACT (Ejecutar la función o acción bajo prueba)
  service.success(mensaje);

  // 3. ASSERT (Verificar que el estado o resultado esperado sea el correcto)
  const toasts = service.toasts();
  expect(toasts.length).toBe(1);
  expect(toasts[0].message).toBe(mensaje);
  expect(toasts[0].type).toBe('success');
});
```

---

## 📐 2. Anatomía de una Suite de Pruebas

En Angular con Vitest se utilizan las siguientes funciones globales:

| Función | Propósito | Ejemplo |
| :--- | :--- | :--- |
| `describe(titulo, fn)` | Agrupa un conjunto de pruebas relacionadas (Suite). | `describe('ToastService', () => { ... })` |
| `it(descripcion, fn)` | Define un caso de prueba individual y atómico. | `it('debe incrementar el contador', () => { ... })` |
| `beforeEach(fn)` | Se ejecuta **antes de cada `it`**. Ideal para resetear estado. | Limpiar variables, configurar `TestBed`. |
| `afterEach(fn)` | Se ejecuta **después de cada `it`**. Limpieza final. | `httpTesting.verify()` para peticiones pendientes. |
| `expect(valor)` | Inicia una aserción sobre un resultado. | `expect(signal()).toBe(true)` |

---

## ⚙️ 3. Comandos Útiles para Ejecutar Pruebas

Los comandos se ejecutan dentro del directorio `frontend/`:

```bash
# 1. Ejecutar todas las pruebas una sola vez (modo CI/terminal limpio)
npm test -- --no-watch

# 2. Ejecutar únicamente un archivo de prueba específico
npx ng test --no-watch --include src/app/core/services/toast.spec.ts

# 3. Ejecutar pruebas en modo observador (watch continuo mientras programas)
npm test

# 4. Generar reporte de cobertura de código (Coverage)
npm test -- --no-watch --coverage
```

---

## 🧩 4. Recetas de Testing por Tipo de Elemento

### A. Servicios Puros con Signals (Sin dependencias externas)

Los servicios que únicamente gestionan estado mediante Signals (`signal()`, `computed()`) no requieren mocks complejos:

```typescript
import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('debe inicializarse con lista vacía de toasts', () => {
    expect(service.toasts()).toEqual([]);
  });

  it('debe agregar un toast correctamente al llamar a show()', () => {
    service.show('Mensaje de prueba', 'info');
    
    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].message).toBe('Mensaje de prueba');
  });

  it('debe remover un toast por su id', () => {
    service.show('Toast 1', 'info');
    const id = service.toasts()[0].id;

    service.remove(id);

    expect(service.toasts().length).toBe(0);
  });
});
```

---

### B. Servicios con HTTP y Mocks (`provideHttpClientTesting`)

Para servicios que hacen peticiones HTTP, **NUNCA** se llama a la API real. Se intercepta la solicitud usando `HttpTestingController`:

```typescript
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TasksService } from './tasks.service';
import { environment } from '../../../../environments/environment';

describe('TasksService', () => {
  let service: TasksService;
  let httpTesting: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/tasks`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(), // Intercepta tráfico HTTP
      ],
    });

    service = TestBed.inject(TasksService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Garantiza que no quedaron llamadas HTTP sin responder
    httpTesting.verify();
  });

  it('debe cargar tareas y actualizar las Signals reactivas', () => {
    const mockTasks = [{ id: '1', title: 'Test 1', completed: false }];

    // Act
    service.loadTasks();

    // Assert de la petición HTTP
    const req = httpTesting.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    // Simular respuesta del backend
    req.flush(mockTasks);

    // Assert del estado de Signals
    expect(service.tasks()).toEqual(mockTasks);
    expect(service.totalTasks()).toBe(1);
  });
});
```

---

### C. Componentes Presentacionales (Dumb Components) con Signal Inputs/Outputs

Para componentes que reciben datos por `input()` y emiten por `output()`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskStats } from './task-stats.component';

describe('TaskStatsComponent', () => {
  let component: TaskStats;
  let fixture: ComponentFixture<TaskStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskStats],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskStats);
    component = fixture.componentInstance;
  });

  it('debe renderizar los contadores pasados por Signal Inputs', () => {
    // 1. Arrange: Asignar valores a los signal inputs usando fixture.componentRef.setInput
    fixture.componentRef.setInput('total', 10);
    fixture.componentRef.setInput('pending', 4);
    fixture.componentRef.setInput('completed', 6);

    // 2. Act: Forzar detección de cambios en el DOM
    fixture.detectChanges();

    // 3. Assert: Verificar el texto en el DOM
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('10');
    expect(compiled.textContent).toContain('4');
    expect(compiled.textContent).toContain('6');
  });
});
```

---

### D. Directivas de Atributo y DOM

Para probar directivas que interactúan con elementos HTML (como enfocar inputs o evitar doble clic):

```typescript
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreventDoubleClick } from './prevent-double-click';

// Creamos un componente host temporal para alojar la directiva
@Component({
  template: `<button appPreventDoubleClick (click)="onClick()">Click me</button>`,
  imports: [PreventDoubleClick],
})
class TestHostComponent {
  clickCount = 0;
  onClick() {
    this.clickCount++;
  }
}

describe('PreventDoubleClickDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('debe ignorar clicks sucesivos dentro del tiempo límite', () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    button.click();
    button.click(); // Segundo clic inmediato

    expect(fixture.componentInstance.clickCount).toBe(1);
  });
});
```

---

### E. Guards e Interceptors Funcionales

En Angular moderno, Guards e Interceptors son funciones puras (`CanActivateFn`, `HttpInterceptorFn`). Se prueban dentro de un contexto de inyección:

```typescript
import { TestBed } from '@angular/core/testing';
import { authGuard } from './auth-guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  it('debe permitir la navegación si el usuario está autenticado', () => {
    const fakeAuthService = { isAuthenticated: () => true };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
      ],
    });

    const resultado = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(resultado).toBe(true);
  });
});
```

---

## 🎯 5. Reglas de Oro del Testing en este Proyecto

1. **Cero llamadas de red reales:** Todas las peticiones HTTP externas deben ser interceptadas o mockeadas.
2. **Pruebas deterministas:** Los tests no deben depender de la hora real, de la velocidad de la máquina ni de orden de ejecución.
3. **Aislamiento absoluto:** Lo que ocurre en un `it(...)` no debe afectar a los demás. Todo estado se reinicia en `beforeEach`.
4. **Pruebas de comportamiento, no de implementación:** Prueba qué devuelve la función o qué ve el usuario en el DOM, no variables privadas internas.
