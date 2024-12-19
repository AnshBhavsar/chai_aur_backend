import  asyncHandler  from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import ApiResponse from  "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";
const registerUser = asyncHandler(async (req , res)=>{
    // get user detail from frontend
    // validation - not empty
    // check if user already existsby email or username
    // check for images and avatar
    // upload them to cloudinary .avatar
    // create user  - create entry in db
    // remove password and reference token field from response
    // check for user creation
    // return res

    const {username , email , password , fullname } = req.body
    console.log("email : " , email);
    if (
        [username , email , password , fullname].some(field => field?.trim()==="")
    ) {
        throw new ApiError(400 , `please provide all details`)
    }
    const existedUser =await User.findOne({
        $or : [{ username } , { email }]
    })
    if (existedUser) {
        throw new ApiError(409 , `already registered`)
    }
    // this files func is provided by multer middleware
    console.log(req.body);
    console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path
    let coverImageLocalPath
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        req.files.coverImage[0].path
    }
    if (!avatarLocalPath) {
        throw new ApiError(400 , " avatar field is required !")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) { 
        throw new ApiError(400 , " avatar field is required !")
    }
    const user = await User.create({
        fullname,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase()
    })

    const createdUser = await user.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500 , "something went wrong while creating a user")
    }

    return res.status(201).json(
        new ApiResponse(200 , createdUser , "user registered successfully")
    )
})

const generateAccessTokenAndgenerateRefToken = async (userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refToken = user.generateRefToken()
        user.refreshToken  = refToken
        await user.save({validateBeforeSave : true})
        return {accessToken , refToken}
    } catch (error) {
        throw new ApiError(500 , "error occurred while generating refresh and access token")
    }
}

const loginUser = asyncHandler(async (req,res)=>{
    // take data from req body
    // login using either email or username
    // find the user if user have an account or not
    // password check
    // access and ref token 
    // send these tokens as secure cookies
    
    const {username , email , password} = req.body

    if (!username && !email) {
        throw new ApiError(400 , "username or email is required")
    }

    const user =await User.findOne({
        $or : [{email} , {username}]
    })
    if (!user) {
        throw new ApiError(404 , "user does not exist")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(404 , "your password is wrong !")
    }
    const {accessToken , refToken} = await generateAccessTokenAndgenerateRefToken(user._id)

    user.refreshToken = refToken
    const loggedInUser = user.select("-password -refreshToken ")

    const option = {
        httpOnly  : true,
        secure : true
    }

    return res
    .status(200)
    .cookie("accessToken" , accessToken , option)
    .cookie("refreshToken" , refToken , option)
    .json(
        new ApiResponse(
            200,
            {
                user : loggedInUser , accessToken , refToken
            },
            "user logged in successfully "
        )
    )
})
const logoutUser = asyncHandler(async (req , res)=>{
    // delete the refreshToken from user's database if user wants to logout

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : undefined
            }
          
        },
        {
            new : true
        }
    )
    const options = {
        httpOnly : true,
        secure: true
    }
    return res.status(200)
              .clearCookie("accessToken" , options)
              .clearCookie("refreshToken" , options)
              .json(new ApiResponse(200 , {} , "user logged out successfully"))
})
const refreshAccessToken = asyncHandler(async (req , res)=>{
  const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken
  if (!incomingRefreshToken) {
    throw new ApiError(401 , "unauthorized reqeust")
  }
  const decodedToken = jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET)

})
export default registerUser


export {loginUser , logoutUser} 