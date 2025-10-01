import jwt from "jsonwebtoken";

function authenticateToken(req, res, next) {
  console.log("=== AUTH MIDDLEWARE ISHLAYAPTI ===");
  console.log("Headers:", req.headers.authorization);
  
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  console.log("Token:", token ? "Mavjud" : "Yo'q");

  if (!token) {
    console.log("❌ Token topilmadi");
    return res.status(401).json({ message: "Token topilmadi" });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
    console.log("JWT_SECRET ishlatilmoqda:", JWT_SECRET);
    
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Decoded token:", decoded);
    
    req.user = decoded;
    console.log("✅ req.user o'rnatildi:", req.user);
    next();
  } catch (err) {
    console.error("❌ Token verify xatosi:", err.message);
    return res.status(403).json({ message: "Token noto'g'ri yoki muddati tugagan" });
  }
}

export { authenticateToken };
