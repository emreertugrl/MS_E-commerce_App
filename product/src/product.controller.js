const ProductService = require("./product.service");

class ProductController {
  async getAllProducts(req, res, next) {
    try {
      res.status(200).json("Tüm Ürünler Alındı");
    } catch (error) {
      next(error);
    }
  }
  async getProduct(req, res, next) {
    try {
      res.status(200).json(" Ürün Alındı");
    } catch (error) {
      next(error);
    }
  }
  async createProduct(req, res, next) {
    try {
      res.status(201).json("Yeni Ürün Oluşturuldu");
    } catch (error) {
      next(error);
    }
  }
  async updateProduct(req, res, next) {
    try {
      res.status(200).json("Ürün Güncellendi");
    } catch (error) {
      next(error);
    }
  }
  async updateStock(req, res, next) {
    try {
      res.status(200).json("Stok Güncellendi");
    } catch (error) {
      next(error);
    }
  }
  async deleteProduct(req, res, next) {
    try {
      res.status(200).json("Ürün Silindi");
    } catch (error) {
      next(error);
    }
  }
}

// örneğini alıp export ederek diğer tarafta kullanabiliriz.
module.exports = new ProductController();
