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
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CommentOutlinedIcon from '@material-ui/icons/CommentOutlined';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

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
    const [commentData, setCommentData] = useState([]);
    const [todoListData, setToDoData] = useState([]);
    const [commentcheckId, setCheckId] = useState("");
    const [moveData, setMoveData] = useState([]);

    const [username, setUsername] = useState("");

    const [discriptionData, setDiscription] = useState({
        listtitle: "", id: "", cardname: "", discription: ""
    });

    const [checkListTitle, setcheckListTitle] = useState({
        cardId: "", checklistTitle: ""
    })

    const [todoMenuData, setToDoMenu] = useState({
        cardId: "", menu: "", todoid: ""
    })

    const [Discription, setDclass] = useState("cardDiscription hide");

    const [comments, setComment] = useState({
        cardname: "", listtitle: "", cardId: "", comment: "", discription: ""
    });

    const [moveSend, setMoveSend] = useState({
        sourceCard: "",destinationList: "", destinationPosition: "", sourceList: "", listIndex: "",cardIndex: ""
    })

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
                    // setListData(fullData.sData[i].listTitles)
                    localStorage["listData"] = JSON.stringify(fullData.sData[i].listTitles)
                    const lc = JSON.parse(localStorage["listData"])
                    // console.log(fullData.sData[i])
                    const t = fullData.sData[i]
                    setListData(lc)
                    // console.log(fullData.sData[i].comments)
                    setCommentData(fullData.sData[i].comments)
                    setToDoData(fullData.sData[i].toDoList)
                    // a.push(fullData.sData[i].listTitles)
                    // setCommentData(fullData.sData[i])
                    // console.log(username)
                    setUsername(fullData.username)
                } else {
                    // console.log("!ok")
                }
            }

            // for horizontal scrolling
            const slider = document.querySelector('.mainconts');
            let isDown = false;
            let startX;
            let scrollLeft;

            slider.addEventListener('mousedown', (e) => {
                isDown = true;
                slider.classList.add('active');
                startX = e.pageX - slider.offsetLeft;
                scrollLeft = slider.scrollLeft;
            });
            slider.addEventListener('mouseleave', () => {
                isDown = false;
                slider.classList.remove('active');
            });
            slider.addEventListener('mouseup', () => {
                isDown = false;
                slider.classList.remove('active');
            });
            slider.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - slider.offsetLeft;
                const walk = (x - startX) * 2; //scroll-fast
                slider.scrollLeft = scrollLeft - walk;
                // console.log(walk);
            });
            // end of horizontal scrolling



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
                // document.querySelector('.addListform').classList.add('hide');
                // document.querySelector('#addList').classList.remove('hide');
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

        if (res.status === 422 || !result) {
            window.alert("Invalid Details")
        } else {
            console.log(document.querySelector('.addcardform input'), document.querySelector('.addcardform input').value)
            document.querySelectorAll('.addcardform input').forEach(element => element.value = '')
            console.log(document.querySelector('.addcardform input'), document.querySelector('.addcardform input').value)
        }

    }

    const saveDiscription = async (e) => {
        e.preventDefault()

        const { cardname, discription, listtitle, Id } = discriptionData
        console.log(discriptionData)

        const res = await fetch('http://localhost:5000/add-discription', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                cardname, discription, listtitle, Id
            })
        })
        const result = await res.json()

        console.log(result)
        if (res.status === 422 || !result) {
            window.alert("Invalid Details")
        } else {
            // window.location.reload()
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
        setDclass("cardDiscription")
        // console.log(listData[i].cards[j]._id)
        // console.log(listData[i].listtitle, listData[i].cards[j].cardname)
        document.querySelector('.cardName b').innerHTML = listData[i].cards[j].cardname
        document.querySelector('.cardName span').innerHTML = listData[i].listtitle
        setDiscription({ ...discriptionData, ["cardname"]: listData[i].cards[j].cardname, ["listtitle"]: listData[i].listtitle, ["Id"]: data.Id })
        document.querySelector('.disInput').innerHTML = listData[i].cards[j].discription
        setComment({ ...comments, ["cardname"]: listData[i].cards[j].cardname, ["listtitle"]: listData[i].listtitle, ["cardId"]: listData[i].cards[j]._id })
        // console.log(discriptionData)
        // setCommentData([ ...comments,listData[i].cards[j]._id])
        setCheckId(listData[i].cards[j]._id)
        setcheckListTitle({ ...checkListTitle, ["cardId"]: listData[i].cards[j]._id })
        // console.log(commentData, listData[i].cards[j]._id, commentcheckId)
        console.log(listData, i, j)
        setMoveSend({...moveSend, ["listIndex"]:i,["cardIndex"]: j, ["sourceList"]: listData[i]._id,["sourceCard"]: listData[i].cards[j]._id})
    }



    const deleteCard = async (e) => {
        e.preventDefault()
        const listvalue = document.querySelector('.cardName span').innerHTML
        const cardvalue = document.querySelector('.cardName b').innerHTML
        const details = { "listtitle": listvalue, "cardname": cardvalue }
        console.log(details.listtitle, details.cardname)
        const { listtitle, cardname } = details

        const res = await fetch('http://localhost:5000/delete-card', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                listtitle,
                cardname
            })
        })
        const result = await res.json()

        if (res.status === 422 || !result) {
            window.alert("Invalid Details")
        } else {
            setDclass("cardDiscription hide")
        }
    }

    const listmenu = (i, e) => {
        console.log(i, e.clientX, e.clientY)
        document.querySelector('.listmencont').classList.toggle('hide')
        document.querySelector('.listmencont').style.left = `${e.clientX + 6}px`;
        document.querySelector('.listmencont').style.top = `${e.clientY}px`;
        document.querySelector('.deletelist').value = i;
        console.log(document.querySelector('.deletelist').value, document.querySelector('.deletelist'))
    }

    const deletelist = async (e) => {
        console.log(document.querySelector('.deletelist').value, document.querySelector('.deletelist'))
        const i = document.querySelector('.deletelist').value
        const listvalue = listData[i].listtitle;
        const id = listData[i]._id
        const details = { "listtitle": listvalue, "Id": id }
        const { listtitle, Id } = details;

        const res = await fetch('http://localhost:5000/delete-list', {
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

        if (res.status === 422 || !result) {
            window.alert("Invalid Details")
        } else {
            document.querySelector('.listmencont').classList.add('hide')
        }
    }

    const deleteallcards = async (e) => {
        console.log(document.querySelector('.deletelist').value, document.querySelector('.deletelist'))
        const i = document.querySelector('.deletelist').value
        const listvalue = listData[i].listtitle;
        const id = listData[i]._id
        const details = { "listtitle": listvalue, "Id": id }
        const { listtitle, Id } = details;

        const res = await fetch('http://localhost:5000/delete-all-cards-of-list', {
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

        if (res.status === 422 || !result) {
            window.alert("Invalid Details")
        } else {
            document.querySelector('.listmencont').classList.add('hide')
        }
    }

    const checklistbutton = () => {
        console.log("Checklist")
    }

    const deleteComment = async (k) => {
        console.log(k, commentData[k])
        const details = { "cardId": commentData[k].cardid, "comment": commentData[k].comment, "Date": commentData[k].date }

        const { cardId, comment, Date } = details

        const res = await fetch('http://localhost:5000/delete-comment', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                cardId, comment, Date
            })
        })

        const result = await res.json()

        if (res.status === 422 || !result) {
            window.alert("Invalid Details")
        } else {
            console.log("delete the comment")
        }
    }

    const addComment = async () => {
        console.log("it ok")

        const { listtitle, cardname, comment, cardId, discription } = comments

        const res = await fetch('http://localhost:5000/add-comment', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                listtitle, cardname, comment, cardId, discription
            })
        })
        const result = await res.json()

        if (res.status === 422 || !result) {
            window.alert("Invalid Details")
        } else {
            document.querySelector('.commentinput').value = ""
            console.log(result, result.username)
            setUsername(result.username)
        }
    }

    const addchecklist = async () => {
        console.log("it", checkListTitle)

        const { cardId, checklistTitle } = checkListTitle

        const res = await fetch('http://localhost:5000/add-toDoList', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                cardId, checklistTitle
            })
        })

        const result = await res.json()

        if (res.status === 422 || !result) {
            window.alert("Invalid Details")
        } else {
            document.querySelector('.titileinput').value = ""
            console.log(result)
        }

    }

    const deleteToDoList = async (i) => {
        console.log("it", i, todoListData[i].title, todoListData[i].cardid)

        const details = { "checklistTitle": todoListData[i].title, "cardId": todoListData[i].cardid }

        const { cardId, checklistTitle } = details

        const res = await fetch('http://localhost:5000/delete-toDoList', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                cardId, checklistTitle
            })
        })

        const result = await res.json()

        if (res.status === 422 || !result) {
            window.alert("Invalid Details")
        } else {
            console.log(result)
        }
    }


    const openadditems = (i) => {
        // console.log(document.querySelector(`.buttonforadd`+`${i}`),i,document.querySelector(`.checklistadd`+`${i}`))
        document.querySelector(`.buttonforadd` + `${i}`).classList.add('hide')
        document.querySelector(`.checklistadd` + `${i}`).classList.remove('hide')
    }

    const closeadditems = (i) => {
        document.querySelector(`.buttonforadd` + `${i}`).classList.remove('hide')
        document.querySelector(`.checklistadd` + `${i}`).classList.add('hide')
    }

    const addToDoMenu = async (i) => {
        console.log(todoMenuData)

        const { cardId, menu, todoid } = todoMenuData

        const res = await fetch('http://localhost:5000/add-to-do-menu', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                cardId, menu, todoid
            })
        })

        const result = await res.json()
        if (res.status === 422 || !result) {
            window.alert("Invalid Details")
        } else {
            console.log(result)
            document.querySelector(`.checklistadd` + `${i} input`).value = ""
        }
    }

    const checkbox = async (e) => {

        if (e.target.checked === true) {
            console.log(e.target.name, e.target.checked, e.target.parentNode.children[1].innerHTML)
            let details = { "todoid": e.target.name, "menu": e.target.parentNode.children[1].innerHTML, "value": e.target.checked }

            const { value, menu, todoid } = details

            const res = await fetch('http://localhost:5000/set-value', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    value, todoid, menu
                })
            })
            const result = await res.json()
            if (res.status === 422 || !result) {
                window.alert("Invalid Details")
            } else {
                console.log(result)
                if (value == true) {
                    console.log("changed")
                    let html = `<del>${e.target.parentNode.children[1].innerHTML}</del>`
                    e.target.parentNode.children[1].innerHTML = html
                } else {
                    console.log("not changed")
                    e.target.parentNode.children[1].innerHTML = menu
                }
            }
        } else {
            console.log(e.target.name, e.target.checked, e.target.parentNode.children[1].children[0].innerHTML)
            let details = { "todoid": e.target.name, "menu": e.target.parentNode.children[1].children[0].innerHTML, "value": e.target.checked }

            const { value, menu, todoid } = details

            const res = await fetch('http://localhost:5000/set-value', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    value, todoid, menu
                })
            })
            const result = await res.json()
            if (res.status === 422 || !result) {
                window.alert("Invalid Details")
            } else {
                console.log(result)
                if (value == true) {
                    console.log("changed")
                    let html = `<del>${e.target.parentNode.children[1].innerHTML}</del>`
                    e.target.parentNode.children[1].innerHTML = html
                } else {
                    console.log("not changed")
                    e.target.parentNode.children[1].innerHTML = menu
                }
            }
        }

        // const details = { "todoid": e.target.name, "menu": e.target.parentNode.children[1].innerHTML, "value": e.target.checked }


    }

    const movecards = async () => {
        console.log(document.querySelector('.whichlist').value)
        console.log(document.querySelector('.whichposition').value)
       
        const {destinationPosition,destinationList,sourceList,sourceCard,listIndex,cardIndex} = moveSend;

        const res = await fetch('http://localhost:5000/move-cards',{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                destinationList,destinationPosition,sourceList,sourceCard,listIndex,cardIndex
            })
        })

        const result = await res.json()

        if (res.status === 422 || !result) {
            window.alert("Invalid Details")
        }else{
            document.querySelector('.moveoption').classList.add('hide')
        }
    }

    return (
        <>
            <div className="listmencont hide">
                <div className="head">List actions <p> <CloseIcon onClick={() => { document.querySelector('.listmencont').classList.add('hide') }} className="close closem" style={{ padding: '2px' }} /> </p></div>
                <ul>
                    <li className="delelteallcardlist" onClick={deleteallcards}>Delete all cards in this list</li>
                    <li className="deletelist" onClick={deletelist} >Delete This List</li>
                </ul>
            </div>
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
                                                <h5>{info.listtitle} <MoreHorizIcon className="listmenu" onClick={(e) => listmenu(i, e)} /></h5>
                                            </div>
                                        </div>
                                        {info.cards.map((card, j) => (
                                            <div className="items" key={j}>
                                                <div className="cards" onClick={() => openCard(i, j)}>
                                                    <p>{card.cardname}</p>
                                                </div>
                                            </div>
                                        ))}
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


            {/* ************************************************************************ */}


            <div className={Discription}>
                <div className="discriptioncont">

                    <div className="closeDis closebutton" onClick={() => { setDclass("cardDiscription hide") }}><CloseIcon /></div>

                    <div className="cardName">
                        <CardMembershipIcon /> <b>card name</b>
                        <p>in list <span className="inlist">list name</span> </p>
                    </div>


                    <div className="mainchecklistcont">
                        {todoListData.map((info, i) => {
                            if (info.cardid === commentcheckId)
                                return <div className="checklistcont" style={{ margin: '10px 0px' }} key={i} >
                                    <div className="checklisthead">
                                        <span className="headicon"><CheckBoxIcon /></span>
                                        <span> <b>{info.title}</b></span>
                                        <span className="checklistdelete" onClick={() => deleteToDoList(i)}>Delete</span>
                                    </div>
                                    <div className="checklistmeter">
                                        <p>0%</p><span></span>
                                    </div>
                                    <div className="showmenu" >
                                        {info.menus.map((item, j) => {
                                            if (item.todoid === info._id && item.done === true) {
                                                return <ul key={j} style={{ listStyle: "none" }} >
                                                    <li onClick={(e) => checkbox(e)}><input style={{ cursor: 'pointer' }} checked={item.done} name={item.todoid} type="checkbox" value={item.done} style={{ marginRight: '10px' }} />
                                                        <del><span> {item.menu}</span></del>  </li>
                                                </ul>
                                            } if (item.todoid === info._id && item.done === false) {
                                                return <ul key={j} style={{ listStyle: "none" }} >
                                                    <li onClick={(e) => checkbox(e)}><input style={{ cursor: 'pointer' }} checked={item.done} name={item.todoid} type="checkbox" value={item.done} style={{ marginRight: '10px' }} />
                                                        <span> {item.menu} </span> </li>
                                                </ul>
                                            }
                                        }
                                        )}
                                    </div>
                                    <form action="post" className={'checklistadd hide checklistadd' + `${i}`}>
                                        <input type="text" name="menu" className="checklistinput" placeholder="Add an item" onChange={(e) => setToDoMenu({ ...todoMenuData, [e.target.name]: e.target.value, "cardId": info.cardid, "todoid": info._id })} />
                                        <div style={{ display: 'flex' }}>
                                            <div className="disbutton itemaddbutton" onClick={() => addToDoMenu(i)} ><b>Add</b></div>
                                            <span onClick={() => { closeadditems(i) }} style={{ marginTop: '15px', cursor: 'pointer' }}><CloseIcon /></span>
                                        </div>
                                    </form>

                                    <div className={`buttonforadd` + `${i}`} id="buttonforadd" onClick={() => openadditems(i)} >Add an item</div>
                                </div>

                        })}
                    </div>



                    <div className="des" style={{ marginTop: "18px" }}>
                        <h6><ArtTrackIcon /><b style={{ marginLeft: '14px' }}>Description</b></h6>
                        <textarea name="discription" type="text" placeholder="Add a more detailed discription..." className="disInput" rows="4 " cols="40" onChange={(e) => { setDiscription({ ...discriptionData, [e.target.name]: e.target.value }); setComment({ ...comments, [e.target.name]: e.target.value }) }}></textarea>
                        <div className="disbutton" onClick={saveDiscription}><b>Save</b></div>
                    </div>



                    <div className="commentsection">
                        <div className="commentfrom">
                            <h6 className="commenthead"> <CommentOutlinedIcon /> <span><b>Comments</b> </span></h6>
                            <input type="text" name="comment" className="commentinput" placeholder="Add an item" onChange={(e) => setComment({ ...comments, [e.target.name]: e.target.value })} />
                            <div className="disbutton itemaddbutton commentbutton" onClick={addComment} ><b>Add</b></div>
                        </div>
                        <div className="commentcont">

                            {commentData.map((comments, k) => {
                                if (comments.cardid === commentcheckId)
                                    return < div key={k} >
                                        <div className="whocomment"> <span className="username"><b>{username}</b> </span> <span className="commenttime">{comments.date}</span></div>
                                        <div className="commentcard">{comments.comment}</div>
                                        <span className="commentDelete" onClick={() => deleteComment(k)} >Delete</span>
                                    </div>
                            })}
                        </div>
                    </div>



                    <div className="deleteCard">
                        <div className="delbutton" onClick={deleteCard}><b>Delete This Card</b></div>
                    </div>

                    {/* for move option in cards */}
                    <div className="moveoptioncont" onClick={() => { document.querySelector('.moveoption').classList.remove('hide'); console.log(moveData) }} ><span><ArrowRightAltIcon /></span>Move </div>

                    <div className="moveoption hide">
                        <div className="moveoptionhead">
                            <p>Move Card <span onClick={() => { document.querySelector('.moveoption').classList.add('hide') }}><CloseIcon /></span></p>
                        </div>
                        <hr style={{ margin: '2px' }} />
                        <div className="moveoptionbody">
                            <p><b>SELECT DESTINATION</b></p>

                            <div className="moveoptionlist">
                                <span>List</span>
                                <select className="whichlist" onClick={() => {
                                    const ID = document.querySelector('.whichlist').value
                                    for (let i = 0; i < listData.length; i++) {
                                        const element = listData[i];
                                        let a = [];
                                        if (element._id == ID) {
                                            for (let j = 0; j <= element.cards.length; j++) {
                                                if (j < element.cards.length) {
                                                    // console.log(element.cards[j], "if conditon")
                                                    a.push(element.cards[j])
                                                } else {
                                                    // console.log({}, "else condition")
                                                    a.push({})
                                                }
                                            }
                                            // console.log(a, "value of array a")
                                            setMoveData(a)
                                        }
                                    }
                                }}>
                                    {listData.map((info, i) => {
                                        return <>
                                            <option key={i} value={info._id}>{info.listtitle}</option>
                                        </>
                                    })}
                                </select>
                            </div>
                            <div className="moveoptionindex">
                                <span>Position</span>
                                <select className="whichposition" onClick={() =>{ setMoveSend({...moveSend,["destinationPosition"]: document.querySelector('.whichposition').value,["destinationList"]:document.querySelector('.whichlist').value})}}>
                                    {moveData.map((info, i) => {
                                        console.log(info)
                                        return <>
                                            <option key={i} value={[i]}>{i + 1}</option>
                                        </>
                                    })}
                                </select>
                            </div>


                            <div className="disbutton" onClick={movecards} style={{ marginLeft: '0px' }}>Move</div>
                        </div>
                    </div>

                    {/* for checklist menu in cards */}
                    <div className="checklistbutton" onClick={() => { document.querySelector('.checklisttitilecont').classList.remove('hide') }}> <span><CheckBoxIcon /></span> Checklist </div>

                    <div className="checklisttitilecont hide">
                        <div className="titleinputhead">
                            <p>Add Checklist <span onClick={() => { document.querySelector('.checklisttitilecont').classList.add('hide') }}><CloseIcon /></span></p>
                        </div>
                        <hr style={{ margin: '2px' }} />
                        <div className="titleinputcont">
                            <p><b>Title</b></p>
                            <input type="text" name="checklistTitle" className="titileinput" onChange={(e) => setcheckListTitle({ ...checkListTitle, [e.target.name]: e.target.value })} />
                            <div className="disbutton" style={{ marginLeft: '0px' }} onClick={addchecklist} >Add</div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Board