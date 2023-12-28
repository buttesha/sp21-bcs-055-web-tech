const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3002;

app.use(bodyParser.json());

let rooms = [
    { id: 1, name: 'Room A', capacity: 10 },
    { id: 2, name: 'Room B', capacity: 15 },
];

app.get('/rooms', (req, res) => {
    res.json(rooms);
});

app.get('/rooms/:id', (req, res) => {
    const roomId = parseInt(req.params.id);
    const room = rooms.find(room => room.id === roomId);

    if (!room) {
        return res.status(404).json({ message: 'Room not found' });
    }

    res.json(room);
});

app.post('/rooms', (req, res) => {
    const { name, capacity } = req.body;

    const newRoom = {
        id: rooms.length + 1,
        name,
        capacity,
    };

    rooms.push(newRoom);
    res.status(201).json(newRoom);
});

app.listen(PORT, () => {
    console.log(`Rooms API is running on port ${PORT}`);
});
