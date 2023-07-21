import express from 'express';
import CartManager from '../CartManager.js';
import ProductManager from '../ProductManager.js';
import { v4 as uuidv4 } from 'uuid';

const cartRouter = express.Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

cartRouter.post('/', async (req, res) => {
  const cartData = req.body;
  // Generar un nuevo ID para el carrito (puedes usar una función o biblioteca para generar un ID único)
  const cartId = generateUniqueId();
  const cart = {
    id: cartId,
    products: [],
  };
  // Guardar el carrito en el archivo carrito.json (puedes utilizar el módulo fs)
  cartManager.saveCart(cartId, cart);
  res.status(201).json(cart);
});

cartRouter.get('/:cid', (req, res) => {
  const { cid } = req.params;
  // Implementar la obtención de los productos de un carrito
  const cart = cartManager.getCartById(cid);
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

cartRouter.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  // Implementar la adición de un producto a un carrito
  const cart = cartManager.getCartById(cid);
  if (cart) {
    try {
      const product = await productManager.getProductById(pid);
      const existingProduct = cart.products.find(p => p.product === pid);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }
      cartManager.saveCart(cid, cart);
      res.sendStatus(200);
    } catch (error) {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

// Función de utilidad para generar un ID único
function generateUniqueId() {
    return uuidv4();
  }

export default cartRouter;
