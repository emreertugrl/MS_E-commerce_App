const OrderService = require("./order.service");
const { orderSchema, validateDto } = require("./order.dto");

class OrderController {
  async createOrder(req, res, next) {
    try {
      const orderData = await validateDto(orderSchema, req.body);
      const order = await OrderService.createOrder(req.user.userId, orderData);

      res.status(201).json({ message: "Sipariş Oluşturuldu", order });
    } catch (error) {
      next(error);
    }
  }
  async getOrder(req, res, next) {}
  async getUserOrders(req, res, next) {}
  async updateOrderStatus(req, res, next) {}
}

// örneğini alıp export ederek diğer tarafta kullanabiliriz.
module.exports = new OrderController();
