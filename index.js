const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const router = require('./router/index')
const logger = require("morgan");
const errorMiddleware = require('./middlewares/error-middleware');
const PORT = process.env.PORT || 5000;
const path = require('path')
const session = require("express-session");
const pgSession = require('connect-pg-simple')(session)
const passport = require("passport");
const mongoose = require("mongoose");
const sessionPool = require('pg').Pool
const config = require('./config/config');
const randomString = require("randomstring");
const sessionDBaccess = new sessionPool({
  user: config.user,
  password: config.password,
  host: config.host,
  port: config.port,
  database: config.database,})

const sessionConfig = {
  store: new pgSession({
    pool: sessionDBaccess,
    tableName: 'session'
  }),
  name: 'SID',
  secret: randomString.generate({
    length: 14,
    charset: 'alphanumeric'
  }),
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: true,
    secure: false // ENABLE ONLY ON HTTPS
  }}
const app = express()
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
app.use(async (req, res, next) => {
  try {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    res.locals.currentUser = req.user;
    next();
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});
app.use('/', router);
app.use(errorMiddleware);
const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}


start()
