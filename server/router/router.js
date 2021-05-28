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
    console.log(boardData)
})

router.get('/get-board', auth, async (req, res) => {
    console.log("this is get-board")
    const boardData = await getBoardData(req.user.email)
    res.status(200).send({ sData: boardData });
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



router.post('/create-list', auth, async (req, res) => {
    console.log("create-list", req.body)
    const { listtitle, Id } = req.body
    const whichBoard = await addBoard.findOne({_id: Id})
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
            const whichBoard = await addBoard.findOne({_id: Id})
            console.log(whichBoard.listTitles)
            res.status(200).json({ message: "your list is Created",data: whichBoard})
        }
    } catch (err) {
        console.log(err, "in create-list")
        res.status(422).json({ error: err })
    }

})

// for cards in list 
router.post('/create-card', auth, async (req, res) => {
    console.log(req.body.listtitle[0], "this is create-card")
    const { cardname, listtitle, Id } = req.body
    const whichlist = await addBoard.find({ "listTitles.listtitle" : listtitle })
    console.log(whichlist, "before")

    try {
        const updatecard = await addBoard.updateOne(
            { _id: Id ,"listTitles.listtitle" : listtitle},
            {
                $push: {
                   "listTitles.$.cards" : {cardname: cardname}
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

// $push: {
//     listTitles: [{
//         listtitle,
//         CARDNAME: {
//         cardName: [{
//             cardname
//         }]}
//     }]
// }

router.get('/logins', (req, res) => {
    console.log("wlecome on login page")
})

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
