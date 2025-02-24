const amqp = require("amqplib");
const User = require("./auth.model");
const jwt = require("jsonwebtoken");
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

  // token oluşturma fonksiyonu
  generateTokens(user) {
    const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
    return { accessToken, refreshToken };
  }
  async validateToken(token) {
    try {
      // refresh token geçerli mi kontrol et
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      // kullanıcı hesabı hala aktif mi kontrol et
      if (!user || !user.isActive) {
        throw new Error("Kullanıcı bulunamadı veya hesap inaktif.");
      }
      // return user
      return user;
    } catch (error) {
      throw error;
    }
  }
  async register(userData) {
    // aynı email'de kayıtlı kullanıcı var mı ?
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("Bu email ile kayıtlı bir kullanıcı zaten var.");
    }
    // kullanıcıyı veri tabanında oluşturma
    const user = new User(userData);
    // kullanıcıyı veri tabanı kaydet
    await user.save();
    // kullanıcının tokenlerini oluştur
    const tokens = this.generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    // kullanıcı verisini güncelle
    await user.save();
    return { user, ...tokens };
  }
  async login(email, password) {
    try {
      // bu emailde kullanıcı var mı
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Kullanıcı bulunamadı.");
      }
      // kullanıcı hesabı aktif mi ?
      if (!user.isActive) {
        throw new Error("Kullanıcı hesabı inaktif.");
      }

      // yapılan şifre doğru mu
      const isValid = await user.comparePassword(password);
      if (!isValid) {
        throw new Error("Şifre yanlış.");
      }
      // son giriş tarihini güncelle
      user.lastLogin = new Date();
      await user.save();

      // kullanıcının tokenlerini oluştur
      const tokens = this.generateTokens(user);
      return { ...tokens, user };
    } catch (error) {
      throw error;
    }
  }
  async refresh(token) {
    try {
      // refresh token geçerli mi kontrol et
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.userId);
      // kullanıcı hesabı hala aktif mi kontrol et
      if (!user || !user.isActive) {
        throw new Error("Kullanıcı bulunamadı veya hesap inaktif.");
      }
      // yeni access token oluştur
      const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      // yeni access token return et
      return accessToken;
    } catch (error) {
      throw new Error("Token doğrulama hatası.");
    }
  }
}

module.exports = new AuthService();
