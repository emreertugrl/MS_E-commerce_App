const mongoose = require("mongoose");
const amqp = require("amqplib");
const Product = require("./product.model");
// business logic'i ve veritabanı ile iletişime geçecek olan katman.
class ProductService {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.initializeRabbitMq(); // RabbitMq bağlantısı başlatılır(hemen çalıştırmak için)
  }
  // RabbitMq bağlantı fonksiyonu
  async initializeRabbitMq() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(process.env.RABBITMQ_PRODUCT_QUEUE);
      // products kuyruğuna gelen mesajları dinle
      await this.channel.consume(process.env.RABBITMQ_PRODUCT_QUEUE, async (data) => {
        try {
          // kanaldan gelen mesaja erişiriz.
          const orderData = JSON.parse(data.content.toString());
          // stokları güncelleyecek metod çalıştırılır.
          await this.processOrders(orderData); // yapılacak işleme veriyi gönderir.
          this.channel.ack(data); // mesajı kuyruğundan çıkar
        } catch (error) {
          console.error("Sipariş işleme hatası:", error);
          this.channel.nack(data); // mesajı kuyruğa geri gönder
        }
      });
      console.log("RabbitMQ bağlandı");
    } catch (error) {
      console.error("RabbitMQ Bağlantı hatası:", error);
    }
  }
  // sipariş edilen her ürün için stok eksiltir
  async processOrders(orderData) {
    const { products } = orderData;
    for (const product of products) {
      await this.updateStock(product.productId, -product.quantity);
    }
  }
  async createProduct(productData) {
    try {
      const product = new Product(productData);
      return await product.save();
    } catch (error) {
      throw error;
    }
  }
  async getAllProducts(query) {
    try {
      const filter = { isActive: true };
      if (query.title) filter.name = { $regex: query.title, $options: "i" };
      if (query.category) filter.category = query.category;
      if (query.minPrice) filter.price = { $gte: query.minPrice };
      if (query.maxPrice) filter.price = { ...filter.price, $lte: query.maxPrice };

      return await Product.find(filter);
    } catch (error) {
      throw error;
    }
  }
  async getProductById(productId) {
    try {
      // ObjectId kontrolü
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("Geçersiz ID.");
      }
      return await Product.findById(productId);
    } catch (error) {
      throw error;
    }
  }
  async updateProduct(id, data) {
    try {
      // runValidation modeldeki schema tekrar çalıştır demek
      return await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    } catch (error) {
      throw error;
    }
  }
  async updateStock(id, quantity) {
    try {
      // ürün bulunur
      const product = await Product.findById(id);
      // ürün yoksa hata ver
      if (!product) {
        throw new Error("Ürün bulunamadı.");
      }
      // stok yetersizse hata veri
      const newStock = product.stock + quantity;
      if (newStock < 0) {
        throw new Error("Stok yetersiz.");
      }
      // stok arttırılır ve güncellenir.
      return await Product.findByIdAndUpdate(id, { $inc: { stock: quantity } }, { new: true });
    } catch (error) {
      throw error;
    }
  }
  async deleteProduct(id) {
    try {
      return await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ProductService();
