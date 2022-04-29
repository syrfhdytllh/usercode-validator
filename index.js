const serverless = require('serverless-http');
const express = require("express");
const bodyParser = require("body-parser");
const { userCodeValidator } = require("./src/userCodeValidator");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/userCodeValidator', async (req, res) => {
    return userCodeValidator(req, res)
});

//app.listen(PORT);
module.exports.handler = serverless(app);
