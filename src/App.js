import React, { Component } from 'react';
import './App.css';
import logo from './logo.svg';
import queryString from 'query-string';

let defTextColor = {color: '#fff'}
// let serverData = {
//   user: {
//     name: 'Kay',
//     playlists: [
//       {
//         name: 'My Pl One',
//         songs: [
//           {
//             name: 'Go Out', 
//             duration: 123
//           }, {
//             name: 'Always Here', 
//             duration: 123
//           }, {
//             name: 'About Me',
//             duration: 123
//           }
//         ]
//       },
//       {
//         name: 'My Pl Two ',
//         songs: [
//           {
//             name: 'Mami',
//             duration: 112
//           }, {
//             name: 'Go About It',
//             duration: 112
//           }, {
//             name: 'Heard About You',
//             duration: 112
//           }
//         ]
//       },
//       {
//         name: 'My Pl Three',
//         songs: [
//           {
//             name: 'Worldwide',
//             duration: 93
//           }, {
//             name: 'Timber',
//             duration: 93
//           }, {
//             name: 'Hello',
//             duration: 93
//           }
//         ]
//       },
//       {
//         name: 'My Pl Four',
//         songs: [
//           {
//             name: 'I\'m here',
//             duration: 45
//           }, {
//             name: 'Where were you',
//             duration: 45
//           }, {
//             name: 'Animals',
//             duration: 45
//           }
//         ]
//       }
//     ]
//   }
// }

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
    return acc += Math.round(eachSong.duration_ms / 1000)
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
        <img alt="search"/>
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
        <img src={playlists.imageURL} style={{width: '60px'}} alt="Playlist display"/>
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
    let parsedQString = queryString.parse(window.location.search)
    let access_token = parsedQString.access_token
    if(!access_token)
      return
    // console.log(access_token)

    fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    }).then((res) => res.json()).then(data => this.setState({user: data.display_name}))

    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    }).then((res) => res.json())
      .then(data => {
        let promisesArray = data.items.map(Pl => {
          let fetchArray = fetch(Pl.tracks.href, {
          headers: { 'Authorization': 'Bearer ' + access_token}
          })
          let responseArray = fetchArray.then(res => res.json())

          return responseArray
        })

        let allPromisesResponse = Promise.all(promisesArray).then(playlistTracksArray => {
          console.log(playlistTracksArray)
          playlistTracksArray.forEach((tracksArray, index) => {
            data.items[index].songs = tracksArray.items.map(item => item.track)
          })
          return data
        })
        return allPromisesResponse
      }).then(data => this.setState({playlists: data.items.map(item => {
        console.log(item.songs)
          return {
            name: item.name, 
            songs: item.songs.slice(0, 3), 
            imageURL: item.images.length > 0 ? item.images[0].url : logo}
        }
    )}))
    // setTimeout(() =>{
    //   this.setState({
    //     serverData
    //   })
    // }, 1000)
  }
  render() {
    let playlistsFinal = this.state.user && this.state.playlists ? this.state.playlists.filter(pl => 
      pl.name.toLowerCase().includes(this.state.filterString.toLowerCase())) : []
    return (
      <div className="App">
        {
          // Render the div element only if the serverData.user exists
          this.state.user ?
          <div>
            <h1>{this.state.user}'s Playlists</h1>
            <PlCounter playlists={playlistsFinal}/>
            <PlLength playlists={playlistsFinal}/>
            <Filter onTextChange={text => this.setState({filterString: text})}/>
            {
              playlistsFinal.map(pl =>
                <Playlist playlists={pl}/>
              )
            }
          </div> : <button onClick={() => window.location = window.location.href.includes('localhost') ? 'http://localhost:8888/login' : 'https://playlist-app-backend.herokuapp.com/login'} style={{margin: '30px', 'fontSize': '2em', padding: '30px'}}>Click here to sign in</button>
          // Else, render the h1 with loading text
        }
      </div>
    );
  }
}

export default App;
