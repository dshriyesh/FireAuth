import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'

const connectDB = async(req,res)=>{
    try {
        const DBresponse = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        console.log(`mongodb connected !! host : ${DBresponse.connection.host}`)

    } catch (error) {
        console.log("MongoDB connection Error");
        throw new error
    }
}

export default connectDB