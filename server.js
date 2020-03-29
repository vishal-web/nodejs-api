const path = require('path');
const express =  require('express');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');

// Load env var
dotenv.config({ path: './config/config.env' });

const routes = require('./routes');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');


const app = express();

// Connect database
connectDB();``

// Body parser
app.use(express.json()); 

if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// File uploading
app.use(fileUpload());

// Set public path
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', routes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} on PORT ${PORT}`.yellow.bold));

// Handle unhandled error
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)

  server.close(() => process.exit(1));
})