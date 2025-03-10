const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
// proje içi importları
const orderRoutes = require("./src/order.routes");
// dotenv

require("dotenv").config();

// express oluşturulur.
const app = express();
// mongoDb'ye bağlan
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB'ye bağlandı"))
  .catch((err) => console.log("MongoDB'ye Bağlanamanı" + err));

// Middlewareler eklenir
app.use(express.json()); // cevapları json çevirir.
app.use(cookieParser()); // cookie parserı ekle
app.use(cors()); // frontend ile iletişime geçmemizi sağlar
app.use(helmet()); // headers güvenlik header ekler
app.use(morgan("dev")); // loglamaya yarar hataları gösterir

// rate limiter
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW * 60 * 1000, //
  max: process.env.RATE_LIMIT_MAX_REQUESTS, // 15 saniyede 100 kere request atabilir
});
app.use("/", limiter); // rate limiter middleware'ı ekle

// order route'ları ekle
app.use("/", orderRoutes);

// hata middleware'ı

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json(err.message || "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
});

// 404 middleware'ı

app.use((req, res, next) => {
  res.status(404).json({ message: "Böyle bir sayfa bulunamadı." });
});

// server'ın başlatılması
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Order server ${PORT} portunda başlatıldı`));
