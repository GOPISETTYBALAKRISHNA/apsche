const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:3000/OnlineComplaintMERN', { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to db");
}).catch((e) => console.log(`Error in db connection ${e}`));
