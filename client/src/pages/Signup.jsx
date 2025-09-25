// client/src/pages/Signup.jsx
import React from "react";
import { useForm } from "react-hook-form";

function Signup(){
    // 1. Initialize React Hook Form
    const { register, handleSubmit } = useForm();

    // Placeholder function for submission
    const onSubmit = (data) => {
        console.log("Form Data Submitted:", data);
        // This is where we'll handle the API call in a later step
    };

    return(
        <div className="pt-8 min-h-[60vh] flex items-center justify-center">
            <div className="max-w-lg w-full p-8 bg-dark-primary/90 backdrop-blur-sm rounded-xl shadow-2xl border border-light-blue/20">
                <h2 className="text-3xl font-extrabold text-light-blue mb-6 text-center tracking-wide">
                    Create Sweet Shop Account
                </h2>
                
                {/* 2. Attach handleSubmit to the form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    
                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            placeholder="Your Shop Name or Your Name"
                            // 3. Register the input field
                            {...register("name", { required: true })} 
                            className="w-full px-4 py-2 bg-slate-gray/20 border border-slate-gray/40 text-white rounded-lg focus:ring-light-blue focus:border-light-blue transition duration-150 ease-in-out"
                        />
                    </div>
                    
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="example@sweetshop.com"
                            {...register("email", { required: true })} 
                            className="w-full px-4 py-2 bg-slate-gray/20 border border-slate-gray/40 text-white rounded-lg focus:ring-light-blue focus:border-light-blue transition duration-150 ease-in-out"
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="Min 8 characters"
                            {...register("password", { required: true })} 
                            className="w-full px-4 py-2 bg-slate-gray/20 border border-slate-gray/40 text-white rounded-lg focus:ring-light-blue focus:border-light-blue transition duration-150 ease-in-out"
                        />
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="w-full mt-6 bg-light-blue text-dark-primary py-2.5 px-4 rounded-lg font-bold hover:bg-opacity-90 transition-colors duration-200"
                    >
                        Register
                    </button>
                    
                    <p className="text-center text-sm text-gray-400 mt-4">
                        Already have an account? 
                        <a href="/login" className="text-light-blue hover:text-light-blue/80 font-medium ml-1">Login here</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Signup;