const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get('/api/token', async (req, res) => {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')),
        },
      }
    );
    res.json({ access_token: response.data.access_token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve access token' });
  }
});

app.get('/api/lyrics/:trackId', async (req, res) => {
  try {
    const { trackId } = req.params;

    const response = await axios.get(`https://api.spotifylyrics.com/v1/tracks/${trackId}`);
    res.json({ lyrics: response.data.lyrics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve lyrics' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
