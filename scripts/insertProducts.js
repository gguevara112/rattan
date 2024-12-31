import { MongoClient } from 'mongodb';

// URL de conexión a MongoDB (reemplaza `<db_password>` con tu contraseña real)
const uri = "mongodb+srv://admin:AmjuBfihm8vtX8tq@test.gmqrn.mongodb.net/?retryWrites=true&w=majority&appName=test";

// Crear una instancia de MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function createProductsCollection() {
  try {
    // Conectar al cliente
    await client.connect();

    // Selecciona la base de datos (por ejemplo, "mi_tienda") y la colección de productos
    const database = client.db('test');
    const collection = database.collection('productos');

    // Lista de productos a insertar
    const productsList = [
      { name: 'Producto W', description: 'Descripción del producto A', price: 10 },
      { name: 'Producto B', description: 'Descripción del producto B', price: 20 },
      { name: 'Producto C', description: 'Descripción del producto C', price: 30 },
      { name: 'Producto D', description: 'Descripción del producto D', price: 40 }
    ];

    // Insertar los productos en la colección
    const result = await collection.insertMany(productsList);
    console.log(`${result.insertedCount} productos insertados en la colección`);

  } catch (error) {
    console.error("Error al conectar o insertar productos:", error);
  } finally {
    // Cerrar la conexión
    await client.close();
  }
}

// Ejecutar la función
createProductsCollection();
