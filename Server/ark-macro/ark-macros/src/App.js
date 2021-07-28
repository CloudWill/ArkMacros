import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Macro from './MacroSelectionForm'
import Drop from './SecondForm'

//https://stackoverflow.com/questions/33956201/how-to-import-and-export-components-using-react-es6-webpack

class App extends Component {
    render() {
        return (
            <Drop />
        );
    }
}

export default App;