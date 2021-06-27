const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    id: String,
    boardTitle: String,
    workspace: String,
    workspacetype: String,
    backgroundImageURL: String,
    listTitles: [{
        listtitle: String,
        cards: [{
            cardname: String,
            discription:String,
        }]
    }],
    comments:[{
        comment: String,
        cardid: String,
        usernames: String,
        date: {
            type: Date,
            default: new Date
        }
    }],
    toDoList: [{
        title: String,
        cardid: String,
        menus: [{
            menu: String,
            todoid: String,
            done: Boolean
        }]
    }],
    boardMember: [{
        member_id: {
            type: String
        }
    }]
})

const addBoard = mongoose.model('addBoard', boardSchema);

module.exports = addBoard;