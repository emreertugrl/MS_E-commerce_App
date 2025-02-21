const AuthService = require("./auth.service");
const { validateUserDto } = require("./auth.dto");
class AuthController {
  async register(req, res, next) {
    try {
      // bodyden gelen veriyi kontrol et
      const value = await validateUserDto(req.body);
      // servic katmanı ile iletişime geç
      const result = await AuthService.register(value);

      res.status(201).json({ message: result });
    } catch (error) {
      console.log("Register___Hata_______________________________________", error);
      if (error.message === "Bu email ile kayıtlı bir kullanıcı zaten var.") {
        return res.status(409).json({ message: error.message });
      }
      next(error);
    }
  }

  async login(req, res) {
    console.log("Login isteği geldi");
  }
  async refresh(req, res) {
    console.log("Refresh isteği geldi");
  }
  async logout(req, res) {
    console.log("Logout isteği geldi");
  }
}

// örneğini alıp export ederek diğer tarafta kullanabiliriz.
module.exports = new AuthController();
