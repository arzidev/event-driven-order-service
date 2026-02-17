# Sistema de Órdenes Impulsado por Eventos - Servicio de Órdenes

> **Microservicio listo para producción** implementando Clean Architecture con patrones event-driven. Diseñado para escalabilidad, mantenibilidad y seguridad de tipos.

![Estado](https://img.shields.io/badge/estado-activo-brightgreen)
![Node](https://img.shields.io/badge/Node.js-v18+-green)
![Licencia](https://img.shields.io/badge/licencia-MIT-blue)

## 📋 Descripción General

Un robusto **microservicio de gestión de órdenes** que demuestra patrones de arquitectura de nivel empresarial y mejores prácticas:

- ✅ **Clean Architecture** - Separación clara de responsabilidades en 4 capas
- ✅ **Event-Driven** - Comunicación asíncrona vía RabbitMQ
- ✅ **Type-Safe** - TypeScript completo con modo estricto
- ✅ **Bien Testeado** - Tests unitarios + E2E con alta cobertura
- ✅ **Path Aliases** - Imports limpios y mantenibles
- ✅ **Migraciones de BD** - Prisma con migraciones versionadas

**Stack Tecnológico:**
- NestJS 11 - Framework Node.js para producción
- TypeScript 5.7 - Seguridad de tipos
- PostgreSQL 15 - Base de datos relacional
- RabbitMQ 3.12 - Broker de mensajes
- Prisma 7 - ORM moderno
- Jest - Framework de testing

## 🏗️ Arquitectura

### Implementación de Clean Architecture

El proyecto está organizado en **4 capas**, cada una con responsabilidades claras:

```
┌─────────────────────────────────────────┐
│   PRESENTACIÓN (@presentation/)         │  ← Controladores HTTP, Event Handlers
├─────────────────────────────────────────┤
│   APLICACIÓN (@application/)            │  ← Lógica de Negocio, Casos de Uso
├─────────────────────────────────────────┤
│   DOMINIO (@domain/)                    │  ← Entidades, Interfaces, Reglas
├─────────────────────────────────────────┤
│   INFRAESTRUCTURA (@infrastructure/)    │  ← Servicios Externos, BD, Broker
└─────────────────────────────────────────┘
```

**¿Por qué Clean Architecture?**
- Independencia de frameworks
- Lógica de negocio testeable
- Facilidad de refactorización
- Flujo de dependencias claro (siempre hacia adentro)

### Responsabilidades Arquitectónicas

| Capa | Responsabilidad | Ejemplos |
|------|---|---|
| **Presentación** | Endpoints HTTP, listeners de eventos, manejo de errores | `OrdersController`, `OrdersEventsController` |
| **Aplicación** | Casos de uso, DTOs, orquestación | `CreateOrderUseCase`, `FindAllOrdersUseCase` |
| **Dominio** | Entidades, reglas de negocio, interfaces | `Order`, `OrderItem`, `IOrderRepository` |
| **Infraestructura** | Base de datos, servicios externos, adaptadores | `OrderRepository`, `EventBusAdapter`, `PrismaService` |

### Comunicación Event-Driven

```
CreateOrderUseCase
    ↓
OrderRepository.create()
    ↓
RabbitMQ: emit('OrderCreated', orderData)
    ↓
Otros Servicios escuchan 'OrderCreated'
```

**Beneficios:**
- Bajo acoplamiento entre servicios
- Procesamiento asíncrono
- Escalabilidad
- Resiliencia

## 📁 Estructura del Proyecto

```
order-service/
│
├── src/
│   ├── domain/                     ⚙️ Núcleo de Negocio
│   │   ├── entities/
│   │   │   ├── order.entity.ts                 # Agregado raíz Order
│   │   │   └── order-item.entity.ts           # Línea de orden
│   │   ├── repositories/
│   │   │   └── order.repository.ts            # Interfaz de repositorio
│   │   ├── ports/
│   │   │   └── event-bus.port.ts              # Abstracción de bus de eventos
│   │   └── events/                            # Eventos de dominio
│   │
│   ├── application/                🎯 Casos de Uso
│   │   ├── use-cases/
│   │   │   ├── create-order/
│   │   │   │   ├── create-order.usecase.ts          # Lógica de negocio
│   │   │   │   └── create-order.usecase.spec.ts     # Tests unitarios
│   │   │   ├── find-all-orders/
│   │   │   │   ├── find-all-orders.usecase.ts
│   │   │   │   └── find-all-orders.usecase.spec.ts
│   │   │   └── find-order-by-id/
│   │   │       ├── find-order-by-id.usecase.ts
│   │   │       └── find-order-by-id.usecase.spec.ts
│   │   ├── dto/
│   │   │   ├── create-order.dto.ts            # DTO de entrada
│   │   │   └── order-response.dto.ts          # DTO de salida
│   │   └── mappers/
│   │       └── order-dto.mapper.ts            # Mapeador DTO ↔ Entidad
│   │
│   ├── infrastructure/             🔧 Detalles Técnicos
│   │   ├── prisma/
│   │   │   ├── order.repository.ts            # Implementación de repositorio
│   │   │   ├── prisma.service.ts              # Wrapper del cliente Prisma
│   │   │   └── prisma.module.ts               # Inyección de Prisma
│   │   └── rabbitmq/
│   │       ├── event-bus.adapter.ts           # Implementación del bus de eventos
│   │       └── rabbitmq.module.ts             # Configuración de RabbitMQ
│   │
│   ├── presentation/               🌐 HTTP y Eventos
│   │   └── controllers/
│   │       ├── orders.controller.ts           # Endpoints REST API
│   │       └── orders-events.controller.ts    # Manejadores de eventos
│   │
│   ├── app.module.ts               # Módulo raíz
│   ├── app.controller.ts           # Health check
│   ├── app.service.ts
│   └── main.ts                     # Bootstrapping
│
├── prisma/
│   ├── schema.prisma               # Esquema de BD
│   └── migrations/                 # Migraciones versionadas
│       └── 20260216214202_init_orders/
│           └── migration.sql
│
├── test/                           # Tests E2E
│   ├── app.e2e-spec.ts
│   ├── jest-e2e.json
│   └── helpers/
│
├── tsconfig.json                   # TypeScript con path aliases
├── package.json                    # Dependencias y scripts
├── jest.config.js                  # Configuración Jest
├── .env.example                    # Plantilla de variables
└── README.md                       # Este archivo
```

## 🚀 Comenzar

### Requisitos

- **Node.js** ≥ 18
- **Yarn** (o npm)
- **PostgreSQL** 15+
- **RabbitMQ** 3.12+
- **Docker** (opcional, para PostgreSQL/RabbitMQ)

### Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/tuusuario/event-driven-order-system.git
cd order-service

# 2. Instalar dependencias
yarn install

# 3. Configurar ambiente
cp .env.example .env
# Editar .env con tus credenciales

# 4. Iniciar PostgreSQL & RabbitMQ (opción Docker)
cd ../order-system-infra
docker-compose up -d

# 5. Ejecutar migraciones de BD
cd ../order-service
yarn prisma migrate deploy

# 6. Iniciar servidor de desarrollo
yarn start:dev
```

La API estará disponible en: **http://localhost:3000**

### Variables de Entorno

```env
# Aplicación
PORT=3000
NODE_ENV=development

# Base de Datos (PostgreSQL)
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/orders_db

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest123@localhost:5672
RABBITMQ_QUEUE=orders
```

## 🔌 Endpoints de la API

### Crear Orden
```http
POST /api/orders
Content-Type: application/json

{
  "customerId": "cust-123",
  "items": [
    { "productId": "prod-A", "quantity": 2 },
    { "productId": "prod-B", "quantity": 1 }
  ]
}
```

**Respuesta (201 Creado):**
```json
{
  "id": "order-abc123",
  "customerId": "cust-123",
  "status": "created",
  "total": 250,
  "items": [
    { "productId": "prod-A", "quantity": 2, "price": 100 },
    { "productId": "prod-B", "quantity": 1, "price": 50 }
  ],
  "createdAt": "2026-02-16T23:11:01.713Z"
}
```

### Obtener Todas las Órdenes
```http
GET /api/orders
```

### Obtener Orden por ID
```http
GET /api/orders/:id
```

## 🧪 Testing

```bash
# Ejecutar tests unitarios
yarn test

# Modo watch para desarrollo
yarn test:watch

# Tests E2E
yarn test:e2e

# Reporte de cobertura
yarn test:cov
```

**Cobertura de Tests:**
- ✅ Casos de Uso: 100%
- ✅ Mapeadores: 100%
- ✅ Entidades: 90%+
- ✅ General: ~45%

## 🔑 Características Clave

### 1. Path Aliases

```typescript
// ✅ Imports limpios
import { Order } from '@domain/entities/order.entity';
import { CreateOrderUseCase } from '@application/use-cases/create-order/create-order.usecase';
import { OrderRepository } from '@infrastructure/prisma/order.repository';

// ❌ Evitado: ../../../domain/entities/order.entity
```

**Configurado en:**
- `tsconfig.json` - Compilación TypeScript
- `package.json` - Tests unitarios Jest
- `test/jest-e2e.json` - Tests E2E

**Aliases disponibles:**
- `@domain/*` → `src/domain/*`
- `@application/*` → `src/application/*`
- `@infrastructure/*` → `src/infrastructure/*`
- `@presentation/*` → `src/presentation/*`

### 2. Inyección de Dependencias

```typescript
@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject('OrderRepository') private readonly orderRepo: IOrderRepository,
    @Inject('EventBusPort') private readonly eventBus: EventBusPort,
  ) {}
}
```

**Beneficios:**
- Testeable (mockear dependencias)
- Bajo acoplamiento
- Fácil intercambio de implementaciones

### 3. Base de Datos y Migraciones

```bash
# Crear migración
yarn prisma migrate dev --name init_orders

# Desplegar migraciones
yarn prisma migrate deploy

# Prisma Studio (UI)
yarn prisma studio
```

### 4. Publicación de Eventos

```typescript
const savedOrder = await this.orderRepo.create(orderToCreate);
const orderDto = OrderDtoMapper.toResponse(savedOrder);
await this.eventBus.emitEvent('OrderCreated', orderDto);
```

## 📊 Patrones de Diseño

| Patrón | Ubicación | Propósito |
|--------|-----------|----------|
| **Repository** | `domain/repositories/` | Abstraer acceso a datos |
| **Port & Adapter** | `domain/ports/` + `infrastructure/` | Desacoplar de servicios externos |
| **Inyección de Dependencias** | decoradores `@Inject()` | Gestionar dependencias |
| **Data Transfer Object** | `application/dto/` | Validar y transformar datos |
| **Mapper** | `application/mappers/` | Convertir entre capas |
| **Use Case/Interactor** | `application/use-cases/` | Aislar lógica de negocio |

## 🛠️ Comandos de Desarrollo

```bash
# Iniciar servidor con hot-reload
yarn start:dev

# Build para producción
yarn build

# Ejecutar build de producción
yarn start:prod

# Modo debug
yarn start:debug

# Linting
yarn lint

# Formatear código
yarn format

# Prisma
yarn prisma migrate dev      # Crear migración
yarn prisma studio          # UI de base de datos
yarn prisma generate        # Generar cliente
```

## 📚 Referencias y Documentación

### Conceptos Implementados
- **Clean Architecture** - Robert C. Martin
- **Domain-Driven Design** - Eric Evans
- **SOLID Principles** - Uncle Bob
- **Repository Pattern** - Domain-Driven Design
- **Dependency Injection** - Gang of Four
- **Event-Driven Architecture** - Enterprise Integration Patterns

### Documentación Técnica
- [Documentación de NestJS](https://docs.nestjs.com)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [RabbitMQ](https://www.rabbitmq.com/documentation.html)
- [Prisma](https://www.prisma.io/docs/)
- [TypeScript](https://www.typescriptlang.org/docs/)

## ✅ Calidad de Código

- ✅ **TypeScript Modo Estricto** - Seguridad de tipos completa
- ✅ **ESLint** - Consistencia de código
- ✅ **Prettier** - Formato de código
- ✅ **Unit Tests** - Validación de lógica de negocio
- ✅ **E2E Tests** - Testing de integración
- ✅ **Path Aliases** - Imports mantenibles

## 🤝 Contribuir

1. Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Ejecuta tests: `yarn test`
4. Commit tus cambios: `git commit -m 'feat: agregar nueva funcionalidad'`
5. Push: `git push origin feature/nueva-funcionalidad`
6. Abre un Pull Request

## 📝 Notas para Desarrollo

- ✅ Siempre usa **path aliases** (`@domain/`, `@application/`, etc.) para imports
- ✅ Mantén **lógica de negocio en capas domain/application**
- ✅ **Ejecuta tests antes de commitear**: `yarn test`
- ✅ Sigue **principios SOLID** y **Clean Architecture**
- ✅ Cada capa tiene **responsabilidades claras**
- ✅ Las librerías externas deben estar **en capas de infraestructura**

## 📄 Licencia

MIT - Ver archivo [LICENSE](LICENSE)

## 🔗 Referencias y Recursos

**Arquitectura y Patrones:**
- [Clean Architecture de Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design de Eric Evans](https://www.domainlanguage.com/ddd/)
- [SOLID Principles](https://es.wikipedia.org/wiki/SOLID)
- [Design Patterns: Gang of Four](https://refactoring.guru/design-patterns)

**Documentación Tecnológica:**
- [NestJS](https://docs.nestjs.com)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [RabbitMQ](https://www.rabbitmq.com/documentation.html)
- [Prisma ORM](https://www.prisma.io/docs/)
- [Jest Testing](https://jestjs.io/docs/getting-started)

## 👤 Autor

**Proyecto de Portfolio** - Arquitectura de Microservicios Event-Driven

---

<div align="center">

**Construido con ❤️ usando Clean Architecture y NestJS**

⭐ Si encontraste esto útil, ¡por favor dale una estrella al repositorio!

</div>
