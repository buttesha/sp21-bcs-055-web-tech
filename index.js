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
const roomSchema = new mongoose.Schema({
    name: String,
    capacity: Number,
});

const Room = mongoose.model('Room', roomSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Display all rooms
app.get('/', async (req, res) => {
    const rooms = await Room.find();
    res.render('index', { rooms });
});

// Create a new room
app.post('/add', async (req, res) => {
    const { name, capacity } = req.body;
    const room = new Room({ name, capacity });
    await room.save();
    res.redirect('/');
});




// Update a room
app.get('/update/:id', async (req, res) => {
    const { id } = req.params;
    const room = await Room.findById(id);
    res.render('update', { room });
});

app.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name, capacity } = req.body;
    await Room.findByIdAndUpdate(id, { name, capacity });
    res.redirect('/');
});


// Delete a room
app.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await Room.findByIdAndDelete(id);
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
