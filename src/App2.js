import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

function App() {
  const [songName, setSongName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [lyrics, setLyrics] = useState('');

  const authenticateSpotify = async () => {
    try {
      const response = await axios.get('/api/token');
      const { access_token } = response.data;
      spotifyApi.setAccessToken(access_token);
    } catch (error) {
      console.error(error);
    }
  };

  const searchLyrics = async (e) => {
    e.preventDefault();

    try {
      const { tracks } = await spotifyApi.searchTracks(`${songName} artist:${artistName}`);
      if (tracks.items.length === 0) {
        setLyrics('Lyrics not found');
        return;
      }

      const trackId = tracks.items[0].id;

      const response = await axios.get(`/api/lyrics/${trackId}`);
      const { lyrics } = response.data;

      setLyrics(lyrics);
    } catch (error) {
      console.error(error);
      setLyrics('Lyrics not found');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h1 className="text-center mb-4">Spotify Lyrics</h1>
              <Form onSubmit={searchLyrics}>
                <Form.Group controlId="inputSongName">
                  <Form.Label>Song Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter song name"
                    value={songName}
                    onChange={(e) => setSongName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="inputArtistName">
                  <Form.Label>Artist Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter artist name"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" block>
                  Search Lyrics
                </Button>
              </Form>

              <Card.Text className="mt-4">
                <h2 className="text-center">Lyrics:</h2>
                <pre className="text-center">{lyrics}</pre>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;