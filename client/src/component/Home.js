import React, { useEffect, useState } from 'react';
import { useHistory,Link } from 'react-router-dom';
import Footer from './Footer'
import Createboard from './CreateBoard'
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';
import AddIcon from '@material-ui/icons/Add';

const Home = () => {
    document.body.style.overflowY = "visible"
    const history = useHistory();

    const [gbData, getData] = useState([])

    const [isOpen, setIsOpen] = useState(false);

    const [value1, setValue1] = useState("tryer")
    const [value2, setValue2] = useState("Private")

    const [data, sendData] = useState({
        boardTitle: "", workspace: "", workspacetype: "", backgroundImageURL: ""
    })


    useEffect(() => {
        fetch('http://localhost:5000/', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json"
            },
            credentials: "include"
        }).then((res) => {
            history.push('/', { replace: true })
            res.json().then((data) => { getData(data.bData); })
            if (res.status !== 200) {
                const error = new Error(res.error)
                throw error;
            }
        }).catch((err) => {
            console.log(err)
            history.push('/login', { replace: true })
        })
    }, []);

   

    function choices(e) {
        const first = document.querySelector('.first');
        const second = document.querySelector('.second');
        console.log(gbData[0]._id)
        if (e.target.innerHTML === 'Board') {
            first.classList.remove('hide')
            second.classList.add('hide')
            e.target.classList.add('slected')
            document.querySelector('.templates').classList.remove('slected');
        }
        if (e.target.innerHTML === 'Templates') {
            first.classList.add('hide')
            second.classList.remove('hide')
            e.target.classList.add('slected')
            document.querySelector('.board').classList.remove('slected');
        }

    }


    function menu1(e) {
        document.querySelector('.options1').classList.toggle('hide')
    }
    function menu2(e) {
        document.querySelector('.options2').classList.toggle('hide')
    }

    function option1(e) {
        let names = "workspace"
        document.querySelector('.options1').classList.add('hide')

        document.querySelectorAll('.li1').forEach(element => {
            element.classList.remove('selected')
        });
        e.target.parentNode.classList.add('selected')
        setValue1(e.target.innerHTML)
        sendData({ ...data, [names]: e.target.innerHTML })
    }

    function option2(e) {
        let names = "workspacetype"
        console.log(names, e.target.innerHTML)
        document.querySelector('.options2').classList.add('hide')

        setValue2(e.target.innerHTML)
        document.querySelectorAll('.li2').forEach(element => {
            element.classList.remove('selected')
        });
        e.target.parentNode.classList.add('selected')
        sendData({ ...data, [names]: e.target.innerHTML })
    }

    const inputChange = (e) => {
        let names = e.target.name
        let value = e.target.value
        sendData({ ...data, [names]: value })
        if (e.target.value !== "") {
            document.querySelector(".cbutton p").style.opacity = 1
            document.querySelector(".cbutton").style.cursor = "pointer"
        } else {
            document.querySelector(".cbutton p").style.opacity = 0.3
            document.querySelector(".cbutton").style.cursor = "not-allowed"
        }
    }

    // for create new board
    const cBoard = async (e) => {
        e.preventDefault()
        // console.log(document.querySelector)
        const { boardTitle, workspace, workspacetype, backgroundImageURL } = data
        const res = await fetch('http://localhost:5000/create-board', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                boardTitle,
                workspace: value1,
                workspacetype: value2,
                backgroundImageURL
            })
        })

        const result = await res.json()
        console.log(result)
        if (res.status === 422 || !result) {
            window.alert("Invalid Details")
        } else {
            window.alert("done")
            setIsOpen(false)
            history.push({
                pathname: `./board/:${data.boardTitle}`,
                state: {id : data.id, title : data.boardTitle, imgsrc : data.backgroundImageURL, workspacetype: data.workspacetype, workspace: data.workspace, Id : data._id}
              })
        }
    }
    
    return (
        <>
            <div className="maincont home" >
                <div className="conts">
                    <div className="left">
                        <div className="board slected leftmenu" onClick={choices}>Board</div>
                        <div className="templates leftmenu" onClick={choices}>Templates</div>
                        <article className="WORKSPACE" onClick={choices}>
                            <div className="boxhead">WORKSPACE <span><AddIcon /></span></div>
                            <div className="workspacelist">

                            </div>
                        </article>
                    </div>
                    <div className="right">
                        <div className="first">
                            <div className="createBoard" onClick={async (e) => {
                                e.preventDefault();
                                let urls = 'https://source.unsplash.com/user/erondu/1600x900'
                                const res = await fetch(urls)
                                await sendData({ ...data, ["backgroundImageURL"]: res.url })
                                await setIsOpen(true);
                                // console.log(res.url,document.querySelector('.content'))
                                document.querySelector('.content').style.backgroundImage = `url('${res.url}')`
                            }}>Create new board</div>

                            <div className="viewBoard" style={{ height: '50px' }}>
                                {gbData.map((data, index) => (
                                    <Link to={{
                                        pathname: `./board/:${data.boardTitle}`,
                                        state: { key : index, id : data.id, title : data.boardTitle, imgsrc : data.backgroundImageURL, workspacetype: data.workspacetype, workspace: data.workspace,Id: data._id}
                                      }} key={index} >
                                        <div className="view"  >
                                            <img src={data.backgroundImageURL} title={data.boardTitle} value={data.id} />
                                            <h5>{data.boardTitle}</h5>
                                        </div>
                                    </Link>
                                ))}


                                {/* for createBoard button */}
                                <Createboard style={{ height: '50px', display: 'block' }}
                                    open={isOpen} close={(e) => { e.preventDefault(); setIsOpen(false); }}>
                                    <div className="modalcont">

                                        <div className="modalItems">
                                            <input type="text" name="boardTitle" placeholder="Add Board Title" onChange={inputChange} />
                                        </div>

                                        <div className="modalItems">
                                            <button onClick={menu1} value={value1} className="select">{value1} <ArrowDropDownOutlinedIcon /></button>

                                            <div name="workspace" className="options1 workspace hide options">
                                                <ul>
                                                    <li className="li1 selected" >
                                                        <div onClick={option1} value="tryer">tryer </div>
                                                    </li>
                                                    <li className="li1">
                                                        <div onClick={option1} value="second">second</div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="modalItems">
                                            <button onClick={menu2} name="workspacetype" value={value2} className="select">{value2} <ArrowDropDownOutlinedIcon /></button>

                                            <div className="options2 workspacetype hide options">
                                                <ul>
                                                    <li className="li2 selected">
                                                        <div onClick={option2} name="workspacetype" value="Private">Private</div>
                                                        <span>this</span>
                                                    </li>
                                                    <li className="li2">
                                                        <div onClick={option2} name="workspacetype" value="Public">Public</div>
                                                    </li>
                                                    <li className="li2">
                                                        <div onClick={option2} name="workspacetype" value="WorkSpace">WorkSpace</div>
                                                    </li>
                                                </ul>
                                            </div>

                                        </div>
                                        <div className="modalItems">
                                            {/* <button type="button" className="cbuttton">Create Board</button> */}
                                            <div className="cbutton" onClick={cBoard} ><p>Create Board</p></div>
                                        </div>
                                    </div>
                                </Createboard>

                                {/* for board open */}



                            </div>

                        </div>
                        <div className="second hide">Recently viewed</div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>
    )
}

export default Home