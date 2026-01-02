require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  isEmailVerified: Boolean
});

const User = mongoose.model('User', userSchema);

async function setupSuperUser() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // SuperUser credentials
    const SUPERUSER_EMAIL = 'superuser@eventhorizon.com';
    const SUPERUSER_PASSWORD = 'SuperAdmin@2025'; // Default password
    const SUPERUSER_NAME = 'SuperUser';
    
    // Remove admin role from all other users
    const updatedUsers = await User.updateMany(
      { 
        email: { $ne: SUPERUSER_EMAIL },
        role: { $in: ['admin', 'superadmin'] }
      },
      { 
        $set: { role: 'user' }
      }
    );
    
    console.log(`✅ Removed admin privileges from ${updatedUsers.modifiedCount} users`);
    
    // Check if SuperUser already exists
    let superUser = await User.findOne({ email: SUPERUSER_EMAIL });
    
    if (superUser) {
      console.log('⚠️  SuperUser already exists');
      console.log('📋 SuperUser details:', {
        name: superUser.name,
        email: superUser.email,
        role: superUser.role
      });
    } else {
      // Hash the default password
      const hashedPassword = await bcrypt.hash(SUPERUSER_PASSWORD, 10);
      
      // Create SuperUser
      superUser = await User.create({
        name: SUPERUSER_NAME,
        email: SUPERUSER_EMAIL,
        password: hashedPassword,
        role: 'superadmin',
        isEmailVerified: true
      });
      
      console.log('✅ SuperUser created successfully!');
      console.log('📋 SuperUser credentials:');
      console.log('   Email:', SUPERUSER_EMAIL);
      console.log('   Password:', SUPERUSER_PASSWORD);
      console.log('   ⚠️  SAVE THESE CREDENTIALS - Password shown only once!');
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Setup complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupSuperUser();
