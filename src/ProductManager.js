import fs from 'fs/promises';

class ProductManager {
  constructor(path) {
    this.path = './productos.json';
  }

  async readProductsFile() {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async writeProductsFile(products) {
    try {
      const data = JSON.stringify(products, null, 2);
      await fs.writeFile(this.path, data);
    } catch (error) {
      console.log(error);
    }
  }

  async addProduct(productData) {
    const { code } = productData;
    const products = await this.readProductsFile();

  const validation = products.some(
    (productfind) => productfind.code === code
  );
  if(validation){
    console.log("Producto con codigo ya existente");
    return;
  }

    const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
    const product = { id, ...productData };

    products.push(product);

    await this.writeProductsFile(products);
  }

  async getProducts() {
    return await this.readProductsFile();
  }

  async getProductById(id) {
    const products = await this.readProductsFile();

    const product = products.find(product => product.id === id);

    if (!product) {
      throw new Error('Producto no encontrado.');
    }

    return product;
  }

  async updateProduct(id, updatedFields) {
    const products = await this.readProductsFile();

    const productIndex = products.findIndex(product => product.id === id);

    if (productIndex === -1) {
      throw new Error('Producto no encontrado.');
    }

    const updatedProduct = { ...products[productIndex], ...updatedFields };
    products[productIndex] = updatedProduct;

    await this.writeProductsFile(products);
  }

  async deleteProduct(id) {
    const products = await this.readProductsFile();

    const updatedProducts = products.filter(product => product.id !== id);

    if (updatedProducts.length === products.length) {
      throw new Error('Producto no encontrado.');
    }

    await this.writeProductsFile(updatedProducts);
  }
}


export default ProductManager;