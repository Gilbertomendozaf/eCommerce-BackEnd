import express from 'express';
import ProductManager from './ProductManager.js';
import CartManager from './CartManager.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

const app = express();
const productManager = new ProductManager();
const cartManager = new CartManager();

app.use(express.json());

// Rutas para productos
app.use('/api/products', productRoutes);

// Rutas para carritos
app.use('/api/carts', cartRoutes);

app.get('/', (req, res) => {
  res.send('¡Hola! Esta es la página de inicio');
});

app.listen(8080, () => {
  console.log('Servidor escuchando en el puerto 8080');
});
