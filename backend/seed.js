const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Scholarship = require('./models/Scholarship');
const fs = require('fs');
const path = require('path');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected:', mongoose.connection.host))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const importData = async () => {
  try {
    await Scholarship.deleteMany();

    const scholarshipsPath = path.join(__dirname, '..', 'scholarships.json');
    const scholarshipsData = JSON.parse(fs.readFileSync(scholarshipsPath, 'utf-8'));

    await Scholarship.insertMany(scholarshipsData);

    console.log('✅ Data Imported Successfully!');
    console.log(`📚 Imported ${scholarshipsData.length} scholarships`);
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

importData();
