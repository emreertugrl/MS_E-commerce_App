const { default: mongoose } = require("mongoose");
const Product = require("./product.model");
// business logic'i ve veritabanı ile iletişime geçecek olan katman.
class AuthService {
  constructor() {
    this.channel = null;
    this.initializeRabbitMq(); // RabbitMq bağlantısı başlatılır(hemen çalıştırmak için)
  }
  // RabbitMq bağlantı fonksiyonu
  async initializeRabbitMq() {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      this.channel = await connection.createChannel();
      await this.channel.assertExchange(process.env.RABBITMQ_EXCHANGE, "topic", {
        durable: true, // mesajı kuyrukta uzun süreli saklanmasını sağlar
      });
      await this.channel.assertQueue(process.env.RABBITMQ_QUEUE);
      console.log("RabbitMQ bağlandı");
    } catch (error) {
      console.error("RabbitMQ Bağlantı hatası:", error);
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
}

module.exports = new AuthService();
