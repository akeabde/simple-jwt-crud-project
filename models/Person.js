// ===== models/Person.js =====
// هذا الملف يحدد شكل بيانات الشخص في قاعدة البيانات
// This file defines the Person data structure in the database

// --- تحميل mongoose / Load mongoose ---
const mongoose = require('mongoose');

// --- تعريف الـ Schema (الهيكل) / Define the Schema ---
const personSchema = new mongoose.Schema({

  // الاسم الأول / First name (ism = اسم)
  ism: {
    type: String,       // نوع البيانات: نص / Data type: text
    required: true      // مطلوب / Required
  },

  // اسم العائلة / Last name (nasab = نسب)
  nasab: {
    type: String,       // نوع البيانات: نص / Data type: text
    required: true      // مطلوب / Required
  },

  // العمر / Age (l3omr = العمر)
  l3omr: {
    type: Number,       // نوع البيانات: رقم / Data type: number
    required: true      // مطلوب / Required
  },

  // الوصف / Description
  description: {
    type: String,       // نوع البيانات: نص / Data type: text
    default: ''         // القيمة الافتراضية: فارغ / Default value: empty
  },

  // مالك هذا الشخص (المستخدم الذي أضافه)
  // Owner of this person (the user who created it)
  // هذا يربط كل شخص بالمستخدم الذي أنشأه / This links each person to the user who created them
  user: {
    type: mongoose.Schema.Types.ObjectId,   // نوع خاص: معرف مستخدم / Special type: user ID
    ref: 'User',                            // مرجع لموديل User / Reference to User model
    required: true                          // مطلوب / Required
  }

}, {
  // إضافة تاريخ الإنشاء والتعديل تلقائياً / Automatically add creation & update dates
  timestamps: true
});

// --- تصدير الموديل / Export the model ---
// "Person" هو اسم المجموعة في قاعدة البيانات / "Person" is the collection name
module.exports = mongoose.model('Person', personSchema);
