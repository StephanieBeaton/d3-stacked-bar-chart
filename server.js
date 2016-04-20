'use strict';
var express = require('express');
// var mongoose = require('mongoose');
// var notesRoutes = require('./routes/notes_routes');

// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/notesapp_development');

var app = express();
app.use(express.static(__dirname + '/app'));

var router = express.Router();

// notesRoutes(router);

app.use('/api/v1', router);

app.listen(process.env.PORT || 3000, function() {
  console.log('server listening on port ' + (process.env.PORT || 3000));
});
