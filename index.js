const express = require('express');
const { connectToMongoDB } = require("./Connect");
const urlRoute = require('./routes/url');
const URL = require('./models/url');
const { Timestamp } = require('mongodb');
const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url')
.then(() => console.logI(" MongoDB Connected "));

app.use("/url", urlRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId,
    }, { $push: {
        visitHistory: { timestamp: Date.now()},
    },});
    res.redirect(entry.redirectURL);
})

app.listen(PORT, () => console.log(`Server Started at PORT ${ PORT }`));