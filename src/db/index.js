import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import express from "express";
import app from '../app.js'
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`);
        app.on("error", error => {
            console.error("ERROR : ", error);
            throw error
        })
        // app.get("/test", (req, res) => {
        //     res.send("Test route works!");
        // });
        // app.use("/api/v1/users", router)
       
        // console.log('Registered Routes:');
        // app._router.stack.forEach((layer) => {
        //     if (layer.route) {
        //         console.log(`Route: ${layer.route.path} - Methods: ${Object.keys(layer.route.methods).join(', ')}`);
        //     } else if (layer.name === 'router') {
        //         layer.handle.stack.forEach((subLayer) => {
        //             if (subLayer.route) {
        //                 console.log(`Route: ${subLayer.route.path} - Methods: ${Object.keys(subLayer.route.methods).join(', ')}`);
        //             }
        //         });
        //     }
        // });
        app.listen(process.env.PORT, () => {
            console.log("app is listening on port : ", process.env.PORT);

        })
    } catch (error) {
        console.error("ERROR : ", error);
        process.exit(1)
    }
}
export default connectDB