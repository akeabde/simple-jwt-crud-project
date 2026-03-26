// ===== middleware/authMiddleware.js =====
// هذا الملف يحمي الراوتات - يتحقق أن المستخدم مسجل دخوله
// This file protects routes - it checks that the user is logged in

// --- تحميل المكتبات / Load libraries ---
const jwt = require('jsonwebtoken'); // مكتبة JWT للتحقق من التوكن / JWT library to verify tokens

// --- تعريف الـ Middleware / Define the Middleware ---
// الميدل وير هو كود يعمل قبل الراوت / Middleware is code that runs before the route
const authMiddleware = (req, res, next) => {

  // --- الخطوة 1: أخذ التوكن من الـ Header / Step 1: Get token from Header ---
  // التوكن يُرسل في الـ header بهذا الشكل: "Bearer TOKEN_HERE"
  const authHeader = req.header('Authorization');

  // --- الخطوة 2: التحقق من وجود التوكن / Step 2: Check if token exists ---
  if (!authHeader) {
    // إذا لا يوجد توكن، أرسل خطأ 401 (غير مصرح) / If no token, send 401 (unauthorized)
    return res.status(401).json({ message: 'No token, access denied' });
  }

  // استخراج التوكن من النص (إزالة كلمة "Bearer ")
  // Extract the token from the string (remove "Bearer ")
  const token = authHeader.split(' ')[1];

  // إذا لم نجد التوكن بعد الفصل / If no token found after splitting
  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  try {
    // --- الخطوة 3: التحقق من صحة التوكن / Step 3: Verify the token ---
    // jwt.verify يفك تشفير التوكن ويتحقق من صحته
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // --- الخطوة 4: إضافة بيانات المستخدم للطلب / Step 4: Add user data to request ---
    // نضيف الـ userId للطلب حتى نستخدمه في الراوتات
    req.user = decoded;

    // --- الخطوة 5: المتابعة للراوت التالي / Step 5: Continue to the next route ---
    next();
  } catch (error) {
    // إذا كان التوكن غير صالح أو منتهي الصلاحية / If token is invalid or expired
    res.status(401).json({ message: 'Invalid token' });
  }
};

// --- تصدير الميدل وير / Export the middleware ---
module.exports = authMiddleware;
