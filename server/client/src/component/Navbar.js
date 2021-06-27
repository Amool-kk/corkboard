import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import SearchIcon from '@material-ui/icons/Search';
import { NavLink } from 'react-router-dom';

import { UserContext } from "../App"

const Navbar = () => {

    const { state, dispatch } = useContext(UserContext)

    const [clasR, clasRSet] = useState('nav-link link');
    const [clasL, clasLSet] = useState('nav-link link actives');
    const [clasA, clasASet] = useState('nav-link link');
    const [clasH, clasHSet] = useState('nav-link link');

    const clicks = (e) => {
        // console.log(window.location)
        // console.log(e.target.innerHTML)
        if (e.target.innerHTML === 'Registration') {
            clasRSet('nav-link link actives')
            clasLSet('nav-link link')

            clasASet('nav-link link')
            // console.log(e.target.className)
        } if (e.target.innerHTML === 'Login') {
            clasLSet('nav-link link actives')
            clasASet('nav-link link')
            clasRSet('nav-link link')
            // console.log(e.target.className)
        } if (e.target.innerHTML === 'About Us') {
            clasASet('nav-link link actives')
            clasRSet('nav-link link')
            clasLSet('nav-link link')
            clasHSet('nav-link link')
            // console.log(e.target.className)
        } if (e.target.innerHTML === 'Dashboard') {
            clasASet('nav-link link')
            clasRSet('nav-link link')
            clasLSet('nav-link link')
            clasHSet('nav-link link actives')
            // console.log(e.target.className)
        }
    }

    const RenderMenu = () => {
        if (state) {
            return (
                <>
                    <li className="nav-item">
                        <NavLink to="/" className={clasH} onClick={clicks}>Dashboard</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/about" className={clasA} onClick={clicks} >About Us</NavLink>
                    </li>
                    {/* <li className="nav-item">
                        <NavLink to="/login" name="login" className={clasL} onClick={clicks}>Login</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/registration" className={clasR} onClick={clicks} >Registration</NavLink>
                    </li> */}
                    <li className="nav-item">
                        <NavLink to="/logout" className="nav-link link" onClick={clicks} >LogOut</NavLink>
                    </li>
                </>
            )
        } else {
            return (
                <>
                    <li className="nav-item">
                        <NavLink to="/about" className={clasA} onClick={clicks} >About Us</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/login" name="login" className={clasL} onClick={clicks}>Login</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/registration" className={clasR} onClick={clicks} >Registration</NavLink>
                    </li>
                </>
            )
        }
    }

   

    return (
        <>
            <nav className="navbar navbar-expand-lg">
                <NavLink className="navbar-brand" to="/" >CorkBoard</NavLink>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    <span className="navbar-toggler-icon"></span>
                    <span className="navbar-toggler-icon"></span>
                </button>


                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <form className="form-inline my-2 my-lg-0">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item d-flex">
                                <div className="collapse fade" id="searchForm">
                                    <input id="search" type="search" className="form-control border-0 bg-light" placeholder="search" />
                                </div>
                                <NavLink className="nav-link ml-auto" to="#searchForm" data-target="#searchForm" data-toggle="collapse">
                                    <SearchIcon></SearchIcon>
                                </NavLink>
                            </li>
                        </ul>
                    </form>
                    <ul className="navbar-nav ml-auto">
                       <RenderMenu/>
                    </ul>

                </div>

            </nav>
        </>)
}

export default Navbar