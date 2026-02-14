import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from 'jsonwebtoken'

export const verifyJWT = asyncHandler(async(req,_,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ")
    
        if(!token){
            throw new ApiError(400,"User data not found")
        }
    
        const decodeData = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodeData._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(401,"Unathorized user")
        }
    
        req.user = user
    
        next()
    } catch (error) {
        throw new ApiError(501,error?.message || "Invalid Access Token")
    }
})