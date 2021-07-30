const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');



mongoose.connect('mongodb://localhost:27017/loginDemo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'notagoodsecret',
    resave: false,
    saveUninitialized: false,
}))
// login middleware
const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login');
    } next();
}
//home
app.get('/', (req, res) => {
    res.render('home')
})
//route to secret
app.get('/secret', requireLogin, (req, res) => {
    res.render('secret')
})
//register username
app.get('/register', (req, res) => {
    res.render('register')
})
//create a username, Sign Up
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const newUser = await new User({ username, password });
    await newUser.save()
    //user id is added to session when you are successfuly logged in
    req.session.user_id = newUser._id;
    res.redirect('/')
})
//Login
app.get('/login', (req, res) => {
    res.render('login')
});
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const foundUser = awaitUser.findAndValidate(username, password)
    // const user = await User.findOne({ username });
    // const validPassword = await bcrypt.compare(password, user.password);
    if (foundUser) {
        req.session.user_id = foundUser._id;
        //user id is added to session when you are successfuly logged in
        res.send('Access Granted');
    } else {
        res.send('Access denied');
    }

})
//logout
app.post('/logout', (req, res) => {
    req.session.user_id = null
    res.redirect('/login');
})
//local port 3000
app.listen(3000, () => {
    console.log("SERVING YOUR APP!")
})

