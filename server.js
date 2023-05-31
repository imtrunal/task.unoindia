const express = require('express');
const app = express();
const cookieparser = require("cookie-parser");
const cors = require("cors");

require('./db/conn');
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieparser());
app.use(cors());

app.get("/", (req, res) => {
    res.send('Hello Node')
});

const userRoutes = require('./routes/user.routes');
app.use("/user", userRoutes);

app.listen(PORT, () => {
    console.log(`Server Running At Port : ${PORT}`);
});