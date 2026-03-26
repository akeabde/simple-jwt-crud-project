// ===== routes/auth.js =====
// هذا الملف يحتوي على راوتات التسجيل وتسجيل الدخول
// This file contains Register and Login routes

// --- تحميل المكتبات / Load libraries ---
const express = require('express');
const router = express.Router();      // إنشاء راوتر / Create a router

const bcrypt = require('bcryptjs');   // مكتبة لتشفير كلمة المرور / Library to hash passwords
const jwt = require('jsonwebtoken');  // مكتبة لإنشاء التوكن / Library to create tokens

// --- تحميل موديل المستخدم / Load User model ---
const User = require('../models/User');

// ============================================
// راوت التسجيل / REGISTER Route
// POST /api/auth/register
// ============================================
router.post('/register', async (req, res) => {
  try {
    // --- الخطوة 1: أخذ البيانات من الطلب / Step 1: Get data from request ---
    const { name, email, password } = req.body;

    // --- الخطوة 2: التحقق من أن الإيميل غير مستخدم / Step 2: Check if email already exists ---
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      // إذا وجدنا مستخدم بنفس الإيميل، أرسل خطأ / If we found a user, send error
      return res.status(400).json({ message: 'Email already exists' });
    }

    // --- الخطوة 3: تشفير كلمة المرور / Step 3: Hash the password ---
    const salt = await bcrypt.genSalt(10);
    // genSalt ينشئ "ملح" للتشفير (رقم 10 = مستوى التشفير)
    const hashedPassword = await bcrypt.hash(password, salt);
    // hash يشفر كلمة المرور مع الملح

    // --- الخطوة 4: إنشاء المستخدم الجديد / Step 4: Create new user ---
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword  // نحفظ كلمة المرور المشفرة / We save the hashed password
    });

    // حفظ المستخدم في قاعدة البيانات / Save user to database
    const savedUser = await newUser.save();

    // --- الخطوة 5: إرسال الرد / Step 5: Send response ---
    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email
      }
    });

  } catch (error) {
    // إذا حدث خطأ / If an error occurs
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// راوت تسجيل الدخول / LOGIN Route
// POST /api/auth/login
// ============================================
router.post('/login', async (req, res) => {
  try {
    // --- الخطوة 1: أخذ البيانات / Step 1: Get data ---
    const { email, password } = req.body;

    // --- الخطوة 2: البحث عن المستخدم / Step 2: Find user ---
    const user = await User.findOne({ email: email });

    if (!user) {
      // إذا لم نجد المستخدم / If user not found
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // --- الخطوة 3: مقارنة كلمة المرور / Step 3: Compare password ---
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    // compare يقارن كلمة المرور المدخلة مع المشفرة

    if (!isPasswordCorrect) {
      // إذا كلمة المرور غلط / If password is wrong
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // --- الخطوة 4: إنشاء التوكن / Step 4: Create token ---
    let token;
    if (user.isAdmin) {
      // الأدمن: التوكن لن ينتهي أبداً / Admin: Infinity
      token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET
      );
    } else {
      // المستخدم العادي: 3 دقائق للتجربة / Regular user: 3 minutes
      token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1m' }
      );
    }

    // --- الخطوة 5: إرسال الرد / Step 5: Send response ---
    res.json({
      message: 'Login successful',
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin   // نرسل إذا كان أدمن / Send if user is admin
      }
    });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- تصدير الراوتر / Export the router ---
module.exports = router;
