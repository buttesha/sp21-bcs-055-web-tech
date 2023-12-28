
const express = require('express');
const router = express.Router();
const Room = require('../models/room');
const mongoose = require('mongoose');
const validateRoom = async (req, res, next) => {
    try {
        const { name, capacity } = req.body;
        if (!name || !capacity) {
            return res.status(400).send('Name and capacity are required.');
        }
        if (isNaN(capacity) || capacity <= 0) {
            return res.status(400).send('Capacity must be a valid positive number.');
        }
        const allowedRoomNames = ['simple', 'double', 'luxurious'];
        if (!allowedRoomNames.includes(name.toLowerCase())) {
            return res.status(400).send('Invalid room name.');
        }
        next();
    } catch (error) {
        console.error('Error in validateRoom middleware:', error);
        res.status(500).send('Internal Server Error');
    }
};

router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.render('index', { rooms });
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).send('Internal Server Error');
    }
});
//Create a new room
router.post('/add', validateRoom, async (req, res) => {
    try {
        const { name, capacity } = req.body;
        const room = new Room({ name, capacity });
        await room.save();
        res.redirect('/');
    } catch (error) {
        console.error('Error creating a new room:', error);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room.findById(id);
        res.render('update', { room });
    } catch (error) {
        console.error('Error fetching room for update:', error);
        res.status(500).send('Internal Server Error');
    }
});
router.post('/update/:id', validateRoom, async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid room ID.');
        }
        const { name, capacity } = req.body;
        await Room.findByIdAndUpdate(id, { name, capacity });
        res.redirect('/');
    } catch (error) {
        console.error('Error updating room:', error);
        res.status(500).send('Internal Server Error');
    }
});
// Delete a room
router.post('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Room.findByIdAndDelete(id);
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).send('Internal Server Error');
    }
});
