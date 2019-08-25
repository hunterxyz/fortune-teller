'use strict';

var express = require('express');
var path = require('path');

var app = express();
app.use(express.static(path.join(__dirname, '../public')));


app.listen(8000, function() {
    console.log('Server started on port ' + 8000);
});


