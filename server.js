// ===== server.js =====
// هذا هو الملف الرئيسي للسيرفر - This is the main server file
// يقوم بتشغيل السيرفر والاتصال بقاعدة البيانات - It starts the server and connects to the database

// --- 1) تحميل المكتبات / Load libraries ---

// dotenv: يقرأ الإعدادات من ملف .env / Reads settings from .env file
const dotenv = require('dotenv');
dotenv.config(); // تشغيل dotenv لقراءة الملف / Activate dotenv to read the file

// express: إطار عمل لبناء السيرفر / Framework for building the server
const express = require('express');

// mongoose: مكتبة للاتصال بقاعدة بيانات MongoDB / Library to connect to MongoDB
const mongoose = require('mongoose');

// cors: يسمح للفرونت إند بالتواصل مع الباك إند / Allows frontend to communicate with backend
const cors = require('cors');

// path: مكتبة مدمجة للتعامل مع مسارات الملفات / Built-in library for file paths
const path = require('path');

// bcryptjs: مكتبة لتشفير كلمة المرور / Library for hashing passwords
const bcrypt = require('bcryptjs');

// --- تحميل موديل المستخدم / Load User model (needed for admin seeding) ---
const User = require('./models/User');

// --- 2) إنشاء التطبيق / Create the app ---
const app = express(); // إنشاء تطبيق Express / Create an Express application

// --- 3) Middlewares (الوسطاء) ---
// هذه الأوامر تعمل على كل طلب قبل الوصول للـ routes

app.use(cors());             // السماح بالطلبات من أي مصدر / Allow requests from any origin
app.use(express.json());     // تحويل بيانات JSON تلقائياً / Automatically parse JSON data

// تقديم ملفات الفرونت إند الثابتة / Serve static frontend files
// كل الملفات في مجلد "public" ستكون متاحة في المتصفح
app.use(express.static(path.join(__dirname, 'public')));

// --- 4) الراوتات / Routes ---
// توجيه الطلبات إلى الملفات المناسبة / Direct requests to the right files

// طلبات التسجيل والدخول تذهب لـ routes/auth.js
app.use('/api/auth', require('./routes/auth'));

// طلبات الأشخاص تذهب لـ routes/persons.js
app.use('/api/persons', require('./routes/persons'));

// طلبات الأدمن تذهب لـ routes/admin.js
app.use('/api/admin', require('./routes/admin'));

// --- 5) دالة إنشاء حساب الأدمن / Function to create admin account ---
// هذه الدالة تنشئ حساب الأدمن تلقائياً عند أول تشغيل
// This function creates the admin account automatically on first run
async function seedAdmin() {
  try {
    // البحث عن الأدمن / Check if admin already exists
    const adminExists = await User.findOne({ email: 'akeabde@gmail.com' });

    if (!adminExists) {
      // إذا لم يكن موجوداً، أنشئه / If not found, create it
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('71067106', salt);

      const adminUser = new User({
        name: 'Admin',
        email: 'akeabde@gmail.com',
        password: hashedPassword,
        isAdmin: true
      });

      await adminUser.save();
      console.log('✅ Admin account created: akeabde@gmail.com');
    } else {
      console.log('✅ Admin account already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  }
}

// --- 6) الاتصال بقاعدة البيانات وتشغيل السيرفر / Connect to DB & Start server ---

// نأخذ رقم البورت من ملف .env أو نستخدم 5000 / Get port from .env or use 5000
const PORT = process.env.PORT || 5000;

// الاتصال بـ MongoDB / Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    // إذا نجح الاتصال / If connection is successful
    console.log('✅ Connected to MongoDB!');

    // إنشاء حساب الأدمن / Create admin account
    await seedAdmin();

    // تشغيل السيرفر / Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📂 Open http://localhost:${PORT} in your browser`);
    });
  })
  .catch((error) => {
    // إذا فشل الاتصال / If connection fails
    console.error('❌ Database connection error:', error.message);
  });
