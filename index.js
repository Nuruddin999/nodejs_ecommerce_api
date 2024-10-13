const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const router = require('./router/index')
const errorMiddleware = require('./middlewares/error-middleware');
const PORT = process.env.PORT || 5000;
const path = require('path')


const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use('/', router);
app.use(errorMiddleware);
const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
      //  await sequelize.sync({ alter: true })
    } catch (e) {
        console.log(e);
    }
}


start()
