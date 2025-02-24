const jwt = require("jsonwebtoken");

// tokeni doğrulayacak middleware
exports.authenticate = async (req, res, next) => {
  // header olarak access token geldi mi
  const authHeader = req.headers.authorization;
  // Bearer token'ın varlığı kontrol ediliyor
  if (!authHeader) {
    return res.status(403).json({ message: "Bu route'a erişime yetkiniz yok" });
  }
  const accessToken = authHeader.split(" ")[1];
  try {
    // token'ın geçerli olduğunu kontrol et
    // JWT token'ı decode edip kullanıcı bilgilerini alın
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // middleware'in devam edip etmemesi için next() fonksiyonu çağrılır
  } catch (error) {
    if (error.message === "invalid signature") {
      res.status(401).json({ message: "Bu route'a erişim yetkiniz yok" });
    }
    next(error);
  }
};
// admin middleware
exports.admin = async (req, res, next) => {
  if (req.user || req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Bu route'a erişime yetkiniz yok" });
  }
};
