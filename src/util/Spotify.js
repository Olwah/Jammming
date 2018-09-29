const spotifyEndpoint = 'https://accounts.spotify.com/authorize';
const clientID = 'f228b8bc2317429a833e296db6ad9fd8';
const redirectURI = 'http://localhost:3000/';
const searchCore = 'https://api.spotify.com/v1/';


let token;

export const Spotify = {
  getAccessToken() {
    if(token) {
      return token;
    }

    const urlToken = window.location.href.match(/access_token=([^&]*)/);
    const tokenExpiration = window.location.href.match(/expires_in=([^&]*)/);

    if (urlToken && tokenExpiration) {
      token = urlToken[1];
      const expires = Number(tokenExpiration[1]);
      window.setTimeout(()=> token = '', expires * 1000);
      window.history.pushState('Access Token', null, '/');
      return token;
    } else {
      const accessURL = `${spotifyEndpoint}?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = accessURL;
    }
  },

  search(term) {
    let token = Spotify.getAccessToken();
    return fetch(`${searchCore}search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${token}`
    }}).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if(!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }))
    });
  },

  savePlaylist(name, trackURIs) {
    if(!name || !trackURIs || trackURIs.length === 0) return;
    const searchURL = searchCore + 'me';
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    let userID;
    let playlistID;
    fetch(searchURL, {
      headers: headers
    }).then(response => response.json())
      .then(jsonResponse => userID = jsonResponse.id)
      .then(() => {
        const createPlaylist = `${searchCore}users/${userID}/playlists`;
        fetch(createPlaylist, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(
            { name : name }
          )
        })
        .then(response => response.json())
        .then(jsonResponse => playlistID = jsonResponse.id)
        .then(() => {
          const addPlaylistTracks = `${searchCore}/playlists/${playlistID}/tracks`;
          fetch(addPlaylistTracks, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
              'uris': trackURIs
            })
          });
        })
      })
    }
  };
