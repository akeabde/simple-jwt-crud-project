# استخدام صورة Node.js رسمية / Use official Node.js image
FROM node:18-alpine

# تحديد مجلد العمل داخل الحاوية / Set working directory
WORKDIR /usr/src/app

# نسخ ملفات package.json أولاً لتثبيت المكتبات / Copy package.json
COPY package*.json ./

# تثبيت المكتبات / Install dependencies
RUN npm install

# نسخ باقي ملفات المشروع / Copy the rest of the project files
COPY . .

# تحديد البورت / Expose the port
EXPOSE 5000

# تشغيل السيرفر / Command to run the app
CMD [ "npm", "start" ]
