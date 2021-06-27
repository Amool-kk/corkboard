import React, { useReducer, createContext, useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import './App.css'
import Navbar from './component/Navbar'
import Home from './component/Home'
import Login from './component/Login'
import Registration from './component/Registration'
import About from './component/About';
import Logout from './component/Logout';
import Board from './component/Board'
import ScaleLoader from 'react-spinners'


import { initialState, reducer } from '../src/useReducer'

//contextAPI
export const UserContext = createContext();

const Rounting = () => {

  const [loading, setLoading] = useState(false)

  window.addEventListener("load", () => {
    console.log("loading")
    setLoading(true)
  })

  return (
    <Switch>
      {/* <ScaleLoader color="#e9967a" loading={loading} size={100} /> */}
      <Route exact path="/">
        <Home />
      </Route>

      <Route exact path="/about">
        <About />
      </Route>

      <Route exact path="/board/:name" component={Board} />

      <Route exact path="/login">
        <Login />
      </Route>

      <Route exact path="/registration">
        <Registration />
      </Route>

      <Route exact path="/logout">
        <Logout />
      </Route>
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <>
      <div className="App" id="app">
        <UserContext.Provider value={{ state, dispatch }}>

          <Navbar></Navbar>
          <Rounting></Rounting>

        </UserContext.Provider>
      </div>
    </>
  );
}

export default App;
