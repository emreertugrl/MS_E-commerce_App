const ProductService = require("./product.service");
const { validateDto, productSchema } = require("./product.dto");

class ProductController {
  async createProduct(req, res, next) {
    try {
      const productData = await validateDto(productSchema, req.body);

      // Servic katmanı ile iletişime geç
      const product = await ProductService.createProduct(productData);

      res.status(201).json({ product });
    } catch (error) {
      next(error);
    }
  }
  async getAllProducts(req, res, next) {
    try {
      // arama parametresiyle gelen değerlere erişim
      const query = {
        title: req.query.title,
        category: req.query.category,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      };
      // servis katmanında veritabanından verileri al
      const products = await ProductService.getAllProducts(query);

      if (products.length < 1) {
        return res.status(404).json({ error: "Arama yaptığınız kriterlere uygun ürün bulunamadı" });
      }
      res.status(200).json({ result: products.length, products });
    } catch (error) {
      next(error);
    }
  }

  async getProduct(req, res, next) {
    try {
      // route yazdığımı /:id kısmındaki id
      const { id } = req.params;
      // servis katmanında veritabanından verileri al
      const product = await ProductService.getProductById(id);
      if (!product) {
        return res.status(404).json({ error: "Böyle bir ürün bulunamadı" });
      }
      res.status(200).json({ product });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const updateProduct = req.body;
      // Servic katmanı ile iletişime geç
      const updatedProduct = await ProductService.updateProduct(id, updateProduct);
      if (!updatedProduct) {
        return res.status(404).json({ error: "Böyle bir ürün bulunamadı" });
      }
      res.status(200).json({ product: updatedProduct });
    } catch (error) {
      next(error);
    }
  }
  async updateStock(req, res, next) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (typeof quantity !== "number") {
        return res.status(400).json({ error: "Miktar, sayı değerinde olmalı." });
      }
      // Servic katmanı ile iletişime geç
      const updatedProduct = await ProductService.updateStock(id, quantity);

      res.status(200).json({ updatedProduct });
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
