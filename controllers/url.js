const shortid = require("shortid");
const URL = require('../models/url');

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    
    // Log the request body to inspect its content
    console.log('Request Body:', body);
    
    if (!body.url) return res.status(400).json({ error: 'URL is required' });
    
    const shortID = shortid.generate();
    
    try {
        const newUrl = await URL.create({
            shortId: shortID,
            redirectURL: body.url,
            visitHistory: [],
        });

        console.log('New URL created:', newUrl);

        return res.render('home', {
            id: shortID,
        });
\
        return res.json({ id: shortID });

    } catch (error) {
        console.error('Error creating new short URL:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    return res.json({ totalClicks: result.visitHistory.length, analytics: result.visitHistory});
}

module.exports = {
    handleGenerateNewShortURL, 
    handleGetAnalytics,
}
