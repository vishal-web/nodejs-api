const express =  require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load env var
dotenv.config({ path: './config/config.env' });
const app = express();

// Connect database
connectDB();``

// Body parser
app.use(express.json());


if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use('/api', routes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} on PORT ${PORT}`.yellow.bold));

// Handle unhandled error
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)

  server.close(() => process.exit(1));
})