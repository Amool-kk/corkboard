import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom'
import '../css/board.scss'
import LockIcon from '@material-ui/icons/Lock';
import PublicIcon from '@material-ui/icons/Public';
import PeopleIcon from '@material-ui/icons/People';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import CardMembershipIcon from '@material-ui/icons/CardMembership';
import ArtTrackIcon from '@material-ui/icons/ArtTrack';

const container_styles = {
    position: 'fixed',
    top: 58,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    border: '1px solid black'
}

const Board = (props) => {
    const history = useHistory()
    const { name } = useParams()
    const data = props.location.state

    const [listData, setListData] = useState([]);
    const [cardData, setCardData] = useState([]);

    const [Discription, setDclass] = useState("cardDiscription hide");

    const [list, setList] = useState({
        listtitle: "", id: "",
    })
    const [card, setCard] = useState({
        listtitle: "", id: "", cardname: ""
    });

    useEffect(async () => {
        try {
            const res = await fetch('http://localhost:5000/get-board', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            const fullData = await res.json()
            console.log(fullData)
            // console.log(fullData.sData.length)


            for (let i = 0; i < fullData.sData.length; i++) {
                if (fullData.sData[i].boardTitle === data.title) {
                    // console.log(fullData.sData[i].listTitles, i)
                    setListData(fullData.sData[i].listTitles)
                    // a.push(fullData.sData[i].listTitles)
                } else {
                    console.log("!ok")
                }
            }


            if (res.status !== 200) {
                const error = new Error(res.error)
                throw error
            }
        } catch (error) {
            console.log(error)
        }
    }, [])

    const addList = async (e) => {
        e.preventDefault()

        const { listtitle, Id } = list
        console.log(listtitle)

        if (listtitle === "") {
            window.alert("Invalid Details")
        } else {
            const res = await fetch('http://localhost:5000/create-list', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    listtitle, Id
                })
            })

            const result = await res.json()
            console.log(result)


            console.log(result.data, result.data.length)
            if (res.status === 422 || !result) {
                window.alert("Invalid Details")
            } else {
                document.querySelector('.addListform').classList.add('hide');
                document.querySelector('#addList').classList.remove('hide');
                document.querySelector('.addListform input').value = "";
                for (let i = 0; i < result.data.length; i++) {
                    if (result.data[i].boardTitle === data.title) {
                        // console.log(fullData.sData[i].listTitles, i)
                        setListData(result.data[i].listTitles)
                        // a.push(fullData.sData[i].listTitles)
                    } else {
                        console.log("!ok")
                    }
                }
                // window.location.reload();
            }
        }

    }

    const addCard = async (e) => {
        e.preventDefault();

        const { cardname, listtitle, Id } = card;

        console.log(cardname, listtitle[0], Id)

        const res = await fetch('http://localhost:5000/create-card', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                cardname, listtitle, Id
            })
        })

        const result = await res.json()
        console.log(result)
        for (let i = 0; i < listData.length; i++) {
            console.log(listData[i])
        }
        if (res.status === 422 || !result) {
            window.alert("Invalid Details")
        } else {
            // window.location.reload();
            for (let i = 0; i < result.data.length; i++) {
                if (result.data[i].boardTitle === data.title) {
                    // console.log(fullData.sData[i].listTitles, i)
                    setListData(result.data[i].listTitles)
                    // a.push(fullData.sData[i].listTitles)
                } else {
                    console.log("!ok")
                }
            }
        }

    }


    document.body.style.overflow = "hidden"
    // document.querySelector('.nextcont').style.overflow = 'hidden'
    let value
    if (data.workspacetype === 'Private') {
        value = <LockIcon style={{ marginRight: "3px", width: '0.8em' }} />
    } if (data.workspacetype === 'Public') {
        value = <PublicIcon style={{ marginRight: "3px", width: '0.8em' }} />
    } if (data.workspacetype === 'WorkSpace') {
        value = <PeopleIcon style={{ marginRight: "3px", width: '0.8em' }} />
    }

    const showmenu = () => {
        console.log("it works")
    }
    // for listtitle 
    const openform = (e) => {
        document.querySelector('.addListform').classList.remove('hide');
        document.querySelector('#addList').classList.add('hide');
        console.log(listData.length, cardData)
        setList({ ...list, ["Id"]: data.Id })
    }
    const closeform = () => {
        document.querySelector('.addListform').classList.add('hide');
        document.querySelector('#addList').classList.remove('hide');
        console.log(list)
    }
    // for cards
    const openAddform = (index) => {
        document.querySelectorAll('.openbuttons')[index].classList.add('hide');
        document.querySelectorAll('.addcardform')[index].classList.remove('hide');
        setCard({ ...list, ["Id"]: data.Id })
    }
    const closeform2 = (index) => {
        document.querySelectorAll('.openbuttons')[index].classList.remove('hide');
        document.querySelectorAll('.addcardform')[index].classList.add('hide');
    }
    // open cards
    const openCard = (i, j) => {
        console.log('clicks')
        setDclass("cardDiscription")
        console.log(i, j)
        console.log(listData[i].listtitle, listData[i].cards[j].cardname)
        document.querySelector('.cardName b').innerHTML = listData[i].cards[j].cardname
        document.querySelector('.cardName span').innerHTML = listData[i].listtitle
    }


    return (
        <>
            
            <div className="boardcontainer" style={container_styles, { backgroundImage: `url('${data.imgsrc}')`, backgroundRepeat: 'no-repeat', backgroundSize: "cover", overflowY: "hidden" }} >
                <div className="nextcont" style={{ height: "94vh", overflowY: "hidden" }}>
                    <div className="boardNavbar">
                        <div className="navdetails">
                            <div className="boardname">{data.title}</div>
                        </div>
                        <div className="navdetails">
                            <div className="boardname">{value}{data.workspacetype}</div>
                        </div>
                        <div className="navdetails">
                            <div className="boardname">{data.workspace}</div>
                        </div>
                        <div className="navdetails button">
                            <div className="menubutton" onClick={showmenu}>Show Menu</div>
                        </div>
                    </div>
                    <div className="boardcont">
                        <div className="mainconts">
                            {listData.map((info, i) => (
                                <div className="child" key={i}>
                                    <div className="list">
                                        <div className="items">
                                            <div className="listtitle">
                                                <h5>{info.listtitle}</h5>
                                            </div>
                                        </div>
                                        {info.cards.map((card, j) => (
                                            <div className="items" key={j}>
                                                <div className="cards" onClick={() => openCard(i, j)}>
                                                    <p>{card.cardname}</p>
                                                </div>
                                            </div>))}
                                        <div className="items">
                                            <div className="openbutton openbuttons" onClick={() => openAddform(i)}><AddIcon /> <p>Add a card</p></div>
                                            <form className="addcardform hide">
                                                <input type="text" placeholder="Enter List Title..." onChange={(e) => setCard({ ...card, [e.target.name]: e.target.value, "listtitle": info.listtitle })} name="cardname" />
                                                <div>
                                                    <div className="addbutton" onClick={addCard}>Add Card</div>
                                                    <div className="closebutton" onClick={() => closeform2(i)}><CloseIcon /> </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            ))}


                            <div className="child">
                                <div className="openbutton" onClick={openform} id="addList"><AddIcon /> <p>Add another list</p></div>
                                <div className="list">
                                    <form method="POST" className="addListform hide">
                                        <input type="text" placeholder="Enter List Title..." onChange={(e) => setList({ ...list, [e.target.name]: e.target.value })} name="listtitle" />
                                        <div>
                                            <div className="addbutton" onClick={addList}>Add List</div>
                                            <div className="closebutton" onClick={closeform}><CloseIcon /> </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="menu">textr</div>
                    </div>
                </div>
            </div>
            <div className={Discription}>
                <div className="discriptioncont">
                    <div className="closeDis closebutton" onClick={() => setDclass("cardDiscription hide")}><CloseIcon /></div>
                    <div className="cardName">
                        <CardMembershipIcon /> <b>akldflka</b>
                        <p>in list <span className="inlist">fgsdf</span> </p>
                    </div>
                    <div className="des" style={{marginTop:"18px"}}>
                        <h6><ArtTrackIcon/><b style={{marginLeft:'14px'}}>Description</b></h6>
                        <input name="discription" cols="50" rows="5" placeholder="Add a more detailed description…" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Board