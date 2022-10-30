const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const compression = require('compression');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');
const { errorHandle } = require('./errorHandler');
const morgan = require("morgan");
const https = require("https");
const fs = require("fs");
require('dotenv').config();
app.set("view engine", "ejs");
const cors = require('cors');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(errorHandle);
app.use(morgan("common"));
// app.use(locale);
app.use('/public', express.static(process.cwd() + '/public'));
const { GetSign, GetLogIn,logout, login, resetPassword, dashboard, Home, Create, Delete, findAll, findById, findAndUpdate } = require('./controllers/controller');

//
app.get('/', GetSign);
app.post('/user', Create);
app.get("/login", GetLogIn);
app.get('/dashboard', dashboard);
app.get('/resetPassword', resetPassword);
app.get('/home', Home);
app.get('/logout', logout);
app.post('/login', login);
app.get('/login/users', findAll);
app.get('/login/users/:id', findById);
app.put('/login/users/:id', findAndUpdate);
app.delete('/login/users/:id', Delete);

//DataBase connection
const uri = process.env.MONGO_CONNECT;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
// const credentials = {
//     key: fs.readFileSync("my-api.key", "utf8"),
//     cert: fs.readFileSync("my-api.cert", "utf8")
// };
// https
//     .createServer(credentials, app);
mongoose.connect(uri, options).then(() => {
    const db = mongoose.connection;
    db.once('open', () => { console.log('successfully connected to the database') });
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
}).catch(err => {
    console.log('an error occured while trying to connect to the database' + err)
    process.exit();
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});
//* session middleware
app.use(session({
    store: MongoStore.create({ mongoUrl: uri }),
    resave: true, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'shhhh, very secret',
    cookie: {
        maxAge: 6000
    },
}));
app.use(async(req, res, next) => {
    try {
        var err = await req.session.error;
        var msg = await req.session.success;
        delete(await req.session.error);
        delete(await req.session.success);
        res.locals.message = "";
        if (err) res.locals.message = '<p class="msg error">' + err + "</p>";
        if (msg) res.locals.message = '<p class="msg success">' + msg + "</p>";
        next();
    } catch (error) {
        console.log(error.message);
    }
});