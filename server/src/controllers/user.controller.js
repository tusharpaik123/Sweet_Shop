import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body
    console.log("email: ", email);
    
   
    if([name, email, password].some(
        (field) => field?.trim() === "" )
    ){
        throw new ApiError(400, "All fields are required");
    }

    

    // Check if user already exists
    const existedUser = await User.findOne({email: email.toLowerCase()})

    if (existedUser) {
        throw new ApiError(409, "User with E-mail already exists");
    }

    console.log("new user");


    const user = await User.create({
        name, 
        email: email.toLowerCase(), 
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user.");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);
    
    const options = {
        httpOnly: true,
        secure: true,
    }

    // Return user data with tokens for auto-login
    return res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: createdUser, 
                token: accessToken,  // Frontend expects 'token'
                accessToken,         
                refreshToken
            }, "User Registered Successfully")
        )
}) 

const loginUser = asyncHandler(async (req, res) => {
    const { email, password  } = req.body;

    if(!email){
        throw new ApiError(400, "Email is required");
    }

    if(!password){
        throw new ApiError(400, "Password is required");
    }
    
    console.log(email);
    const user = await User.findOne({email: email.toLowerCase()})

    if(!user){
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid Password");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);
    
    if(!accessToken){
        throw new ApiError(500, "Failed to generate access token");
    }
    if(!refreshToken){
        throw new ApiError(500, "Failed to generate refresh token");
    }

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, 
                    token: accessToken,     
                    accessToken, 
                    refreshToken
                },
                "User logged in successfully",
            )
        )
})

const generateAccessAndRefreshTokens = async(userId) => {
    try{
        const user = await User.findById(userId);
        if(!user) {
            throw new ApiError(404, 'User not found while generating tokens');
        }
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return {accessToken, refreshToken}
    }
    catch(error){
        throw new ApiError(500, "Something went wrong while generating Tokens");
    }
}

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, 'No refresh token provided');
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(404, 'User not found while refreshing token');
        }
        
        if(incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, 'Refresh token is expired');
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, refreshToken: newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        token: accessToken,       
                        accessToken,
                        refreshToken: newRefreshToken
                    },
                    "Refresh token generated successfully",
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

export { registerUser, loginUser, logoutUser, refreshAccessToken, getCurrentUser };