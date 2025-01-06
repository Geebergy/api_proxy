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

app.get('/user-location', async (req, res) => {
  const userIp = req.query.ip;  // Get IP from query parameters
  const apiUrl = `http://ip-api.com/json/${userIp}`;  // Pass the IP to the API URL

  try {
    const response = await axios.get(apiUrl);
    res.json(response.data);  // Send the location data back to the frontend
  } catch (error) {
    console.error('Error fetching data from ip-api:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from IP API' });
  }
});

app.post('/send-email', async (req, res) => {
  const { customName, customEmail, customMessage } = req.body;

  // Set up Gmail SMTP transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'obeingilbert3884@gmail.com', // Your Gmail address
      pass: process.env.gmail_pass,   // Your Gmail password (or App password if 2FA enabled)
    },
  });

  // Email options
  const mailOptions = {
    from: customEmail,
    to: 'oremifoundation.ng@gmail.com',  // Your email where you want to receive the message
    subject: `Message from ${customName}`,
    text: `Message from: ${customName}\nEmail: ${customEmail}\n\nMessage:\n${customMessage}`,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
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
