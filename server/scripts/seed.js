const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Expense = require('../models/Expense');

dotenv.config();

const categories = [
  'Food',
  'Travel',
  'Bills & Utilities',
  'Shopping',
  'Entertainment',
  'Health & Medical',
  'Education',
  'House Keeping',
  'Others'
];

const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'UPI', 'Other'];

// Predefined mock descriptions for categories
const titles = {
  'Food': ['Weekly Grocery shopping', 'Dinner at Italian Restaurant', 'Starbucks Coffee', 'Lunch with Team', 'Ordered UberEats'],
  'Travel': ['Uber Ride to Office', 'Gasoline refill', 'Flight tickets for Vacation', 'Metro Card recharge', 'Train fare'],
  'Bills & Utilities': ['Electricity Bill', 'High-speed Internet', 'Water Bill', 'Mobile Recharge', 'Netflix Subscription'],
  'Shopping': ['Winter Jacket', 'Running shoes', 'Ergonomic office chair', 'Casual Shirt', 'Gift for friend'],
  'Entertainment': ['Movie Tickets', 'Concert tickets', 'Video Game', 'Bowling with friends', 'Museum pass'],
  'Health & Medical': ['Monthly Medicines', 'Dental checkup', 'Gym membership', 'Vitamin supplements', 'Eye exam'],
  'Education': ['Udemy Course on React', 'Books on Finance', 'Tech Conference registration', 'Monthly Magazine subscription', 'College Textbook'],
  'House Keeping': ['Laundry Detergent & Supplies', 'Vacuum cleaner repair', 'Monthly cleaning service', 'Kitchen organizers', 'Trash bags & sponges'],
  'Others': ['ATM cash withdrawal fee', 'Courier charges', 'Key duplication', 'Charity donation', 'Miscellaneous items']
};

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomAmount = (min, max) => Math.round((Math.random() * (max - min) + min) * 100) / 100;

const generateMockExpenses = (userId) => {
  const expenses = [];
  const currentDate = new Date();

  // Create expenses spread over the last 6 months
  for (let i = 5; i >= 0; i--) {
    // Determine target month
    const targetMonth = new Date();
    targetMonth.setMonth(currentDate.getMonth() - i);

    // Number of expenses for this month (between 5 and 9)
    const numExpenses = Math.floor(Math.random() * 5) + 5;

    for (let j = 0; j < numExpenses; j++) {
      const category = getRandomItem(categories);
      const title = getRandomItem(titles[category]);
      
      // Random day in target month
      const expenseDate = new Date(targetMonth);
      expenseDate.setDate(Math.floor(Math.random() * 28) + 1);
      // Random hour
      expenseDate.setHours(Math.floor(Math.random() * 12) + 9);

      // Generate a reasonable amount based on category
      let amount = getRandomAmount(10, 80);
      if (category === 'Bills & Utilities') amount = getRandomAmount(50, 150);
      if (category === 'Travel' && Math.random() > 0.8) amount = getRandomAmount(200, 600); // expensive trip
      if (category === 'Education') amount = getRandomAmount(30, 200);

      expenses.push({
        userId,
        title,
        amount,
        category,
        paymentMethod: getRandomItem(paymentMethods),
        notes: Math.random() > 0.5 ? `Mock expense for ${title.toLowerCase()}` : '',
        expenseDate
      });
    }
  }
  return expenses;
};

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expense_tracker';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Expense.deleteMany();
    console.log('Cleared existing database records.');

    // Seed Demo User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: hashedPassword,
      themePreference: 'dark' // Default to dark mode for modern visual impact
    });

    console.log(`Demo User created: ${demoUser.email} / password123`);

    // Seed Expenses
    const mockExpenses = generateMockExpenses(demoUser._id);
    await Expense.insertMany(mockExpenses);
    console.log(`Successfully seeded ${mockExpenses.length} expenses for demo user.`);

    console.log('Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding database failed:', error);
    process.exit(1);
  }
};

seedDatabase();
