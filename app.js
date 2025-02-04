require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node')

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req,res) => {
    res.render('index.hbs')
})

app.get("/artist-search-results", (req,res) => {})

app.get('/artist-search', (req,res) => {
    console.log(req.query)
    let myArtist = req.query.artist
    spotifyApi.searchArtists(myArtist)
    .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
    res.render('artist-search-results.hbs', {
        myArtistArray: data.body.artists.items
    })
    })
  .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.get('/albums/:artistId', (req,res,next) => {
    console.log('hello')
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(albums => { console.log('Data recieved', albums.body.items)
    res.render('albums.hbs', {
      albumArray: albums.body.items
    })
  })
  .catch(err => console.log('Error while searching for albums:', err))
})

app.get('/tracks/:albumId', (req,res,next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(tracks => { console.log('Data recieved', tracks.body.items)
  res.render('tracks.hbs', {
    trackArray: tracks.body.items
  })
})
.catch(err => console.log('Error occured while searching for tracks:', err))
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
