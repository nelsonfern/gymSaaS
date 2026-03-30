# 🏋️‍♂️ GymSaaS

**Una solución SaaS moderna y completa para Gimnasios y Centros Deportivos**

GymSaaS es una aplicación web full-stack integral diseñada para ayudar a los dueños de gimnasios a administrar sus instalaciones con facilidad. Desarrollada pensando en el rendimiento y la experiencia del usuario, esta plataforma maneja todo, desde el control de acceso y pagos recurrentes hasta analíticas detalladas y gestión del personal.

---

## 📸 Capturas de Pantalla

*(Añade o reemplaza tus capturas de pantalla aquí)*

| Dashboard Principal | Gestión de Clientes |
| :---: | :---: |
| ![Dashboard](https://via.placeholder.com/600x400?text=Dashboard+Principal) | ![Clientes](https://via.placeholder.com/600x400?text=Gestion+de+Clientes) |

| Pasarela de Pagos | Configuración del Gimnasio |
| :---: | :---: |
| ![Pagos](https://via.placeholder.com/600x400?text=Flujo+de+Pagos) | ![Configuración](https://via.placeholder.com/600x400?text=Panel+de+Configuracion) |

> **Nota:** Puedes guardar tus propias imágenes en una carpeta (por ejemplo `/images` dentro de tu repositorio) y reemplazar los enlaces de arriba con rutas locales como `![Dashboard](./images/dashboard.png)`.

---

## ✨ Características Principales

- **👥 Gestión de Clientes**: Registra y administra fácilmente a los miembros del gimnasio, sus datos personales y su estado actual.
- **💳 Membresías y Pagos**: Configura planes de facturación personalizados (diarios, mensuales, anuales), rastrea los pagos de los miembros y administra automáticamente los vencimientos.
- **✅ Control de Acceso (Check-In)**: Un sistema dedicado para el registro de entrada de los miembros que valida automáticamente las membresías activas y los límites diarios.
- **🔐 Roles y Permisos (RBAC)**: Soporta roles de administrador (`Admin`) y empleados (`Staff`). Mantén tus datos financieros confidenciales visibles únicamente para los dueños.
- **📊 Analíticas y Reportes**: Potente panel de control con gráficos interactivos (usando Recharts) para visualizar ingresos, miembros activos y tendencias de asistencia.
- **⚙️ Alta Personalización**: Actualiza dinámicamente el logotipo de tu gimnasio, nombre, moneda e información de contacto directamente desde la plataforma.
- **📧 Correos Electrónicos Automatizados**: Integración de correo electrónico incorporada utilizando Nodemailer (compatible con Gmail) para la bienvenida de miembros y comprobantes de pago.
- **🕰️ Tareas en Segundo Plano**: Utiliza Tareas Cron (`node-cron`) para verificar y actualizar automáticamente los estados de los miembros y caducar planes todos los días de forma automática.
- **🐳 Listo para Docker**: Despliégalo fácilmente en cualquier lugar (VPS, AWS, DigitalOcean) con los `Dockerfiles` preconfigurados y `docker-compose.yml`.

---

## 💻 Tecnologías Utilizadas

### Frontend
- **Framework**: React 19 + Vite
- **Estilos**: Tailwind CSS v4 + Framer Motion (para animaciones fluidas)
- **Manejo de Estado**: Zustand
- **Rutas**: React Router DOM (v7)
- **Iconos y Gráficos**: Lucide React / Recharts
- **Formularios y Peticiones**: React Hook Form, Axios

### Backend
- **Entorno**: Node.js
- **Framework**: Express.js
- **Base de Datos**: MongoDB (Mongoose ODM)
- **Seguridad**: Autenticación JWT, bcrypt, Express Rate Limit, Helmet, Mongo Sanitize
- **Utilidades**: Multer (subida de archivos), Nodemailer, node-cron

---

## 🚀 Guía de Instalación

### Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu máquina local:
- **Node.js** (v18 o superior)
- **MongoDB** (ejecutándose localmente, o una URI de conexión a MongoDB Atlas)
- **Git**

### 1. Clonar el repositorio

```bash
git clone https://github.com/nelsonfern/gymSaaS.git
cd gymSaaS
```

### 2. Variables de Entorno

Debes configurar las variables `.env` tanto para el cliente *(frontend)* como para el servidor *(backend)*.

Crea un archivo `.env` en el directorio `/server`:
```env
PORT=5100
MONGO_URI=mongodb://localhost:27017/gymdb
JWT_SECRET=tu_clave_super_secreta_aqui
JWT_REFRESH_SECRET=tu_clave_refresh_secreta_aqui
MAIL_USER=tu_correo@gmail.com
MAIL_PASS=tu_contraseña_de_aplicacion
MAIL_FROM_NAME="GymSaaS"
CLIENT_URL=http://localhost:5173
```

Crea un archivo `.env` en el directorio `/client`:
```env
VITE_API_URL=http://localhost:5100
```

### 3. Instalación y Ejecución (Desarrollo Local)

**Levantar el Servidor (Backend):**
```bash
cd server
npm install
npm run dev
```

**Levantar el Cliente (Frontend):**
```bash
cd client
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173` y el backend en `http://localhost:5100`.

---

## 🐳 Despliegue con Docker (Opcional)

GymSaaS viene con un archivo `docker-compose.yml` para una configuración y despliegue locales ultra rápidos. Asegúrate de tener Docker y Docker Compose instalados.

```bash
# Construye y ejecuta los contenedores en segundo plano
docker-compose up --build -d
```
Esto levantará automáticamente el Frontend, el Backend y un contenedor de base de datos MongoDB unidos en la misma red.

---

## 📂 Estructura del Proyecto

```text
gymSaaS/
├── client/                 # Aplicación Frontend (React)
│   ├── src/
│   │   ├── api/            # Interceptores y configuraciones de Axios
│   │   ├── components/     # Componentes de UI reutilizables
│   │   ├── context/        # Contextos de React (AuthContext)
│   │   ├── layouts/        # Layouts de la App y Sidebar
│   │   ├── pages/          # Vistas (Dashboard, Settings, Config, etc.)
│   │   └── store/          # Estado global manejado por Zustand
│   └── dockerfile          # Configuración Docker del frontend
├── server/                 # Backend (Node.js + Express)
│   ├── config/             # Configuración de la base de datos
│   ├── controllers/        # Controladores con lógica de negocio
│   ├── helpers/            # Utilidades y middlewares de JWT/CORS
│   ├── jobs/               # Tareas programadas (estado de membresía)
│   ├── models/             # Abstracciones para interactuar con la DB
│   ├── routes/             # Rutas de la API RESTful
│   ├── schemas/            # Esquemas de datos Mongoose
│   ├── services/           # Mailing e integraciones de terceros
│   └── dockerfile          # Configuración Docker del backend
└── docker-compose.yml      # Orchestración para todos los contenedores
```

---

## 🛡️ Seguridad
Consideraciones de seguridad construidas por defecto en la API:
- **Helmet**: Configura cabeceras HTTP de forma segura para proteger la App Express.
- **Express Mongo Sanitize**: Previene inyecciones NoSQL por parte de actores maliciosos.
- **Express Rate Limit**: Límite de peticiones para mitigar ataques de denegación de servicio (DDoS) o ataques de fuerza bruta en los endpoints de Login.
- **Autenticación JWT**: Mediante Bearer Tokens autorregulados basados en tiempo y validación segura del refresh token.

## 🤝 Contribuir
¡Las contribuciones, reportes de problemas (issues) y solicitudes de nuevas características son siempre bienvenidas!
No dudes en revisar la [página de issues](https://github.com/nelsonfern/gymSaaS/issues).

## 📝 Licencia
Este proyecto está bajo la Licencia ISC.
