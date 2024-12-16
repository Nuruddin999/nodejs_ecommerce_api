const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const router = require('./router/index')
const logger = require("morgan");
const errorMiddleware = require('./middlewares/error-middleware');
const PORT = process.env.PORT || 9000;
const path = require('path')
const { createClient }= require('ioredis');
const session = require("express-session");
const passport = require("passport");
const randomString = require("randomstring");
const { RedisStore } = require("connect-redis")
let redisClient = createClient(6379, '127.0.0.1', {})
redisClient.on('ready', function() {
  console.log('redis is running');
});

const sessionConfig = {
  store: new RedisStore({
  client: redisClient
  }),
  name: 'SID',
  secret: randomString.generate({
    length: 14,
    charset: 'alphanumeric'
  }),
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: 'none',
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
