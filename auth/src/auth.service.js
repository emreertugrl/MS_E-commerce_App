const amqp = require("amqplib");
// business logic'i ve veritabanı ile iletişime geçecek olan katman.
class AuthService {
  constructor() {
    this.initializeRabbitMq(); // RabbitMq bağlantısı başlatılır(hemen çalıştırmak için)
  }
  // RabbitMq bağlantı fonksiyonu
  async initializeRabbitMq() {
    try {
      const connection = await amqp.connect(process.env.RabbitMQ_URL);
      console.log("RabbitMQ bağlandı");
    } catch (error) {
      console.error("RabbitMQ Bağlantı hatası:", error);
    }
  }
  static async register() {}
  static async login() {}
  static async refresh() {}
  static async logout() {}
}

module.exports = new AuthService();
