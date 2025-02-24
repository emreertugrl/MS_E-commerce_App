const AuthService = require("./auth.service");

class AuthController {
  async register(req, res) {}
  async login(req, res) {}
  async refresh(req, res) {}
  async logout(req, res) {}
}

// örneğini alıp export ederek diğer tarafta kullanabiliriz.
module.exports = new AuthController();
