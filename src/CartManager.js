import fs from 'fs/promises';

class CartManager {
  constructor(path) {
    this.path = './carrito.json';
  }

  async readCartFile() {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return {};
    }
  }

  async writeCartFile(cart) {
    try {
      const data = JSON.stringify(cart, null, 2);
      await fs.writeFile(this.path, data);
    } catch (error) {
      console.log(error);
    }
  }

  async getCartById(cartId) {
    const cart = await this.readCartFile();
    return cart[cartId] || null;
  }

  async saveCart(cartId, cart) {
    const existingCart = await this.readCartFile();
    existingCart[cartId] = cart;
    await this.writeCartFile(existingCart);
  }
}

export default CartManager;
