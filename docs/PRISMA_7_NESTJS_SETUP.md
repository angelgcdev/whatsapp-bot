# 📘 Guía de Configuración: Prisma ORM 7 + NestJS + SQLite

Esta guía documenta la arquitectura moderna y los cambios fundamentales introducidos en **Prisma 7 (`7.9.1+`)** para proyectos con **NestJS**.

---

## 🌟 Cambios Clave en Prisma 7

1. **Cliente en TypeScript Puro (Rust-free):**
   - El generador ya no usa binarios compilados en Rust.
   - En `schema.prisma`, el proveedor ahora es `provider = "prisma-client"` (en lugar del antiguo `"prisma-client-js"`).

2. **Ruta de salida obligatoria (`output`):**
   - El cliente ya no se genera dentro de `node_modules` por defecto.
   - Se debe definir explícitamente la ruta de salida (ej. `output = "../src/generated/prisma"`).

3. **Configuración centralizada en `prisma.config.ts`:**
   - La URL de la base de datos y la carga de `.env` se gestionan en este nuevo archivo de TypeScript.

4. **Uso de Driver Adapters:**
   - Para bases de datos SQLite se requiere un adaptador como `@prisma/adapter-better-sqlite3`.

---

## 🛠️ Paso a Paso de Instalación y Configuración

### 1. Instalación de Dependencias (en `backend-nestjs`)

```bash
npm install prisma@7 --save-dev
npm install @prisma/client@7 @prisma/adapter-better-sqlite3 dotenv

npx prisma init --datasource-provider sqlite
```

---

### 2. Archivo `.env`

Ubicación: `backend-nestjs/.env`

```env
DATABASE_URL="file:./prisma/dev.db"
```

> **Nota de Arquitectura:** Guardar la base de datos en `prisma/dev.db` mantiene la raíz del proyecto limpia.

---

### 3. Archivo `prisma.config.ts`

Ubicación: `backend-nestjs/prisma.config.ts`

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

---

### 4. Archivo `schema.prisma`

Ubicación: `backend-nestjs/prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "sqlite"
}

model Task {
  id        Int      @id @default(autoincrement())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

---

### 5. Migraciones y Generación de Código

```bash
# Crear y aplicar la migración a la base de datos SQLite
npx prisma migrate dev --name init

# Generar el cliente tipado en src/generated/prisma
npx prisma generate
```

---

### 6. Integración en NestJS

#### `PrismaService` (`src/prisma/prisma.service.ts`)

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL || "file:./prisma/dev.db",
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

#### `PrismaModule` (`src/prisma/prisma.module.ts`)

```typescript
import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

#### Registrar en `app.module.ts`

```typescript
import { Module } from "@nestjs/common";
import { TasksModule } from "./tasks/tasks.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [TasksModule, PrismaModule],
})
export class AppModule {}
```

---

### 7. Uso en Servicios de Negocio (`src/tasks/tasks.service.ts`)

```typescript
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: { title: createTaskDto.title },
    });
  }

  findAll() {
    return this.prisma.task.findMany({
      orderBy: { createdAt: "desc" }, // Mejor práctica: ordenado por BD
    });
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException(`Task #${id} not found`);
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    await this.findOne(id);
    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.task.delete({ where: { id } });
    return { message: `Task #${id} deleted successfully` };
  }
}
```
