const express = require("express");
const app = express();
const ConnectMongoDB = require("./database/dbConnect");
const errorHandler = require("./middlewares/errorHandler");
require("dotenv").config();
require("colors");
const cors = require("cors");
const user = require("./routes/user");
const auth = require("./routes/auth");

ConnectMongoDB.getConnection();

app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", auth);
app.use("/api/v1/user", user);
app.use(errorHandler);

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server is running on port: ${port}`.cyan));
