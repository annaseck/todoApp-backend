import mongoose from "mongoose";

const connectionDB = () => {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.log('Error connecting to MongoDB', error));   
};

export default connectionDB;