# Event-Driven Order System - Order Service

Order management microservice with event-driven architecture. Built with Node.js, PostgreSQL, and RabbitMQ for async processing.

## 📋 Description

Microservicio de gestión de órdenes que implementa una arquitectura orientada a eventos (event-driven) utilizando:

- **NestJS** - Framework de Node.js
- **TypeScript** - Lenguaje tipado
- **PostgreSQL** - Base de datos relacional
- **RabbitMQ** - Message broker para comunicación asíncrona

Este servicio maneja el ciclo de vida completo de las órdenes, desde su creación hasta su procesamiento, emitiendo eventos para notificar a otros servicios del sistema.

## 🏗️ Arquitectura

```
Order Service
    ├── REST API (HTTP)
    ├── Event Publisher (RabbitMQ)
    ├── Event Consumer (RabbitMQ)
    └── Database (PostgreSQL)
```

**Eventos emitidos:**

- `order.created` - Cuando se crea una nueva orden
- `order.updated` - Cuando se actualiza una orden
- `order.completed` - Cuando se completa una orden
- `order.cancelled` - Cuando se cancela una orden

## 🚀 Prerequisitos

- Node.js >= 18
- Yarn
- PostgreSQL 15+ (corriendo y accesible)
- RabbitMQ 3.12+ (corriendo y accesible)

## ⚙️ Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/arzidev/event-driven-order-service.git
cd order-service
```

2. Instalar dependencias:

```bash
yarn install
```

3. Configurar variables de entorno:

```bash
cp .env.example .env
# Editar .env con las credenciales de tu PostgreSQL y RabbitMQ
```

4. Asegurarse de que PostgreSQL y RabbitMQ estén corriendo:

**Opción A: Usando Docker Compose (recomendado para desarrollo):**

```bash
# Usar el repositorio de infraestructura event-driven
git clone https://github.com/tu-usuario/event-driven-infra.git
cd event-driven-infra/infrastructure
docker-compose up -d
```

Esto levantará PostgreSQL (puerto 5432) y RabbitMQ (puertos 5672 y 15672).
Ver más detalles en: https://github.com/tu-usuario/event-driven-infra

**Opción B: Instalación local:**

```bash
# Instalar PostgreSQL y RabbitMQ localmente
# o usar servicios en la nube (AWS RDS, CloudAMQP, etc.)
```

5. Iniciar el servicio en modo desarrollo:

```bash
yarn start:dev
```

El servicio estará disponible en: http://localhost:3000

## 🔧 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Application
PORT=3000
NODE_ENV=development

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres123
DATABASE_NAME=orders_db

# RabbitMQ
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest123
RABBITMQ_QUEUE=orders

# API
API_PREFIX=api/v1
```

## 🛠️ Comandos de Desarrollo

```bash
# Modo desarrollo con hot-reload
yarn start:dev

# Modo producción
yarn start:prod

# Modo debug
yarn start:debug

# Build del proyecto
yarn build
```

## 🧪 Testing

```bash
# Tests unitarios
yarn test

# Tests en modo watch
yarn test:watch

# Tests e2e
yarn test:e2e

# Coverage de tests
yarn test:cov
```

## 📁 Estructura del Proyecto

```
order-service/
├── src/
│   ├── app.controller.spec.ts   # Tests del controller
│   ├── app.controller.ts        # Controller principal
│   ├── app.module.ts            # Módulo principal
│   ├── app.service.ts           # Service principal
│   └── main.ts                  # Punto de entrada
├── test/                        # Tests e2e
├── .env                        # Variables de entorno (no subir a git)
├── .env.example               # Plantilla de variables
├── package.json               # Dependencias y scripts
├── tsconfig.json             # Configuración TypeScript
└── nest-cli.json             # Configuración NestJS
```

> **Nota:** Esta es la estructura inicial. A medida que el proyecto crezca, se agregarán módulos como `orders/`, `database/`, `events/`, etc.

## Despliegue

### Producción

1. Configurar variables de entorno en el servidor
2. Build del proyecto:

```bash
yarn build
```

3. Ejecutar en modo producción:

```bash
yarn start:prod
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Notas

- Asegúrate de tener PostgreSQL y RabbitMQ corriendo y accesibles antes de iniciar el servicio
- Configura correctamente las credenciales en el archivo `.env`
- Los eventos se publican de forma asíncrona para no bloquear las respuestas HTTP
- Este servicio requiere conexión a PostgreSQL para persistencia de datos
- Este servicio requiere conexión a RabbitMQ para publicación de eventos

## 📄 Licencia

[MIT](LICENSE)

## 🔗 Enlaces Relacionados

- [NestJS Documentation](https://docs.nestjs.com)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [RabbitMQ](https://www.rabbitmq.com/documentation.html)
- [TypeScript](https://www.typescriptlang.org/docs/)
