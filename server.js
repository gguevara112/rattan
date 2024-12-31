import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración de __dirname en módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 5002;

const uri = "mongodb+srv://admin:AmjuBfihm8vtX8tq@test.gmqrn.mongodb.net/?retryWrites=true&w=majority&appName=test";
const client = new MongoClient(uri);

app.use(cors());
app.use(express.json());

// Conexión a la base de datos
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
}

// Endpoints
app.get('/api/products', async (req, res) => {
  try {
    const database = client.db('rattan');
    const collection = database.collection('productos');
    const products = await collection.find().toArray();
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = req.body;
    const database = client.db('rattan');
    const collection = database.collection('productos');
    const result = await collection.insertOne(newProduct);
    res.status(201).json({ _id: result.insertedId, ...newProduct });
  } catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(500).json({ error: "Error al agregar producto" });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const database = client.db('rattan');
    const collection = database.collection('productos');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      res.json({ message: 'Producto eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = req.body;
    const database = client.db('rattan');
    const collection = database.collection('productos');
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedProduct }
    );
    if (result.matchedCount === 1) {
      res.json({ message: 'Producto actualizado correctamente' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

// Configuración del frontend (React)
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Inicia el servidor y conecta a la base de datos
app.listen(port, host, () => {
  connectToDatabase();
  console.log(`Servidor escuchando en http://${host}:${port}`);
});
