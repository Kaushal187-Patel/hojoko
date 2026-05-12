require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

const seed = async () => {
  await connectDB();

  await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany()]);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@hozoko.com',
    password: 'admin123',
    role: 'admin',
    phone: '9999999999',
  });

  const user = await User.create({
    name: 'Demo User',
    email: 'user@hozoko.com',
    password: 'user123',
    phone: '8888888888',
  });

  const categories = await Category.insertMany([
    { name: 'Electronics', description: 'Gadgets and devices' },
    { name: 'Fashion', description: 'Clothing and accessories' },
    { name: 'Home', description: 'Home and living essentials' },
  ]);

  await Product.insertMany([
    {
      name: 'Wireless Headphones',
      description: 'Noise-cancelling over-ear headphones with 30-hour battery life.',
      price: 4999,
      comparePrice: 6999,
      category: categories[0]._id,
      stock: 25,
      brand: 'SoundMax',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      createdBy: admin._id,
    },
    {
      name: 'Minimalist Watch',
      description: 'Stainless steel watch with sapphire glass and leather strap.',
      price: 3499,
      category: categories[1]._id,
      stock: 18,
      brand: 'TimeCraft',
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      createdBy: admin._id,
    },
    {
      name: 'Ceramic Mug Set',
      description: 'Set of four handcrafted ceramic mugs for everyday use.',
      price: 1299,
      category: categories[2]._id,
      stock: 40,
      brand: 'HomeNest',
      images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80'],
      createdBy: admin._id,
    },
    {
      name: 'Smart Speaker',
      description: 'Voice assistant speaker with rich bass and smart home controls.',
      price: 5999,
      category: categories[0]._id,
      stock: 12,
      brand: 'EchoLite',
      images: ['https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=80'],
      createdBy: admin._id,
    },
  ]);

  console.log('Seed complete');
  console.log('Admin: admin@hozoko.com / admin123');
  console.log('User: user@hozoko.com / user123');
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
