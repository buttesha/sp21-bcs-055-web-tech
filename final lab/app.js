// /app.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

mongoose.connect('mongodb+srv://esha:esha1234@cluster0.zamuvee.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
app.use(express.static("public"));

// Import your routes
const indexRouter = require('./routes/index');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


// Use your routes
app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
