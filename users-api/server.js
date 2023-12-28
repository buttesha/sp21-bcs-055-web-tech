const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');  // Add cookie-parser

const app = express();
const PORT = 3001;
const SECRET_KEY = 'your-secret-key';

app.use(bodyParser.json());
app.use(cookieParser());  // Use cookie-parser middleware

let users = [
    { id: 1, username: 'admin', password: 'adminpassword' },
];

// Root path handler
app.get('/', (req, res) => {
    res.send('Users API is running!');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

    res.cookie('token', token, { expires: new Date(Date.now() + 3600000), httpOnly: true });

    res.json({ token });
});


app.get('/users', verifyToken, (req, res) => {
    res.json(users);
});

function verifyToken(req, res, next) {
    // Retrieve the token from the cookie
    const token = req.cookies['token'];

    if (!token) {
        return res.status(403).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        req.userId = decoded.id;
        next();
    });
}

app.listen(PORT, () => {
    console.log(`Users API is running on port ${PORT}`);
});
