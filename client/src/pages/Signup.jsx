
import React from "react";

function Signup(){
    return(
        <div className="pt-8 max-w-lg mx-auto p-6 bg-dark-primary/90 rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold text-light-blue mb-6 text-center">Register Your Sweet Shop</h2>
            
            <form>
                {/* Name Field */}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
                
                {/* Email Field */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>

                {/* Password Field */}
                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    className="w-full bg-light-blue text-dark-primary py-2 px-4 rounded-md font-semibold hover:bg-opacity-90"
                >
                    Register
                </button>
            </form>
        </div>
    );
}

export default Signup;