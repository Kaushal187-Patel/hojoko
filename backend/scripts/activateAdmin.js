require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@hozoko.com';

const activateAdmin = async () => {
  await connectDB();

  const result = await User.updateMany(
    { role: { $in: ['admin', 'mainAdmin'] } },
    { $set: { isActive: true } }
  );

  const admin = await User.findOne({ email: ADMIN_EMAIL }).select('name email role isActive');

  if (!admin) {
    console.log(`No user found with email ${ADMIN_EMAIL}. Activating all admin-role accounts only.`);
  } else {
    console.log(`Activated: ${admin.name} (${admin.email}) — isActive: ${admin.isActive}`);
  }

  console.log(`Updated ${result.modifiedCount} admin account(s).`);
  process.exit(0);
};

activateAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
