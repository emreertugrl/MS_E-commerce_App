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
  async getOrder(req, res, next) {
    try {
      const { orderId } = req.params;
      const order = await OrderService.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Sipariş Bulunamadı" });
      }

      res.status(200).json({ order });
    } catch (error) {
      next(error);
    }
  }
  async getUserOrders(req, res, next) {
    try {
      const orders = await OrderService.getUserOrders(req.params.userId);
      res.status(200).json({ orders });
    } catch (error) {
      next(error);
    }
  }
  async updateOrderStatus(req, res, next) {}
}

// örneğini alıp export ederek diğer tarafta kullanabiliriz.
module.exports = new OrderController();
