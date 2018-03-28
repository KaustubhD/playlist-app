import React, { Component } from 'react';
import './App.css';

let defTextColor = {color: '#fff'}
let serverData = {
  user: {
    name: 'Kay',
    playlists: [
      {
        name: 'My Pl One',
        songs: [
          {
            name: 'Go Out', 
            duration: 123
          }, {
            name: 'Always Here', 
            duration: 123
          }, {
            name: 'About Me',
            duration: 123
          }
        ]
      },
      {
        name: 'My Pl Two ',
        songs: [
          {
            name: 'Mami',
            duration: 112
          }, {
            name: 'Go About It',
            duration: 112
          }, {
            name: 'Heard About You',
            duration: 112
          }
        ]
      },
      {
        name: 'My Pl Three',
        songs: [
          {
            name: 'Worldwide',
            duration: 93
          }, {
            name: 'Timber',
            duration: 93
          }, {
            name: 'Hello',
            duration: 93
          }
        ]
      },
      {
        name: 'My Pl Four',
        songs: [
          {
            name: 'I\'m here',
            duration: 45
          }, {
            name: 'Where were you',
            duration: 45
          }, {
            name: 'Animals',
            duration: 45
          }
        ]
      }
    ]
  }
}
class PlCounter extends Component{

    render(){
      return(
        <div className="aggregate" style={{...defTextColor, width: '40%', display: 'inline-block'}}>
          <h2>{this.props.playlists.length} Playlist(s)</h2>
        </div>
      )
    }

}

class PlLength extends Component{

render(){
  let songs = this.props.playlists.reduce((acc, eachPl) => {
    return acc.concat(eachPl.songs)
  }, [])
  // console.log(songs)
  let totalHours = songs.reduce((acc, eachSong) => {
    return acc += eachSong.duration
  }, 0)
  return(
    <div className="aggregate" style={{...defTextColor, width: '40%', display: 'inline-block'}}>
      <h2>{totalHours} Hour(s)</h2>
    </div>
  )
}

}

class Filter extends Component{
  render(){
    return(
      <div style={defTextColor} onChange={event => this.props.onTextChange(event.target.value)}>
        <img />
        <input type="text" />
      </div>
    )
  }
}

class Playlist extends Component{
  render(){
    let playlists = this.props.playlists
    return(
      <div style={{...defTextColor, width: '20%', display: 'inline-block'}}>
        <img />
        <h3>{playlists.name}</h3>
        <ul>
          {
            playlists.songs.map(song => 
              <li>{song.name}</li>
            )
          }
        </ul>
      </div>
    )
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      serverData: {},
      filterString: ''
    }
  }
  componentDidMount(){
    setTimeout(() =>{
      this.setState({
        serverData
      })
    }, 1000)
  }
  render() {
    let playlistsFinal = this.state.serverData.user ? this.state.serverData.user.playlists.filter(pl => 
      pl.name.toLowerCase().includes(this.state.filterString.toLowerCase())) : []
    return (
      <div className="App">
        {
          // Render the div element only if the serverData.user exists
          this.state.serverData.user ?
          <div>
            <h1>{this.state.serverData.user.name}'s Playlists</h1>
            <PlCounter playlists={playlistsFinal}/>
            <PlLength playlists={playlistsFinal}/>
            <Filter onTextChange={text => this.setState({filterString: text})}/>
            {
              playlistsFinal.map(pl =>
                <Playlist playlists={pl}/>
              )}
          </div> : <h1>Loading....</h1>
          // Else, render the h1 with loading text
        }
      </div>
    );
  }
}

export default App;
