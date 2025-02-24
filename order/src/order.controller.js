const OrderService = require("./order.service");

class OrderController {
  async createOrder(req, res, next) {
    const orderData = req.body;
  }
  async getOrder(req, res, next) {}
  async getUserOrders(req, res, next) {}
  async updateOrderStatus(req, res, next) {}
}

// örneğini alıp export ederek diğer tarafta kullanabiliriz.
module.exports = new OrderController();
