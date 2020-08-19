const express = require("express");
const { json } = require("body-parser");

const app = express();

app.use(json());

app.get("/api/user/currentuser", (req, res) => {
    res.send("Hi there");
});

const PORT = 3000 || process.env.PORT;

app.listen(PORT, () => {
    console.log(`App is listening on port: ${PORT} !`);
});
