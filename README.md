# 🤖 Bot WhatsApp Veterinario - Asistavet CA🐾

![Ready for Deployment](https://img.shields.io/badge/status-ready--for--deployment-brightgreen)
![Node.js](https://img.shields.io/badge/node-%3E%3D18-blue)
![Docker](https://img.shields.io/badge/docker-supported-blue)
![MongoDB](https://img.shields.io/badge/database-mongodb-green)
![Baileys](https://img.shields.io/badge/provider-baileys-orange)
![License](https://img.shields.io/badge/license-MIT-informational)

---

### ⚙️ Descripción

Asistavet es un bot inteligente de WhatsApp desarrollado en Node.js, que atiende a clientes de una clínica veterinaria 24/7. Está diseñado con:

- **Baileys como proveedor**
- **MongoDB como base de datos**
- **Gemini IA para respuestas inteligentes**
- **Lógica basada en flujos personalizados (agenda, emergencias, consultas)**
- **Arquitectura limpia y lista para escalar**

---

### 🧱 Stack Tecnológico

- [x] Node.js 18+
- [x] Baileys Provider `@bot-whatsapp/provider`
- [x] MongoDB Atlas o Railway
- [x] Docker + Docker Compose
- [x] LRU Cache para prevenir fugas de memoria
- [x] Clean Architecture + separación por módulos
- [x] Pruebas de carga con Artillery

---

### 🚀 Cómo ejecutar el bot

#### 1. Clonar el repositorio

```bash
git clone https://github.com/tuusuario/bot-whatsapp-asistavet.git
cd bot-whatsapp-asistavet
2. Configurar variables de entorno
Crea un archivo .env en la raíz:

env
Copiar
Editar
MONGO_URL=mongodb://mongo:<tu_password>@mongodb.railway.internal:27017/Asistavetdb
PORT=3001
3. Iniciar con Docker
Esto construirá tu contenedor, descargará las dependencias y levantará MongoDB y el bot en producción.

🧪 Pruebas de carga
Este proyecto incluye un script con Artillery para medir uso de memoria y detectar fugas con Baileys.

node src/test-load.js
Puedes adaptar test-load.js para simular 100 o más conversaciones simultáneas.

🧠 Inteligencia Artificial
Este bot usa Gemini IA para:

Evaluar síntomas en tiempo real

Sugerir acciones y precios

Recomendar próximos pasos

La integración está desacoplada en /services/geminiApi.js.

📁 Estructura de Carpetas

src/
├── flows/                # Lógica conversacional modular
├── services/             # Conexiones con Gemini o servicios externos
├── utils/                # Validaciones, prompts y funciones comunes
├── config/               # Configuración MongoDB y otras
├── app.js                # Entrada principal
└── test-load.js          # Script de prueba con Artillery
📌 To-Do (Producción)
 Integrar alertas vía correo o webhook en caso de errores

 Exportar logs con Winston o pino

 Protección con rate-limit por IP (si se usa endpoint)

 Redundancia en MongoDB Atlas

📬 Contacto
Desarrollado por Carlos @ Castilla Dev
📞 WhatsApp: +58 0426-0383454
📍 Distrito Capital, Venezuela

🪪 Licencia
Este proyecto está bajo la Licencia MIT. Puedes usarlo, modificarlo y distribuirlo libremente. Solo recuerda dar el crédito correspondiente. 🚀