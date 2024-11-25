import express, { json } from "express";
import cookieParser from "cookie-parser";
import cors from 'cors'

const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN, 
    credentials : true//allows the browser to send sensitive data in the condition of cors
}))

app.use(express.json({limit : '10kb'}))//parses the json data comes from frontend and send parsed data to req.body
app.use(express.urlencoded({extended : true,limit : '10kb'}))//encodes the url data comes from submitting a form on 
// frontend and send encoded data to req.body 
app.use(express.static('public'))//serves files efficiently which are present in public folder like html ,css , js amd png files
app.use(cookieParser())


//route import

import router from './routers/user.routes.js'

//routes declaration

app.use("/api/v1/users",router)  

// app.get("/users",(req,res)=>{}) this code is for directly handling the route by executing func 
// while app.use("/users",userRouter) this code handle the route by first using the middleware and
//  then sending the control to router and then router will execute the further logic 
export default app