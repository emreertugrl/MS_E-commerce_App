const AuthService = require("./auth.service");
const { validateDto, registerSchema, loginSchema } = require("./auth.dto");
class AuthController {
  async register(req, res, next) {
    try {
      // bodyden gelen veriyi kontrol et
      const value = await validateDto(registerSchema, req.body);
      // servic katmanı ile iletişime geç
      const { refreshToken, ...result } = await AuthService.register(value);
      // Client cevap gönder
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json(result);
    } catch (error) {
      console.log("Register___Hata_______________________________________", error);
      if (error.message === "Bu email ile kayıtlı bir kullanıcı zaten var.") {
        return res.status(409).json({ message: error.message });
      }
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = await validateDto(loginSchema, req.body);
      // servic katmanı ile iletişime geç
      const { refreshToken, ...result } = await AuthService.login(email, password);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json(result);
    } catch (error) {
      console.log("Login___Hata_______________________________________", error);
      if (error.message === "Böyle bir email ve şifre ile kayıtlı bir kullanıcı bulunamadı.") {
        return res.status(401).json({ message: error.message });
      }
      next(error);
    }
  }
  async refresh(req, res, next) {
    try {
      // çerezlerle gelen refresh token'a eriş
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        next(new Error("Refresh tokena erişilemedi"));
      }
      // refresh token'ın geçerli olduğunu kontrol et
      const accessToken = await AuthService.refresh(refreshToken);
      // client'e gönder
      return res.status(200).json({ accessToken });
    } catch (error) {
      console.log("Refresh___Hata_______________________________________", error);
      if (error.message === "Token doğrulaması başarısız.") {
        return res.status(401).json({ message: error.message });
      }
      next(error);
    }
  }
  async logout(req, res, next) {
    try {
    } catch (error) {
      console.log("Logout___Hata_______________________________________", error);
      next(error);
    }
  }
}

// örneğini alıp export ederek diğer tarafta kullanabiliriz.
module.exports = new AuthController();
