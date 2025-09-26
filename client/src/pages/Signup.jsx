import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../store/authSlice.js";
import { register as registerApi } from "../services/auth.js";

function Signup(){
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [apiError, setApiError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (data) => {
        setApiError("");
        setSubmitting(true);
        try {
            const result = await registerApi(data);
            // If registration returns user data and token, auto-login
            if (result.user && result.token) {
                dispatch(loginAction(result));
                navigate('/dashboard', { replace: true });
            } else {
                navigate('/login', { replace: true });
            }
        } catch (e) {
            setApiError(e?.response?.data?.message || 'Registration failed');
        } finally {
            setSubmitting(false);
        }
    };

    return(
        <div className="pt-8 min-h-[60vh] flex items-center justify-center">
            <div className="max-w-lg w-full p-8 bg-dark-primary/90 backdrop-blur-sm rounded-xl shadow-2xl border border-light-blue/20">
                <h2 className="text-3xl font-extrabold text-light-blue mb-6 text-center tracking-wide">
                    Create Sweet Shop Account
                </h2>
                {apiError && <div className="mb-3 text-red-400 text-sm">{apiError}</div>}
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    
                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            placeholder="Your Shop Name or Your Name"
                            {...register("name", { required: "Name is required" })} 
                            className={`w-full px-4 py-2 bg-slate-800/30 text-white rounded-lg focus:ring-light-blue focus:border-light-blue transition duration-150 ease-in-out ${errors.name ? 'border-red-500 border-2' : 'border border-slate-600'}`}
                        />
                        {/* Conditional error message display */}
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-400 font-medium">
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                    
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="example@sweetshop.com"
                            {...register("email", { 
                                required: "Email is required",
                                // Add basic email pattern validation
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email address"
                                }
                            })} 
                            className={`w-full px-4 py-2 bg-slate-800/30 text-white rounded-lg focus:ring-light-blue focus:border-light-blue transition duration-150 ease-in-out ${errors.email ? 'border-red-500 border-2' : 'border border-slate-600'}`}
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-400 font-medium">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="Min 8 characters"
                            {...register("password", { 
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters"
                                }
                            })} 
                            className={`w-full px-4 py-2 bg-slate-800/30 text-white rounded-lg focus:ring-light-blue focus:border-light-blue transition duration-150 ease-in-out ${errors.password ? 'border-red-500 border-2' : 'border border-slate-600'}`}
                        />
                        {/* Conditional error message display */}
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-400 font-medium">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={submitting}
                        className="w-full mt-6 bg-light-blue text-dark-primary py-2.5 px-4 rounded-lg font-bold hover:bg-opacity-90 transition-colors duration-200 disabled:opacity-60"
                    >
                        {submitting ? 'Registering...' : 'Register'}
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