const ProductService = require("./product.service");

class ProductController {
  async getAllProducts(req, res, next) {}
  async getProduct(req, res, next) {}
  async createProduct(req, res, next) {}
  async updateProduct(req, res, next) {}
  async updateStock(req, res, next) {}
  async deleteProduct(req, res, next) {}
}

// örneğini alıp export ederek diğer tarafta kullanabiliriz.
module.exports = new ProductController();
