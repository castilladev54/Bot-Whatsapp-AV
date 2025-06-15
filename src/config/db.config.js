// config/db.config.js
require("dotenv").config();

const MongoAdapter = require('@bot-whatsapp/database/mongo');

const connectToMongoDB = async () => {
  const dbUri = process.env.MONGO_URL;
  const dbName = 'Asistavetdb';

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
};

module.exports = { connectToMongoDB };