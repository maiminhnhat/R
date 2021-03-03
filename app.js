const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
// call bodyparser
const bodyparser = require('body-parser');
// x-www-form-urlencoded
app.use(bodyparser.urlencoded({
    extended: false
}));
app.use(bodyparser.json());
// Enable cors
app.use(cors());
// load env vars
dotenv.config({ path: './config/config.env' });
app.use(express.static(__dirname + '/public'));

// gọi ejs
app.set('view engine', 'ejs');
const control_controllers = require('./controller/control_controllers');
app.use('/', control_controllers);



//gọi đến dbconnect
require('./dbconnect')
app.listen(3200, () => {
    console.log('Server On!');
});