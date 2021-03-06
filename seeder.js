const dotenv = require('dotenv');
const fs = require('fs');
const colors = require('colors');
const mongoose =  require('mongoose');

// Load env config vars
dotenv.config({ path: './config/config.env' })

// Load Models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');

// Connect to DB
mongoose.connect(process.env.MONGO_URL, { 
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// Read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`));

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    console.log(`Data imported successfully`.green.inverse);
      
    process.exit();

  } catch (err) {
    console.error(err);
  }
}


const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    console.log(`Data Destroyed`.red.inverse);

    process.exit();
  } catch(err) {
    console.error(err);
  }
}

if (process.argv[2] === '-i') {
  importData();
} else if(process.argv[2] === '-d') {
  deleteData();
}