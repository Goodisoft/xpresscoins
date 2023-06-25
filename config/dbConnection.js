const mongoose = require('mongoose');


dbConnection = async () => {
    // process.env.DB_URL
    await mongoose.connect(process.env.DB_URL)

}


module.exports = {dbConnection}