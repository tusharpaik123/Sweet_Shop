import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";

import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body
    console.log("email: ", email);


 if([name, email, password].some(
        (field) => field?.trim() === "" )
    ){
        throw new ApiError(400, "All fields are required");
    }


    const existedUser = await User.findOne({email})




 if (existedUser) {
        throw new ApiError(409, "User with E-mail already exists");
    }

    const user = await User.create({
        name, 
        email, 
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-passowrd -refreshToken"
    )

    if (!createdUser){
        throw new ApiError(404, "Something went wrong while registering the user.");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )

}) 


const generateAccessAndRefreshTokens = async(userId) => {
    try{
        const user = await User.findById(userId);
        if(!user) {
            throw new ApiError('User not found while generating tokens', 404);
        }
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return {accessToken, refreshToken}
    }
    catch(error){
        throw new ApiError(500, "Something went wrong while generating Tokens during Login");
    }
}

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError('No refresh token provided', 401);
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError('User not found while refreshing token', 404);
        }
        
        if(incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError('Refresh token is expired', 401);
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newrefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newrefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken: newrefreshToken
                },
                "Refresh token generated successfully",
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})


export {registerUser};
