import { useState } from 'react';
// borren los assets y esos archivos

//import reactLogo from './assets/react.svg';
//import viteLogo from '/vite.svg';

import './App.css'
import Board from './Components/Board';


const App = () => {
  return (
    <div className="app">
      <h1>Checkers App</h1>
      <Board />
    </div>
  );
};

export default App
