const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://nhat:zgmfx19a@cluster0.kjpzi.mongodb.net/R-database?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true

    })
    .then(() => console.log('Connected'))
    .catch((err) => console.log(err));