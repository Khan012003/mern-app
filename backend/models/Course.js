const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: String,
  duration: String
});

const Course = mongoose.model('Course', courseSchema);

// Add mock data using async IIFE
(async () => {
  try {
    const count = await Course.countDocuments();
    if (count === 0) {
      await Course.insertMany([
        { title: 'Responsive Web Design', duration: '300 hours' },
        { title: 'JavaScript Algorithms', duration: '200 hours' }
      ]);
      console.log('Mock courses added successfully');
    }
  } catch (err) {
    console.error('Error seeding courses:', err);
  }
})();

module.exports = Course;