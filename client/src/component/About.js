import React from 'react';
import '../css/about.css';
import Footer from './Footer'

const About = () => {
    console.log(process.env.PUBLIC_URL + './img/hero.jpg')
    return (
        <>
            <div className="maincont">
                <section className="cont1">
                    <div className="container pt-7 pb-6 text-center text-md-left">
                        <div className="row align-items-center">
                            <div className="col-lg-5 offset-lg-1 order-2 hero-image">
                                <img src={process.env.PUBLIC_URL + '../img/hero2.svg'} alt="img" width="550" height="500" className="img-fluid" />
                            </div>
                            <div className="col-lg-7 bag">
                                <h1>CorkBoard helps teams move work forward.</h1>
                                <p>Collaborate, manage projects, and reach new productivity peaks. From high rises to the home office, the way your team works is unique—accomplish it all with CorkBoard.
                                </p>
                                <a href="/login" className="btn">Get Start</a>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="cont2">
                    <div className="container text-center">
                        <h1>It’s more than work. It’s a way of working together.</h1>
                        <p>Start with a Trello board, lists, and cards. Customize and expand with more features as your teamwork grows. Manage projects, organize tasks, and build team spirit—all in one place.</p>
                        <a href="/login" className="btn">Get Start</a>
                        <img src={process.env.PUBLIC_URL + '../img/work.svg'} alt="" />
                    </div>
                </section>
                <Footer></Footer>
            </div>
        </>
    )
}

export default About