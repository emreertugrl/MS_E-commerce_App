const OrderService = require("./order.service");

class OrderController {
  async createOrder(req, res) {}
  async getOrder(req, res) {}
  async getUserOrders(req, res) {}
  async updateOrderStatus(req, res) {}
}

// örneğini alıp export ederek diğer tarafta kullanabiliriz.
module.exports = new OrderController();
