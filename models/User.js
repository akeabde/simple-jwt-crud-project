// ===== models/User.js =====
// هذا الملف يحدد شكل بيانات المستخدم في قاعدة البيانات
// This file defines the User data structure in the database

// --- تحميل mongoose / Load mongoose ---
const mongoose = require('mongoose');

// --- تعريف الـ Schema (الهيكل) / Define the Schema ---
// Schema = الشكل الذي ستُحفظ به البيانات / The shape of data in the database
const userSchema = new mongoose.Schema({

  // اسم المستخدم / User's name
  name: {
    type: String,       // نوع البيانات: نص / Data type: text
    required: true      // مطلوب: لازم يكون موجود / Required: must exist
  },

  // البريد الإلكتروني / Email address
  email: {
    type: String,       // نوع البيانات: نص / Data type: text
    required: true,     // مطلوب / Required
    unique: true        // فريد: لا يمكن تكرار نفس الإيميل / Unique: no duplicate emails
  },

  // كلمة المرور (ستكون مشفرة) / Password (will be hashed)
  password: {
    type: String,       // نوع البيانات: نص / Data type: text
    required: true      // مطلوب / Required
  },

  // هل المستخدم أدمن؟ / Is the user an admin?
  isAdmin: {
    type: Boolean,      // نوع البيانات: صح أو خطأ / Data type: true or false
    default: false      // القيمة الافتراضية: false (ليس أدمن) / Default: false (not admin)
  }

}, {
  // إضافة تاريخ الإنشاء والتعديل تلقائياً / Automatically add creation & update dates
  timestamps: true
});

// --- تصدير الموديل / Export the model ---
// "User" هو اسم المجموعة في قاعدة البيانات / "User" is the collection name in the database
module.exports = mongoose.model('User', userSchema);
