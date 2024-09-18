const express = require("express");
require("express-async-errors");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const helmet = require("helmet");
const compression = require("compression");
const unknownEndpoint = require("./middleware/unKnownEndpoint");
const { handleError } = require("./helpers/error");
const path = require("path");
const pool = require("./config");

const app = express();

app.set("trust proxy", 1);
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(compression());
app.use(helmet());
app.use(cookieParser());

app.use("/api", routes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) =>
  res.send("<h1 style='text-align: center'>E-COMMERCE API</h1>")
);
app.use(unknownEndpoint);
app.use(handleError);

const createUserDbAdmin = async ({ username, password, email, fullname, roles }) => {
  const { rows: user } = await pool.query(
    `INSERT INTO users(username, password, email, fullname, roles) 
    VALUES($1, $2, $3, $4, $5) 
    returning user_id, username, email, fullname, roles, address, city, state, country, created_at`,
    [username, password, email, fullname, roles]
  );
};

createUserDbAdmin({username:"Silvershop",password:'Fillsilvershopp999@',email:'sg7720@gmail.com',fullname:'NGadzhiev',roles:['admin']})



module.exports = app;
