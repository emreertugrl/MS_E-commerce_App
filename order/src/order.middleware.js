const AuthService = require("./auth.service");

// tokeni doğrulayacak middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // Bearer token'ın varlığı kontrol ediliyor
    if (!authHeader) {
      res.status(403).json({ message: "Bu route'a erişime yetkiniz yok" });
    }
    const accessToken = authHeader.split(" ")[1];
    // token'ın geçerli olduğunu kontrol et
    const user = await AuthService.validateToken(accessToken);
    req.user = user;
    next();
  } catch (error) {
    if (error.message === "invalid signature") {
      res.status(401).json({ message: "Bu route'a erişim yetkiniz yok" });
    }
    next(error);
  }
};

module.exports = authenticate;
