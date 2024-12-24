const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all requests
app.use(cors());

// Proxy endpoint
app.get('/countryInfo', async (req, res) => {
    const { username } = req.query; // Extract username from the query parameters
    const apiUrl = `http://api.geonames.org/countryInfoJSON?username=${username}`;

    try {
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data from GeoNames:', error.message);
        res.status(500).json({ error: 'Failed to fetch data from GeoNames API' });
    }
});

app.get('/health', (req, res) => {
    const service_health = { status: 'OK' };
    res.status(200).json({
        current_service: service_health,
    });
});



// Start the server
app.listen(PORT, () => {
    console.log(`Proxy server running at http://localhost:${PORT}`);
});
