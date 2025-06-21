// config/db.config.js
require("dotenv").config();
const MongoAdapter = require('@bot-whatsapp/database/mongo');

const connectToMongoDB = async () => {
  const dbUri = process.env.MONGO_URL;
  const dbName = 'Asistavetdb';

  if (!dbUri) {
    throw new Error('❌ MONGO_URL no está definida en las variables de entorno');
  }

  try {
    //console.log('🔌 Conectando a MongoDB...');

    const adapterDB = new MongoAdapter({
      dbUri,
      dbName,
      dbOptions: {
        tls: true,
        retryWrites: true,
        connectTimeoutMS: 30000,
      },
    });

    //console.log(`✅ Conectado a la base de datos: ${dbName}`);

    return adapterDB;
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    throw error;
  }
};


module.exports = { connectToMongoDB };

