import express from 'express';
import multer from 'multer';
import ProductManager from '../ProductManager.js';

const productRouter = express.Router();
const productManager = new ProductManager();

// Configuración de multer para la carga de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ruta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg'); // Nombre del archivo
  },
});

const upload = multer({ storage });

// Rutas para productos
productRouter.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

productRouter.get('/:pid', async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productManager.getProductById(pid);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

productRouter.post('/', upload.single('image'), async (req, res) => {
  // Aquí puedes acceder a los datos del producto a través de req.body y la imagen a través de req.file
  const productData = req.body;
  const imageFilePath = req.file.path; // Ruta donde se guardó la imagen
  productData.image = imageFilePath; // Agregar la ruta de la imagen al objeto del producto
  try {
    await productManager.addProduct(productData);
    res.sendStatus(201);
  } catch (error) {
    res.status(400).json({ error: 'No se pudo agregar el producto' });
  }
});

productRouter.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const updatedFields = req.body;
  try {
    await productManager.updateProduct(pid, updatedFields);
    res.sendStatus(200);
  } catch (error) {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

productRouter.delete('/:pid', async (req, res) => {
  const { pid } = req.params;
  try {
    await productManager.deleteProduct(pid);
    res.sendStatus(200);
  } catch (error) {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

export default productRouter;
