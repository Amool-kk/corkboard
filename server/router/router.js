const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const User = require('../models/userschema')
const addBoard = require('../models/boardschema');


const router = express.Router();

const getBoardData = async (email) => {
    const result = await addBoard.find({ id: email })
    return result
}


// for home page 
router.get('/', auth, async (req, res) => {
    console.log("on home page")
    const boardData = await getBoardData(req.user.email)
    res.status(200).send({ user: req.user, bData: boardData });

})

router.get('/get-board', auth, async (req, res) => {
    console.log("this is get-board")
    const boardData = await getBoardData(req.user.email)
    res.status(200).send({ sData: boardData, "username": req.user.username });
})

// post request for create board
router.post('/create-board', auth, async (req, res) => {
    console.log("create-board")
    const { boardTitle, workspace, workspacetype, backgroundImageURL } = req.body
    console.log(req.body, req.user.email)

    try {
        const neBoard = new addBoard({
            id: req.user.email,
            boardTitle,
            workspace,
            workspacetype,
            backgroundImageURL
        })
        const result = await neBoard.save();
        res.status(200).json({ message: "Your board is Created" })

    } catch (err) {
        console.log(err, "in create-board")
        res.status(422).json({ error: err })
    }

})


// for create list in board
router.post('/create-list', auth, async (req, res) => {
    console.log("create-list", req.body)
    const { listtitle, Id } = req.body
    const whichBoard = await addBoard.findOne({ _id: Id })
    console.log(whichBoard)


    try {
        const updatelist = await addBoard.updateOne(
            { _id: Id },
            {
                $push: {
                    listTitles: [{
                        listtitle: listtitle,
                    }]
                }
            })

        if (listtitle == "") {
            res.status(422).json({ error: "Empty" })
        } else {
            const whichBoard = await addBoard.findOne({ _id: Id })
            console.log(whichBoard.listTitles)
            res.status(200).json({ message: "your list is Created", data: whichBoard })
        }
    } catch (err) {
        console.log(err, "in create-list")
        res.status(422).json({ error: err })
    }

})

// for delete list from board
router.post('/delete-list', auth, async (req, res) => {
    // console.log(req.body)
    const { listtitle, Id } = req.body
    const whichlist = await addBoard.find({ "listTitles._id": Id })
    // console.log(whichlist)

    try {
        const deletelist = await addBoard.updateOne(
            { "listTitles._id": Id, "listTitles.listtitle": listtitle },
            {
                $pull: {
                    listTitles: { _id: Id }
                }
            })

        res.status(200).json({ message: "you delete list" })

    } catch (error) {
        console.log(err, "in delete list")
        res.status(422).json({ error: err })
    }
})


// for cards in list 
router.post('/create-card', auth, async (req, res) => {
    console.log(req.body.listtitle[0], "this is create-card")
    const { cardname, listtitle, Id } = req.body
    const whichlist = await addBoard.find({ "listTitles.listtitle": listtitle })
    console.log(whichlist, "before")

    try {
        const updatecard = await addBoard.updateOne(
            { _id: Id, "listTitles.listtitle": listtitle },
            {
                $push: {
                    "listTitles.$.cards": { cardname: cardname, discription: "" }
                }
            }
        )

        console.log(whichlist, "after")
        res.status(200).json({ message: "your card created" })
    } catch (error) {
        console.log(error, "in create-card")
        res.status(422).json({ error: err })
    }
})


// detect the card
router.post('/delete-card', auth, async (req, res) => {
    console.log(req.body)
    const { listtitle, cardname } = req.body
    const whichcard = await addBoard.find({ "listTitles.cards.cardname": cardname })
    console.log(whichcard, "before save")

    try {
        const deletecard = await addBoard.updateOne(
            { "listTitles.cards.cardname": cardname },
            {
                $pull: {
                    "listTitles.$.cards": { cardname: cardname }
                }
            }
        )
        res.status(200).json({ message: "you delete card" })
    } catch (err) {
        console.log(err, "in delete-card")
        res.status(422).json({ error: err })
    }
})


// delete the cards from a list
router.post('/delete-all-cards-of-list', auth, async (req, res) => {
    console.log(req.body)
    const { listtitle, Id } = req.body

    try {
        const deletecard = await addBoard.updateMany(
            { "listTitles._id": Id, "listTitles.listtitle": listtitle },
            {
                $pull: {
                    "listTitles.$.cards": { carname: null }
                }
            }
        )
        res.status(200).json({ message: "you delete card" })
    } catch (err) {
        console.log(err, "in delete-card")
        res.status(422).json({ error: err })
    }
})


// for discription in cards
router.post('/add-discription', auth, async (req, res) => {
    console.log(req.body, "discription part")
    const { cardname, listtitle, Id, discription } = req.body

    const whichcard = await addBoard.find({ "listTitles.cards.cardname": cardname })
    console.log(whichcard, "before save")

    try {
        const adddiscription = await addBoard.updateOne(
            { _id: Id, "listTitles.cards.cardname": cardname },
            {
                $set: {
                    "listTitles.$.cards": { cardname: cardname, discription: discription }
                }
            }
        )
        const whichcard = await addBoard.find({ "listTitles.cards": { cardname: cardname } })
        console.log(whichcard, "after save")
        res.status(200).json({ message: "your discription is saved" })
    } catch (err) {
        console.log(err, "in add discription of cards")
        res.status(422).json({ error: err })
    }
})

// for commets in cards
router.post('/add-comment', auth, async (req, res) => {
    console.log(req.body)

    const { cardname, listtitle, comment, cardId, discription } = req.body

    const whichcard = await addBoard.find({ "listTitles.cards._id": cardId })
    console.log(whichcard)

    try {
        const addcomment = await addBoard.updateOne(
            { "listTitles.cards._id": cardId },
            {
                $push: {
                    comments: [{
                        cardid: cardId,
                        comment: comment
                    }]
                }
            })

        res.status(200).json({ message: "you commetend on card", "username": req.user.username })
    } catch (err) {
        console.log(err, "in add comment of cards")
        res.status(422).json({ error: err })
    }
})

// for delete the comment
router.post('/delete-comment', auth, async (req, res) => {
    console.log(req.body)

    const { comment, cardId, Date } = req.body;

    const whichcomment = await addBoard.find({ "comments.cardid": cardId })
    // console.log(whichcomment)

    try {
        const deleteComment = await addBoard.updateOne(
            { "comments.cardid": cardId },
            {
                $pull: {
                    comments: {
                        cardid: cardId,
                        comment: comment,
                        date: Date
                    }
                }
            })

        res.status(200).json({ message: "you delete the comment" })
    } catch (err) {
        console.log(err, "in delete comment of cards")
        res.status(422).json({ error: err })
    }
})

router.get('/logins', (req, res) => {
    console.log("wlecome on login page")
})

router.post('/add-toDoList', auth, async (req, res) => {

    console.log(req.body)
    const { cardId, checklistTitle } = req.body

    try {
        const addtodolist = await addBoard.updateOne(
            { "listTitles.cards._id": cardId },
            {
                $push: {
                    toDoList: [{
                        title: checklistTitle,
                        cardid: cardId,
                    }]
                }
            })

        res.status(200).json({ message: "you add the toDoList" })
    } catch (err) {
        console.log(err, "you add the toDoList")
        res.status(422).json({ error: err })
    }
})

router.post('/delete-toDoList', auth, async (req, res) => {
    // console.log(req.body)

    const { cardId, checklistTitle } = req.body

    try {
        const deleteToDoList = await addBoard.updateOne(
            { "listTitles.cards._id": cardId },
            {
                $pull: {
                    toDoList: {
                        title: checklistTitle,
                        cardid: cardId,
                    }
                }
            })

        res.status(200).json({ message: "you delete the toDoList" })
    } catch (err) {
        console.log(err, "you delete the toDoList")
        res.status(422).json({ error: err })
    }
})

router.post('/add-to-do-menu', auth, async (req, res) => {

    const { menu, cardId, todoid } = req.body

    try {
        const addtodomenu = await addBoard.updateOne(
            { "toDoList._id": todoid },
            {
                $push: {
                    // "listTitles.$.cards": { cardname: cardname, discription: "" }
                    "toDoList.$.menus": { menu: menu, done: false, todoid: todoid }
                }
            }
        )
        res.status(200).json({ message: "you add toDo menu" })
    } catch (err) {
        console.log(err, "you add toDo menu")
        res.status(422).json({ error: err })
    }

})
// router.post('/create-card', auth, async (req, res) => {
//     console.log(req.body.listtitle[0], "this is create-card")
//     const { cardname, listtitle, Id } = req.body
//     const whichlist = await addBoard.find({ "listTitles.listtitle": listtitle })
//     console.log(whichlist, "before")

//     try {
//         const updatecard = await addBoard.updateOne(
//             { _id: Id, "listTitles.listtitle": listtitle },
//             {
//                 $push: {
//                     "listTitles.$.cards": { cardname: cardname, discription: "" }
//                 }
//             }
//         )

//         console.log(whichlist, "after")
//         res.status(200).json({ message: "your card created" })
//     } catch (error) {
//         console.log(error, "in create-card")
//         res.status(422).json({ error: err })
//     }
// })


router.post('/set-value', auth, async (req, res) => {

    console.log(req.body)
    const { menu, todoid, value, menuID } = req.body

    const whichtolist = await addBoard.find({ "toDoList._id": todoid })
    console.log(whichtolist[0].toDoList[1])

    try {
        const setvalue = await addBoard.updateOne(
            {
                "toDoList._id": todoid,
                "toDoList.menus._id":menuID
            },
            {
                $set: {
                    "toDoList.$.menus":{ menu: menu, done: value, todoid: todoid}
                }
            }
        )
        res.status(200).json({ message: "you set value of menu" })
    } catch (err) {
        console.log(err, "you set value of menu")
        res.status(422).json({ error: err })
    }
})

// router.post('/add-discription', auth, async (req, res) => {
//     console.log(req.body, "discription part")
//     const { cardname, listtitle, Id, discription } = req.body

//     const whichcard = await addBoard.find({ "listTitles.cards.cardname": cardname })
//     console.log(whichcard, "before save")

//     try {
//         const adddiscription = await addBoard.updateOne(
//             { _id: Id, "listTitles.cards.cardname": cardname },
//             {
//                 $set: {
//                     "listTitles.$.cards": { cardname: cardname, discription: discription }
//                 }
//             }
//         )
//         const whichcard = await addBoard.find({ "listTitles.cards.cardname": cardname })
//         console.log(whichcard, "after save")
//         res.status(200).json({ message: "your discription is saved" })
//     } catch (err) {
//         console.log(err, "in add discription of cards")
//         res.status(422).json({ error: err })
//     }
// })

router.post('/move-cards', auth, async (req, res) => {
    console.log(req.body)

    const { destinationPosition, destinationList, sourceList, sourceCard, listIndex, cardIndex } = req.body

    const whichcard = await addBoard.find({ "listTitles.cards._id": sourceCard })
    // console.log(whichcard[0].listTitles[listIndex].cards[cardIndex])
    const copycard = whichcard[0].listTitles[listIndex].cards[cardIndex]
    console.log(copycard)

    try {
        const removecard = await addBoard.updateOne(
            { "listTitles.cards._id": sourceCard },
            {
                $pull: {
                    "listTitles.$.cards": { _id: sourceCard }
                }
            },
        )
        const movecard = await addBoard.updateOne(
            { "listTitles._id": destinationList },
            {
                $push: {
                    "listTitles.$.cards": copycard,
                    $position: destinationPosition
                },
            }
        )
        res.status(200).json({ message: "you move the card" })
    } catch (err) {
        console.log(err, "you move the card")
        res.status(422).json({ error: err })
    }

})

// try {
//     const updatecard = await addBoard.updateOne(
//         { _id: Id, "listTitles.listtitle": listtitle },
//         {
//             $push: {
//                 "listTitles.$.cards": { cardname: cardname, discription: "" }
//             }
//         }
//     )

//     console.log(whichlist, "after")
//     res.status(200).json({ message: "your card created" })
// } catch (error) {
//     console.log(error, "in create-card")
//     res.status(422).json({ error: err })
// }

// try {
//     const deletecard = await addBoard.updateOne(
//         { "listTitles.cards.cardname": cardname },
//         {
//             $pull: {
//                 "listTitles.$.cards": { cardname: cardname }
//             }
//         }
//     )
//     res.status(200).json({ message: "you delete card" })
// } catch (err) {
//     console.log(err, "in delete-card")
//     res.status(422).json({ error: err })
// }

router.post('/logins', async (req, res) => {
    try {
        // console.log(req.body)
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(422).json({ error: "Plz filled the fields" })
        }

        const userExist = await User.findOne({ email: email });

        console.log(userExist)

        const isMatch = await bcrypt.compare(password, userExist.password);

        const token = await userExist.genrateToken();

        res.cookie("jwt", token, {
            httpOnly: true
        })

        if (isMatch && email != "" && password != "") {
            const results = await userExist.save()
            res.status(200).json({ message: "Login Successfuly" })
        } else {
            console.log("nhi hua login")
            res.status(400).json({ error: "Not Login" })
        }

    } catch (error) {
        console.log(error)
    }

})

router.get('/register', (req, res) => {
    console.log("wlecome on register page")
})

router.post('/register', async (req, res) => {
    // console.log(req.body)
    const { username, email, password, cpassword } = req.body;

    if (!username || !email || !password || !cpassword) {
        return res.status(422).json({ error: "Plz filled the fields properly" });
    }

    try {
        const userExist = await User.findOne({ email: email })
        // console.log(userExist)

        if (userExist) {
            return res.status(422).json({ error: "Email already Exist" })
        } else if (password != cpassword) {
            return res.status(422).json({ error: "Both password are not match" })
        } else {
            const user = new User({ username, email, password, cpassword });

            await user.save()

            res.status(201).json({ message: "User Registered Successfuly" })
        }

    } catch (error) {
        console.log(error)
    }
})


// for logout

router.get('/logout', (req, res) => {
    console.log("logout hogya")
    res.clearCookie('jwt')
    res.status(200).send('user logout')
})




module.exports = router
