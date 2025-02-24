const amqp = require("amqplib");
// business logic'i ve veritabanı ile iletişime geçecek olan katman.
class OrderService {
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
  static async register() {}
  static async login() {}
  static async refresh() {}
  static async logout() {}
}

module.exports = new OrderService();
