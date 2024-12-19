import { User } from '../models/user.model.js'
import ApiError from '../utils/ApiError.js'
import asyncHandler from '../utils/asyncHandler.js'
import jwt from 'jsonwebtoken'


const verifyJWT = asyncHandler(async (req,_,next)=>{
    // cookies have access to accesstoken that we have sent them 
    // and this cookie can be accessed using req object

   const token = req.cookies.accessToken || req.header["Authorization"]?.split(" ")[1] //client sometimes itself sends authorization header to server to authenticate
   if (!token) {
    throw new ApiError(401 , "unauthorized request !")
   }
   const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
   const user = User.findById(decodedToken?._id).select(" -password -refreshToken")

   if (!user) {
    throw new ApiError(401 , "invalid Access Token !")
}
    req.user = user
    next()

}
)
export {verifyJWT}