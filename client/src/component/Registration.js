import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'


const Registration = () => {
    const history = useHistory()
    const [user, setUser] = useState({
        username: "", email: "", password: "", cpassword: ""
    });
    let name, value;
    const handleInputs = (e) => {
        name = e.target.name;
        value = e.target.value;

        setUser({ ...user, [name]: value })
    }

    const submit = async (e) => {
        e.preventDefault()

        const { username, email, password, cpassword } = user;

        const res = await fetch('http://localhost:5000/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username, email, password, cpassword
            })
        })

        const data = await res.json()

        if (res.status === 422 || !data) {
            window.alert("Invalid Registratrion")
        } else {
            window.alert("Registration Successfull");

            history.push("/login")
        }
    }

    return (
        <>
            
                <div className="cont">
                    <h1 className="h1">Registration</h1>
                    <form method="POST" className="registerform">
                        <div className="inputcont">
                            <input type="text" name="username" autoComplete="off"
                                value={user.username} onChange={handleInputs}
                                placeholder="Username" />
                            {/* <label>Username</label> */}
                        </div>
                        <div className="inputcont">
                            <input type="email" name="email" autoComplete="off"
                                value={user.email} onChange={handleInputs}
                                placeholder="Email" />
                            {/* <label>Email</label> */}
                        </div>
                        <div className="inputcont">
                            <input type="password" name="password" autoComplete="off"
                                value={user.password} onChange={handleInputs}
                                placeholder="Password" />
                            {/* <label>Password</label> */}
                        </div>
                        <div className="inputcont" src="../../../server/router/rounter.js">
                            <input type="password" name="cpassword" autoComplete="off"
                                value={user.cpassword} onChange={handleInputs}
                                placeholder="Confirm Password" />
                            {/* <label>Confirm Password</label> */}
                        </div>
                        <div className="submit">
                            <button type="button" className="btn btn-outline-secondary" onClick={submit}>Register</button>
                        </div>
                    </form>

                </div>
               
            
        </>
    )

}

export default Registration