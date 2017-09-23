var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Ticket schema
var ticketSchema = new Schema({
userId: {type: String, required: true},
name: {type: String, required: true},
email: {type: String,required: true},
mobileNumber: {type: Number,required: true},
ticketNumber: {type: String,index: true},
queryTitle: {type: String, required: true},
queryDetails: {type: String,required: true},
message: [{
    sender: String,
    queryText: String,
    createdAt: {
    type: Date,
    default: Date.now(),
    index: true
    }
        }],
ticketStatus: {type: String,default: "Open"},
createdAt: {type: Date,default: Date.now(),index: true},
updatedAt: {type: Date,default: Date.now(),index: true}
    
});


//Ticket schema model
mongoose.model('Ticket', ticketSchema);
