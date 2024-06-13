const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { connectToMongoDB } = require("./Connect");
const { restrictToLoggedinUserOnly, checkAuth } = require('./middlewares/auth');

const URL = require('./models/url');

const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const userRoute = require("./routes/user");

const { Timestamp } = require('mongodb');
const app = express();
const PORT = 8002;

connectToMongoDB("mongodb://localhost:27017/short-url")
.then(() => console.log(" MongoDB Connected "));

app.set("view engine", "ejs");
app.set('views', path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false}));
<<<<<<< HEAD
app.use(cookieParser());
=======
app.use(express.json())
>>>>>>> 2f64d6edffc2dab8fff5bdbd42b41b5cd22653e4

app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);

app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId,
    }, { $push: {
        visitHistory: { timestamp: Date.now()},
    },});
    if (entry !== null && entry !== undefined) {
        res.redirect(entry.redirectURL);
    } else {
        console.error("Entry is null or undefined.");
    }
    })

app.listen(PORT, () => console.log(`Server Started at PORT ${ PORT }`));