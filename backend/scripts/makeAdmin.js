require('dotenv').config();
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String
});

const User = mongoose.model('User', userSchema);

async function makeAdmin(email) {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found:', email);
      return;
    }
    
    console.log('📋 Current user:', {
      name: user.name,
      email: user.email,
      role: user.role
    });
    
    user.role = 'admin';
    await user.save();
    
    console.log('✅ User role updated to: admin');
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

const email = process.argv[2] || 'rishikeshkumar43210@gmail.com';
makeAdmin(email);
