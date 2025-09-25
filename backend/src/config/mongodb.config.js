const mongoose = require("mongoose");

const mongodbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
};

module.exports = { mongodbConnection };
