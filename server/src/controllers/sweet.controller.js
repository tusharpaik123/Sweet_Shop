import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Sweet } from "../models/sweet.model.js";
import { Purchase } from "../models/purchase.model.js";
import { uploadImageOnCloudinary } from "../services/cloudinary.js";


const getAllSweets = asyncHandler(async (req, res) => {
    const sweets = await Sweet.find({ isActive: true }).sort({ createdAt: -1 });
    
    return res
        .status(200)
        .json(new ApiResponse(200, sweets, "Sweets fetched successfully"));
});


const searchSweets = asyncHandler(async (req, res) => {
    const { name, category, minPrice, maxPrice } = req.query;
    
    let query = { isActive: true };
    
    if (name) {
        query.name = { $regex: name, $options: 'i' };
    }
    
    if (category) {
        query.category = { $regex: category, $options: 'i' };
    }
    
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    const sweets = await Sweet.find(query).sort({ createdAt: -1 });
    
    return res
        .status(200)
        .json(new ApiResponse(200, sweets, "Search results fetched successfully"));
});


const getSweetById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const sweet = await Sweet.findById(id);
    
    if (!sweet) {
        throw new ApiError(404, "Sweet not found");
    }
    
    return res
        .status(200)
        .json(new ApiResponse(200, sweet, "Sweet fetched successfully"));
});

// Create new sweet (Admin only)
const createSweet = asyncHandler(async (req, res) => {
    const { name, description, category, price, quantity } = req.body;
    
    if (!name || !category || !price || quantity === undefined) {
        throw new ApiError(400, "Name, category, price, and quantity are required");
    }
    
    
    const filePath = req.file?.path;
    let imageUrl = null;
    if (filePath) {
        try {
            console.log('[sweet.controller] Attempting to upload image:', filePath);
            const result = await uploadImageOnCloudinary(filePath);
            if (result && result.url) {
                imageUrl = result.url;
                console.log('[sweet.controller] Image uploaded successfully:', imageUrl);
            } else {
                console.log('[sweet.controller] Upload result is null or missing URL');
            }
        } catch (e) {
            console.error('[sweet.controller] Image upload failed on create:', e?.message);
            
        }
    } else {
        console.log('[sweet.controller] No file provided for upload');
    }

    const sweet = await Sweet.create({
        name,
        description,
        category,
        price: Number(price),
        quantity: Number(quantity),
        ...(imageUrl && { image: imageUrl })
    });
    
    return res
        .status(201)
        .json(new ApiResponse(201, sweet, "Sweet created successfully"));
});

// Update sweet (Admin only)
const updateSweet = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, category, price, quantity, image, isActive } = req.body;
    
    const sweet = await Sweet.findById(id);
    
    if (!sweet) {
        throw new ApiError(404, "Sweet not found");
    }
    
    const filePath = req.file?.path;
    let newImageUrl = sweet.image;
    if (filePath) {
        try {
            console.log('[sweet.controller] Attempting to upload image for update:', filePath);
            const result = await uploadImageOnCloudinary(filePath);
            if (result && result.url) {
                newImageUrl = result.url;
                console.log('[sweet.controller] Image uploaded successfully for update:', newImageUrl);
            } else {
                console.log('[sweet.controller] Upload result is null or missing URL for update');
            }
        } catch (e) {
            console.error('[sweet.controller] Image upload failed on update:', e?.message);
           
        }
    } else {
        console.log('[sweet.controller] No file provided for update');
    }

    const updatedSweet = await Sweet.findByIdAndUpdate(
        id,
        {
            ...(name && { name }),
            ...(description && { description }),
            ...(category && { category }),
            ...(price !== undefined && { price: Number(price) }),
            ...(quantity !== undefined && { quantity: Number(quantity) }),
            ...(image && { image }),
            ...(newImageUrl && { image: newImageUrl }),
            ...(isActive !== undefined && { isActive })
        },
        { new: true }
    );
    
    return res
        .status(200)
        .json(new ApiResponse(200, updatedSweet, "Sweet updated successfully"));
});


const deleteSweet = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const sweet = await Sweet.findById(id);
    
    if (!sweet) {
        throw new ApiError(404, "Sweet not found");
    }
    
    
    await Sweet.findByIdAndUpdate(id, { isActive: false });
    
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Sweet deleted successfully"));
});


const purchaseSweet = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { quantity = 1 } = req.body;
    const userId = req.user._id;
    
    const sweet = await Sweet.findById(id);
    
    if (!sweet || !sweet.isActive) {
        throw new ApiError(404, "Sweet not found");
    }
    
    if (sweet.quantity < quantity) {
        throw new ApiError(400, "Insufficient stock");
    }
    
    
    const purchase = await Purchase.create({
        user: userId,
        sweet: id,
        quantity: Number(quantity),
        unitPrice: sweet.price,
        totalPrice: sweet.price * quantity
    });
    
 
    await Sweet.findByIdAndUpdate(id, {
        $inc: { quantity: -quantity }
    });
    
    
    const populatedPurchase = await Purchase.findById(purchase._id)
        .populate('sweet', 'name category price')
        .populate('user', 'name email');
    
    return res
        .status(200)
        .json(new ApiResponse(200, populatedPurchase, "Purchase completed successfully"));
});


const restockSweet = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity <= 0) {
        throw new ApiError(400, "Valid quantity is required");
    }
    
    const sweet = await Sweet.findById(id);
    
    if (!sweet) {
        throw new ApiError(404, "Sweet not found");
    }
    
    const updatedSweet = await Sweet.findByIdAndUpdate(
        id,
        { $inc: { quantity: Number(quantity) } },
        { new: true }
    );
    
    return res
        .status(200)
        .json(new ApiResponse(200, updatedSweet, "Sweet restocked successfully"));
});


const getUserPurchases = asyncHandler(async (req, res) => {
    const purchases = await Purchase.find({ user: req.user._id })
        .populate('sweet', 'name category price image')
        .sort({ createdAt: -1 });
    
    return res
        .status(200)
        .json(new ApiResponse(200, purchases, "Purchase history fetched successfully"));
});


const getAllPurchases = asyncHandler(async (req, res) => {
    const purchases = await Purchase.find()
        .populate('sweet', 'name category price')
        .populate('user', 'name email')
        .sort({ createdAt: -1 });
    
    return res
        .status(200)
        .json(new ApiResponse(200, purchases, "All purchases fetched successfully"));
});

export {
    getAllSweets,
    searchSweets,
    getSweetById,
    createSweet,
    updateSweet,
    deleteSweet,
    purchaseSweet,
    restockSweet,
    getUserPurchases,
    getAllPurchases
};
