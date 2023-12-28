// app.js

const express = require('express');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

const app = express();
const port = 3001;

// MongoDB connection
const mongoURI = 'mongodb+srv://esha:esha1234@cluster0.zamuvee.mongodb.net/test';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
// app.use(expressLayouts);

// Specify the location of views
app.set('views', path.join(__dirname, 'views'));

// Define your routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.set('layout', 'layout');

// Start the local server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
