import {app} from './app.js'
import connectDB from './db/index.js'
const port = process.env.PORT || 3000

connectDB()
.then(()=>{
    console.log("Database connected successfully");
})
.catch((error)=>{
    console.log("database connection error");
    throw error
})




app.get('/', (req, res) => {
    res.send("this is home page")
})

app.listen(port, () => {
    console.log(`listening on port: ${port}`)
})
