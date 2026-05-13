require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Cart = require('../models/Cart');

const ADMIN_USERNAME = 'admin@hozoko.com';
const ADMIN_PASSWORD = 'Admin@123';
const DEMO_USER_USERNAME = 'user@hozoko.com';
const DEMO_USER_PASSWORD = 'User@123';

const defaultAddress = {
  street: '12 Market Street',
  city: 'Mumbai',
  state: 'Maharashtra',
  zipCode: '400001',
  country: 'India',
};

const buildOrderTotals = (items) => {
  const itemsPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 999 ? 0 : 49;
  const taxPrice = Math.round(itemsPrice * 0.18 * 100) / 100;

  return {
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice: itemsPrice + shippingPrice + taxPrice,
  };
};

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany(),
    Category.deleteMany(),
    Product.deleteMany(),
    Order.deleteMany(),
    Payment.deleteMany(),
    Cart.deleteMany(),
  ]);

  const admin = await User.create({
    name: 'HOZOKO Admin',
    email: ADMIN_USERNAME,
    password: ADMIN_PASSWORD,
    role: 'admin',
    phone: '9999999999',
  });

  const user = await User.create({
    name: 'Demo User',
    email: DEMO_USER_USERNAME,
    password: DEMO_USER_PASSWORD,
    phone: '8888888888',
  });

  const extraUsers = await User.insertMany([
    {
      name: 'Aisha Khan',
      email: 'aisha@hozoko.com',
      password: 'User@123',
      phone: '7777777777',
    },
    {
      name: 'Rohan Mehta',
      email: 'rohan@hozoko.com',
      password: 'User@123',
      phone: '6666666666',
    },
  ]);

  const categories = await Category.insertMany([
    {
      name: 'Electronics',
      description: 'Gadgets and devices',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Fashion',
      description: 'Clothing and accessories',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Home',
      description: 'Home and living essentials',
      image: 'https://images.unsplash.com/photo-1484101403633-562f891dc0a3?auto=format&fit=crop&w=800&q=80',
    },
  ]);

  const products = await Product.insertMany([
    {
      name: 'Wireless Headphones',
      description: 'Noise-cancelling over-ear headphones with 30-hour battery life.',
      price: 4999,
      comparePrice: 6999,
      category: categories[0]._id,
      stock: 25,
      brand: 'SoundMax',
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80',
      ],
      isFeatured: true,
      createdBy: admin._id,
    },
    {
      name: 'Minimalist Watch',
      description: 'Stainless steel watch with sapphire glass and leather strap.',
      price: 3499,
      category: categories[1]._id,
      stock: 3,
      brand: 'TimeCraft',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1508685096489-7aacad43d435?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1533139502658-0198f4d9a8c0?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1614164185124-d601507919c6?auto=format&fit=crop&w=800&q=80',
      ],
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
    {
      name: 'Linen Shirt',
      description: 'Breathable linen shirt for warm weather styling.',
      price: 2199,
      category: categories[1]._id,
      stock: 2,
      brand: 'HOZOKO Studio',
      images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      createdBy: admin._id,
    },
    {
      name: 'Scented Candle',
      description: 'Soy wax candle with cedarwood and bergamot notes.',
      price: 899,
      category: categories[2]._id,
      stock: 30,
      brand: 'HomeNest',
      images: ['https://images.unsplash.com/photo-1602607893850-0c9d73f0a1b5?auto=format&fit=crop&w=800&q=80'],
      createdBy: admin._id,
    },
  ]);

  const toOrderItem = (product, quantity) => ({
    product: product._id,
    name: product.name,
    image: product.images[0],
    quantity,
    price: product.price,
  });

  const deliveredItems = [toOrderItem(products[0], 1), toOrderItem(products[2], 2)];
  const deliveredTotals = buildOrderTotals(deliveredItems);

  const processingItems = [toOrderItem(products[1], 1)];
  const processingTotals = buildOrderTotals(processingItems);

  const shippedItems = [toOrderItem(products[3], 1)];
  const shippedTotals = buildOrderTotals(shippedItems);

  const pendingItems = [toOrderItem(products[4], 1)];
  const pendingTotals = buildOrderTotals(pendingItems);

  const deliveredOrder = await Order.create({
    user: user._id,
    orderItems: deliveredItems,
    shippingAddress: defaultAddress,
    ...deliveredTotals,
    isPaid: true,
    paidAt: new Date(),
    isDelivered: true,
    deliveredAt: new Date(),
    status: 'delivered',
    paymentResult: {
      id: 'pay_seed_delivered',
      status: 'captured',
      razorpayOrderId: 'order_seed_delivered',
      razorpayPaymentId: 'pay_seed_delivered',
    },
  });

  const processingOrder = await Order.create({
    user: extraUsers[0]._id,
    orderItems: processingItems,
    shippingAddress: defaultAddress,
    ...processingTotals,
    isPaid: true,
    paidAt: new Date(),
    status: 'processing',
    paymentResult: {
      id: 'pay_seed_processing',
      status: 'captured',
      razorpayOrderId: 'order_seed_processing',
      razorpayPaymentId: 'pay_seed_processing',
    },
  });

  const shippedOrder = await Order.create({
    user: extraUsers[1]._id,
    orderItems: shippedItems,
    shippingAddress: defaultAddress,
    ...shippedTotals,
    isPaid: true,
    paidAt: new Date(),
    status: 'shipped',
    paymentResult: {
      id: 'pay_seed_shipped',
      status: 'captured',
      razorpayOrderId: 'order_seed_shipped',
      razorpayPaymentId: 'pay_seed_shipped',
    },
  });

  const pendingOrder = await Order.create({
    user: user._id,
    orderItems: pendingItems,
    shippingAddress: defaultAddress,
    ...pendingTotals,
    isPaid: false,
    status: 'pending',
  });

  await Payment.insertMany([
    {
      user: user._id,
      order: deliveredOrder._id,
      razorpayOrderId: 'order_seed_delivered',
      razorpayPaymentId: 'pay_seed_delivered',
      amount: deliveredTotals.totalPrice,
      status: 'captured',
      email: user.email,
    },
    {
      user: extraUsers[0]._id,
      order: processingOrder._id,
      razorpayOrderId: 'order_seed_processing',
      razorpayPaymentId: 'pay_seed_processing',
      amount: processingTotals.totalPrice,
      status: 'captured',
      email: extraUsers[0].email,
    },
    {
      user: extraUsers[1]._id,
      order: shippedOrder._id,
      razorpayOrderId: 'order_seed_shipped',
      razorpayPaymentId: 'pay_seed_shipped',
      amount: shippedTotals.totalPrice,
      status: 'captured',
      email: extraUsers[1].email,
    },
    {
      user: user._id,
      order: pendingOrder._id,
      razorpayOrderId: 'order_seed_pending',
      amount: pendingTotals.totalPrice,
      status: 'created',
      email: user.email,
    },
  ]);

  await Cart.create({
    user: user._id,
    items: [
      {
        product: products[5]._id,
        quantity: 1,
        price: products[5].price,
      },
    ],
    totalItems: 1,
    totalAmount: products[5].price,
  });

  console.log('Seed complete');
  console.log(`Admin username: ${ADMIN_USERNAME}`);
  console.log(`Admin password: ${ADMIN_PASSWORD}`);
  console.log(`Demo user username: ${DEMO_USER_USERNAME}`);
  console.log(`Demo user password: ${DEMO_USER_PASSWORD}`);
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
