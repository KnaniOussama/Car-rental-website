const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    require('./cron'); // Start the cron job after the DB connection is established
  })
  .catch(err => console.log(err) );


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth.routes.js');
const carRoutes = require('./routes/car.routes.js');
app.use('/auth', authRoutes);
app.use('/cars', carRoutes);
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
