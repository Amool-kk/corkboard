const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    id: String,
    boardTitle: String,
    workspace: String,
    workspacetype: String,
    backgroundImageURL: String,
    listTitles: [{
        listtitle: String,
        cards: [{cardname: String}]
    }],
    boardMember: [{
        member_id: {
            type: String
        }
    }]
})

const addBoard = mongoose.model('addBoard', boardSchema);

module.exports = addBoard;