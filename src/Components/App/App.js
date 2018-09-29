import React, { Component } from 'react';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import { Spotify } from '../../util/Spotify';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: 'Playlist Name',
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);

  };

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      let newPlaylist = this.state.playlistTracks.slice();
      console.log(newPlaylist);
      newPlaylist.push(track);
      this.setState({playlistTracks: newPlaylist});
    }
  };

  removeTrack(track) {
    if (!this.state.playlistTracks.find(trackRemove =>
    trackRemove.id === track.id)) {
      return;
    } else {
      let newPlaylist = this.state.playlistTracks.filter(trackRemove =>
      trackRemove.id !== track.id);
      this.setState({playlistTracks : newPlaylist});
    }
  };

  updatePlaylistName(name) {
    this.setState({playlistName:name});
  };

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(playlistTrack => playlistTrack.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs);

    this.setState({
      searchResults: [],
      playlistTracks: [],
    });

    this.updatePlaylistName('New Playlist');
  };

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults});
    });
    this.updatePlaylistName('New Playlist');
  };

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
};

export default App;
