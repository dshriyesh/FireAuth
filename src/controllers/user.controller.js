import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const generateAccessAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId?._id)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false});

        return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}

const registerUser=asyncHandler(async(req,res)=>{

    //take credentials
    //check if format is correct
    //check for any missing fields
    //check if user already registered
    //if not than save data
    //also generate access token and refresh token for authentication

    const {username,email,fullname,password} = req.body;

    if([username,email,fullname,password].some((field)=>field?.trim()==='')){
        throw new ApiError(400,"All fields are required")
    }

    const userExist = await User.findOne({
        $or:[{username},{email}]
    })

    if(userExist){
        throw new ApiError(409,"User already registered")
    }

    const user= await User.create({
        username,
        email,
        fullname,
        password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering user")
    }

    return res.status(200)
    .json(new ApiResponse(200,createdUser,"User registered successfully"))
})

const loginUser = asyncHandler(async(req,res)=>{

    const {username,email,password} = req.body
    if(!(username || email)){
        throw new ApiError(401,"Either username or email is required")
    }

    const user = await User.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        throw new ApiError(400,"Not Registerd User!!")
    }

    const passwordCheck = user.isPasswordCorrect(password);

    if(!passwordCheck){
        throw new ApiError(401,"Password is incorrect")
    }

    const{accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

    const login = await User.findById(user._id).select("-password -refreshToken")
    const options = {
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie('accessToken',accessToken,options)
    .cookie('refreshToken',refreshToken,options)
    .json(new ApiResponse(200,{
        user:login,accessToken,refreshToken
    },
    "User loggedIn Successfully"
))
})

const logoutUser  = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .clearCookie('accessToken',options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"logged out successfully"))

})



export {registerUser,loginUser,logoutUser}