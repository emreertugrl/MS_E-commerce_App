const amqp = require("amqplib");
const Order = require("./order.model");

// business logic'i ve veritabanı ile iletişime geçecek olan katman.
class OrderService {
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
      // assertExchane auth servisinde kuruldu tekrardan burada kurmaya gerek yok.
      // await this.channel.assertExchange(process.env.RABBITMQ_EXCHANGE, "topic", {
      //   durable: true, // mesajı kuyrukta uzun süreli saklanmasını sağlar
      // });
      await this.channel.assertQueue(process.env.RABBITMQ_ORDER_QUEUE);
      await this.channel.assertQueue(process.env.RABBITMQ_PRODUCT_QUEUE);
      console.log("RabbitMQ bağlandı");
    } catch (error) {
      console.error("RabbitMQ Bağlantı hatası:", error);
    }
  }
  async createOrder(userId, orderData) {
    try {
      const newOrder = new Order({
        user: userId,
        ...orderData,
      });
      const savedOrder = await newOrder.save();
      // product servisine sipariş oluşturulduğunun haberini gönder
      if (this.channel) {
        await this.channel.sendToQueue(
          process.env.RABBITMQ_PRODUCT_QUEUE,
          Buffer.from(JSON.stringify(savedOrder))
        );
      }
      return savedOrder;
    } catch (error) {
      throw error;
    }
  }
  async getOrderById(orderId) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error("Sipariş bulunamadı");
      }
      return order;
    } catch (error) {
      throw error;
    }
  }
  async getUserOrders(userId) {
    try {
      const orders = await Order.find({ user: userId });
      return orders;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new OrderService();
