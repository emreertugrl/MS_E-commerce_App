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
        return res
          .status(404)
          .json({ message: "Arama yaptığınız kriterlere uygun ürün bulunamadı" });
      }
      res.status(200).json({ result: products.length, products });
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
