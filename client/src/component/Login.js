import React,{useState, useContext} from 'react';
import {useHistory} from "react-router-dom";

import {UserContext} from "../App"

const Login = () => {

    const {state,dispatch} = useContext(UserContext)

    const [email,setEmail] = useState('');
    const [password,setPass] = useState('');
    const history = useHistory()

    const loginUser = async (e) =>{
        e.preventDefault()

        const res = await fetch('http://localhost:5000/logins',{
            method : "POST",
            headers:{
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                email,password
            })
        })

        const data = await res.json()

        if (res.status === 400 || !data) {
            window.alert("Invalid Credentials")
        }else{
            dispatch({
                type: 'USER',
                payload:true
            })
            window.alert("Login Successfull");

            history.push('/')
        }
    }

    return (
        <>
            <div className="cont">
                <h1 className="right">Login</h1>
                <form className="loginform" method="POST">
                    <div className="img"></div>
                    <div>
                        <div className="inputcont">
                            <input type="email" name="email" autoComplete="off" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        </div>
                        <div className="inputcont">
                            <input type="password" name="password" autoComplete="off" placeholder="Password" value={password} onChange={(e)=>setPass(e.target.value)}/>
                        </div>
                        <div className="submit">
                            <button type="button" className="btn btn-outline-secondary" onClick={loginUser}>Login</button>
                        </div>
                    </div>

                </form>
                
            </div>
        </>
    )
}

export default Login