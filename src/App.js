import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// let defTextColor = '#fff'
let defTextColor = {color: '#fff'}
class Aggregate extends Component{

    render(){
      return(
        <div className="aggregate" style={{...defTextColor, width: '40%', display: 'inline-block'}}>
          <h2>Num Text</h2>
        </div>
      )
    }
}

class Filter extends Component{
  render(){
    return(
      <div style={defTextColor}>
        <img />
        <input type="text" />
        Filter
      </div>
    )
  }
}

class Playlist extends Component{
  render(){
    return(
      <div style={{...defTextColor, width: '20%', display: 'inline-block'}}>
        <img />
        <h3>Playlist Name</h3>
        <ul>
          <li>Song 1</li>
          <li>Song 2</li>
          <li>Song 3</li>
          <li>Song 4</li>
        </ul>
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Title</h1>
        <Aggregate />
        <Aggregate />
        <Filter />
        <Playlist />
        <Playlist />
        <Playlist />
        <Playlist />
      </div>
    );
  }
}

export default App;
