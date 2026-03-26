// ===== routes/persons.js =====
// هذا الملف يحتوي على راوتات إدارة الأشخاص (CRUD)
// This file contains Person management routes (Create, Read, Update, Delete)

// --- تحميل المكتبات / Load libraries ---
const express = require('express');
const router = express.Router();

// --- تحميل الميدل وير والموديل / Load middleware and model ---
const authMiddleware = require('../middleware/authMiddleware');  // حماية الراوتات / Protect routes
const Person = require('../models/Person');                     // موديل الشخص / Person model

// ============================================
// كل الراوتات هنا محمية بالميدل وير / All routes here are protected by middleware
// يعني: لازم يكون المستخدم مسجل دخوله / Meaning: user must be logged in
// ============================================

// ============================================
// 1) إنشاء شخص جديد / CREATE a new person
// POST /api/persons
// ============================================
router.post('/', authMiddleware, async (req, res) => {
  try {
    // أخذ البيانات من الطلب / Get data from request
    const { ism, nasab, l3omr, description } = req.body;

    // إنشاء شخص جديد مع ربطه بالمستخدم الحالي
    // Create new person linked to the current user
    const newPerson = new Person({
      ism: ism,
      nasab: nasab,
      l3omr: l3omr,
      description: description,
      user: req.user.userId   // نأخذ الـ userId من التوكن / We get userId from the token
    });

    // حفظ في قاعدة البيانات / Save to database
    const savedPerson = await newPerson.save();

    // إرسال الشخص المحفوظ / Send the saved person
    res.status(201).json(savedPerson);

  } catch (error) {
    console.error('Create person error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// 2) جلب كل الأشخاص للمستخدم الحالي / GET all persons for current user
// GET /api/persons
// ============================================
router.get('/', authMiddleware, async (req, res) => {
  try {
    // البحث عن كل الأشخاص التابعين للمستخدم الحالي فقط
    // Find all persons belonging to the current user only
    const persons = await Person.find({ user: req.user.userId });

    // إرسال القائمة / Send the list
    res.json(persons);

  } catch (error) {
    console.error('Get persons error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// 3) تعديل شخص / UPDATE a person
// PUT /api/persons/:id
// ============================================
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    // أخذ البيانات الجديدة / Get new data
    const { ism, nasab, l3omr, description } = req.body;

    // البحث عن الشخص وتعديله / Find the person and update
    // شرط: الشخص لازم يكون تابع للمستخدم الحالي / Condition: must belong to current user
    const updatedPerson = await Person.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },   // شروط البحث / Search conditions
      { ism, nasab, l3omr, description },               // البيانات الجديدة / New data
      { new: true }                                      // أرجع البيانات بعد التعديل / Return updated data
    );

    // إذا لم نجد الشخص / If person not found
    if (!updatedPerson) {
      return res.status(404).json({ message: 'Person not found' });
    }

    // إرسال البيانات المعدلة / Send updated data
    res.json(updatedPerson);

  } catch (error) {
    console.error('Update person error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// 4) حذف شخص / DELETE a person
// DELETE /api/persons/:id
// ============================================
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // البحث عن الشخص وحذفه / Find the person and delete
    // شرط: لازم يكون تابع للمستخدم الحالي / Condition: must belong to current user
    const deletedPerson = await Person.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    // إذا لم نجد الشخص / If person not found
    if (!deletedPerson) {
      return res.status(404).json({ message: 'Person not found' });
    }

    // إرسال رسالة نجاح / Send success message
    res.json({ message: 'Person deleted successfully' });

  } catch (error) {
    console.error('Delete person error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- تصدير الراوتر / Export the router ---
module.exports = router;
