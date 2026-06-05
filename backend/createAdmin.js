require('dotenv').config();
const mongoose = require('mongoose');
const AdminUser = require('./models/AdminUser');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("🟢 Connected to MongoDB...");
    
    const exists = await AdminUser.findOne({ email: 'admin@samyetravels.com' });
    if (exists) {
        console.log("⚠️ Admin account already exists! You can go log in right now.");
        process.exit(0);
    }

    await AdminUser.create({ 
        email: 'admin@samyetravels.com', 
        password: 'Samye@123' // Change this if you want!
    });
    
    console.log("✅ Admin account created successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Database Error:", err.message);
    process.exit(1);
  });