var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var path = require('path');
var fs = require('fs');
var cors = require('cors');

var logger = require('morgan');

//cors middleware
app.use(cors());

//bodyParser and cookies middleware
app.use(bodyParser.json({
    limit: '10mb',
    extended: true
}));

app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: true
}));

app.use(cookieParser());

//set public folder as static
app.use(express.static(path.resolve(__dirname, './../public')));

//User and Ticket Model
var userModel = require('./app/models/User');
var ticketModel = require('./app/models/Ticket');

//controller files
var Routes = require('./app/controllers/routes');
app.use('/users', Routes);

//Ticket files
var ticketRoute = require('./app/controllers/ticket');
app.use('/tickets', ticketRoute);

//Set port to 3000
var port = 3000;

//morgan middleware
app.use(logger('dev'));

//Data Base Connection
var dbPath = "mongodb://localhost/HelpDesk";
mongoose.connect(dbPath);
mongoose.connection.once('open', function () {
    console.log("Database Connection Established Successfully...");
});

//handling 404 error.
app.use(function (req, res, next) {
    res.status(404);
    // respond with json
    if (req.accepts('json')) {
        res.send({
            error: 'Not found'
        });
        return;
    }
    res.send('Not found');
});

//Listening on port 3000
app.listen(port, function () {
    console.log("App listening on port:" + port);
});
