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
