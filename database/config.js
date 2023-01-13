const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_CNN);
        console.log("DB Online");
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    dbConnection
}