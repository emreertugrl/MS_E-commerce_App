const AuthService = require("./auth.service");
const { validateUserDto } = require("./auth.dto");
class AuthController {
  async register(req, res, next) {
    try {
      const value = await validateUserDto(req.body);
      res.status(201).json({ message: value });
    } catch (error) {
      console.log("Register___Hata_______________________________________", error);
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
