import  asyncHandler  from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import ApiResponse from  "../utils/ApiResponse.js"

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
    const coverImageLocalPath = req.files?.coverImage[0]?.path

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

export default registerUser