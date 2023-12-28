const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const app = express();
const User = require('./models/User');


app.use(express.static("public"));
app.set('port', 4000);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        key: 'user_id',
        secret: 'thisisrandomstuff',
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 600000
        }
    })
);

// app.use((req, res, next) => {
//     if (req.session.user && req.cookies.user_id) {
//         // Redirect to dashboard only if the requested URL is not already '/dashboard'
//         if (req.originalUrl !== '/dashboard') {
//             res.redirect('/dashboard');
//         } else {
//             next();
//         }
//     } else {
//         next();
//     }
// });

var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_id) {
        res.redirect('/dashboard');
    } else {
        next();
    }
};

// app.get('/', sessionChecker, (req, res) => {
//     res.redirect('/login');
// });

app.route('/login')
    .get((req, res) => {
        res.sendFile(__dirname + '/public/login.html');
    })
    .post(async (req, res) => {
        const { username, password } = req.body;

        try {
            const user = await User.findOne({ username }).exec();

            if (!user || !(await user.comparePassword(password))) {
                res.redirect('/login?userType=regular');
                return;
            }

            if (user.isAdmin === true) {
                // Admin login successful
                req.session.user = user;
                return res.redirect('/admin_dashboard?adminLogin=true');
            }

            // Regular user login successful
            req.session.user = user;
            res.redirect('/dashboard');
        } catch (error) {
            console.error(error);
            res.redirect('/login');
        }
    });


app.route('/signup')
    .get( (req, res) => {
        res.sendFile(__dirname + '/public/signup.html');
    })
    .post(async (req, res) => {
        try {
            var user = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            });

            const savedUser = await user.save();

            console.log(savedUser);
            req.session.user = savedUser;
            res.redirect('/dashboard'); // Redirect to the dashboard after signup
        } catch (error) {
            console.error(error);
            res.redirect('/signup');
        }
    });
app.get('/logout', (req, res) => {
    console.log("logout hit");
    req.session.user=null;
    res.clearCookie('user_id');

        res.redirect('/login');

});
app.get('/admin_dashboard', (req, res) => {
    if (req.session.user && req.cookies.user_id) {
        if (req.session.user.isAdmin) {
            // Admin dashboard
            return res.sendFile(__dirname + '/public/admin_dashboard.html');
        }

        // Regular user dashboard
        return res.sendFile(__dirname + '/public/dashboard.html');
    } else {
        res.redirect('/dashboard');
    }
});
app.get('/dashboard', (req, res) => {
    if (req.session.user && req.cookies.user_id) {
        if (req.session.user.isAdmin) {
            // Admin dashboard
            return res.sendFile(__dirname + '/public/admin_dashboard.html');
        }

        // Regular user dashboard
        return res.sendFile(__dirname + '/public/dashboard.html');
    } else {
        res.redirect('/login');
    }
});



const createAdminUser = async () => {
    try {
        const adminUser = await User.findOne({ username: 'admin' }).exec();

        if (!adminUser) {
            const newAdminUser = new User({
                username: 'admin',
                email: 'admin@example.com',
                password: 'admin_password',
                isAdmin: true
            });

            await newAdminUser.save();
            console.log('Admin user created successfully.');
        } else {
            console.log('Admin user already exists.');
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};

// Call the function to create an admin user
createAdminUser();

// ... continue with other routes and the rest of your code ...


app.listen(app.get('port'), () => {
    console.log('App is listening on port 4000');
});
