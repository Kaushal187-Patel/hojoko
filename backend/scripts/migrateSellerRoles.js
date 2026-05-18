/**
 * One-time migration: legacy admin → mainAdmin, backfill product.seller from createdBy.
 * Run: node scripts/migrateSellerRoles.js
 */
require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');

const run = async () => {
  await connectDB();

  const adminResult = await User.updateMany({ role: 'admin' }, { $set: { role: 'mainAdmin' } });
  console.log(`Updated ${adminResult.modifiedCount} legacy admin user(s) to mainAdmin`);

  const products = await Product.find({
    $or: [{ seller: { $exists: false } }, { seller: null }],
    createdBy: { $exists: true, $ne: null },
  });

  let backfilled = 0;
  for (const product of products) {
    product.seller = product.createdBy;
    await product.save();
    backfilled += 1;
  }

  console.log(`Backfilled seller on ${backfilled} product(s)`);
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
