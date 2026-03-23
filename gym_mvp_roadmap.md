# 🏋️ GymSaaS — Roadmap MVP

## Estado actual del proyecto
Lo que ya funciona: gestión de clientes, membresías, planes, pagos, check-in por DNI, dashboard con stats, export Excel, login con roles.

---

## 🔴 Crítico — Sin esto NO se puede vender

Estas funcionalidades son bloqueantes. Un gimnasio real las necesita desde el día 1.

### 1. Notificaciones de vencimiento
**Por qué es crítico:** El 80% de los gimnasios vive de la renovación. Sin recordatorios, los socios se olvidan y se pierden ventas.
- Email automático 3 días antes del vencimiento
- Email el día que vence
- Lista en el dashboard de "vencen hoy" / "vencen esta semana"
- **Stack sugerido:** Nodemailer + cron job (ya tenés [membershipJob.js](file:///f:/proyecto/server/jobs/membershipJob.js))

### 2. Historial de pagos por cliente
**Por qué es crítico:** Cuando un socio dice "yo pagué", necesitás poder probarlo.
- Ver todos los pagos de un cliente específico en su perfil
- Fecha, monto, plan, método de cada pago
- **Ya tenés** [getPaymentsByClient](file:///f:/proyecto/server/controllers/pago.js#119-127) en el backend — solo falta la UI

### 3. Búsqueda y filtros en la tabla de clientes
**Por qué es crítico:** Con 200+ clientes, navegar sin filtros es imposible.
- Filtrar por estado (activo / expirado / por vencer)
- Filtrar por plan
- El buscador ya existe en el backend, falta conectarlo en la UI

### 4. Loading states y manejo de errores en la UI
**Por qué es crítico:** Si el servidor tarda o falla, la pantalla queda en blanco sin explicación.
- Skeletons en las tablas mientras cargan
- Mensaje de error cuando falla una request
- Estado vacío con imagen cuando no hay datos

### 5. Perfil del cliente
**Por qué es crítico:** Los recepcionistas necesitan ver toda la info de un socio en un solo lugar.
- Datos personales + foto (opcional)
- Membresía actual y fechas
- Historial de pagos
- Historial de check-ins

### 6. Reportes básicos de ingresos
**Por qué es crítico:** El dueño del gimnasio quiere saber cuánto ganó este mes.
- Ingresos del mes actual vs. mes anterior
- Gráfico de ingresos por día/semana (recharts o chart.js)
- Ingresos por plan (qué plan vende más)
- **Ya tenés** `totalPaymentsMonth` y `totalPaymentsYear` en el backend

---

## 🟡 Importante — Diferencia un buen MVP de uno básico

### 7. Descuentos y precios custom en pagos
Los gimnasios negocian precios constantemente. Un socio puede pagar $X en vez del precio del plan.
- Permitir ingresar un monto distinto al del plan (con nota opcional)
- Registrar la diferencia como descuento

### 8. Múltiples roles con permisos reales en la UI
- **Admin:** acceso total
- **Recepcionista / Staff:** puede hacer check-in y cobrar, NO puede borrar ni ver reportes financieros
- **Entrenador:** solo ve sus clientes asignados (futuro)

### 9. Check-in con historial visible
- Ver los últimos N check-ins en el dashboard
- Historial de asistencia por cliente (¿cuántas veces vino este mes?)

### 10. Impresión / PDF de recibo de pago
- Al registrar un pago, botón "Imprimir recibo"
- PDF simple con logo, nombre del cliente, plan, monto, fecha, método
- **Stack sugerido:** `@react-pdf/renderer` o `jspdf`

### 11. Configuración del gimnasio
- Nombre, logo, dirección, teléfono
- Que aparezcan en los recibos y emails
- Moneda local configurable

---

## 🟢 Nice to have — Para versiones futuras (no MVP)

| Funcionalidad | Valor para el cliente |
|---|---|
| App mobile (PWA) | Ver stats desde el celular |
| WhatsApp automático al vencer | Mayor tasa de renovación |
| Congelamiento de membresía | Muy pedido en CrossFit |
| Multi-sede (una cuenta, varios locales) | Para cadenas de gimnasios |
| Clases y turnos | CrossFit / funcional lo necesitan |
| App de check-in para socios (QR) | Elimina el trabajo del recepcionista |
| Integración con MercadoPago | Cobro online de membresías |
| Métricas avanzadas (churn rate, LTV) | Para dueños más sofisticados |
| Modo oscuro | Estético, no funcional |

---

## 📋 Orden de implementación sugerido

```
Semana 1-2
├── Loading states + manejo de errores (rápido, alto impacto visual)
├── Filtros en tabla de clientes
└── Historial de pagos por cliente

Semana 3-4
├── Notificaciones de vencimiento (email)
├── Perfil del cliente
└── Reportes de ingresos con gráfico

Semana 5-6
├── Recibo PDF
├── Descuentos en pagos
└── Configuración del gimnasio

Beta con gimnasio real → Feedback → Iterar
```

---

> [!IMPORTANT]
> **El MVP mínimo vendible** son los puntos del 1 al 6 (🔴 Crítico). Los puntos 7-11 te diferencian de una solución básica y justifican cobrar más.

> [!TIP]
> **Estrategia de lanzamiento:** Buscá 1-2 gimnasios conocidos, dáselo gratis 2-3 meses a cambio de feedback. Con eso validás que realmente lo usan antes de invertir más tiempo.
