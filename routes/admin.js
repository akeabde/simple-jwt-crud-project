// ===== routes/admin.js =====
// هذا الملف يحتوي على راوتات الأدمن
// This file contains Admin routes - only accessible by admin users
// الأدمن يمكنه رؤية كل المستخدمين وكل الأشخاص

// --- تحميل المكتبات / Load libraries ---
const express = require('express');
const router = express.Router();

// --- تحميل الميدل وير والموديلات / Load middleware and models ---
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Person = require('../models/Person');

// --- ميدل وير للتحقق من الأدمن / Middleware to check if user is admin ---
// هذا يعمل بعد authMiddleware ويتحقق أن المستخدم أدمن
const adminCheck = async (req, res, next) => {
  try {
    // البحث عن المستخدم / Find the user
    const user = await User.findById(req.user.userId);

    // التحقق إذا كان أدمن / Check if admin
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    next(); // متابعة / Continue
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ============================================
// 1) جلب كل المستخدمين / GET all users
// GET /api/admin/users
// ============================================
router.get('/users', authMiddleware, adminCheck, async (req, res) => {
  try {
    // جلب كل المستخدمين بدون كلمة المرور / Get all users without password
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// 2) جلب كل الأشخاص لكل المستخدمين / GET all persons from all users
// GET /api/admin/persons
// ============================================
router.get('/persons', authMiddleware, adminCheck, async (req, res) => {
  try {
    // جلب كل الأشخاص مع معلومات المستخدم / Get all persons with user info
    // populate يجلب بيانات المستخدم المرتبط / populate gets the linked user data
    const persons = await Person.find().populate('user', 'name email');
    res.json(persons);
  } catch (error) {
    console.error('Get all persons error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// 3) إحصائيات / GET stats
// GET /api/admin/stats
// ============================================
router.get('/stats', authMiddleware, adminCheck, async (req, res) => {
  try {
    // عدد المستخدمين / Count users
    const totalUsers = await User.countDocuments();
    // عدد الأشخاص / Count persons
    const totalPersons = await Person.countDocuments();

    res.json({ totalUsers, totalPersons });
  } catch (error) {
    console.error('Get stats error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- تصدير الراوتر / Export the router ---
module.exports = router;
