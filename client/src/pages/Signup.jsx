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
            if (result.user && result.token) {
                dispatch(loginAction(result));
                const role = result?.user?.role;
                navigate(role === 'admin' ? '/admin' : '/products', { replace: true });
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
        <div className="pt-8 min-h-[60vh] flex items-center justify-center animate-fade-in">
            <div className="max-w-lg w-full p-8 card shadow-chocolate">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4"></div>
                    <h2 className="text-3xl font-bold text-chocolate mb-2">Join Sweet Shop!</h2>
                    <p className="text-chocolate/70">Create your account to start your sweet journey</p>
                </div>
                
                {apiError && (
                    <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-lg">
                        <div className="text-error text-sm font-medium">⚠️ {apiError}</div>
                    </div>
                )}
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-chocolate mb-2">
                            Full Name
                        </label>
                        <input 
                            type="text" 
                            id="name" 
                            placeholder="Your name or shop name"
                            {...register("name", { required: "Name is required" })} 
                            className={`form-input w-full ${errors.name ? 'border-error border-2 focus:ring-error' : ''}`}
                        />
                        {errors.name && (
                            <p className="mt-2 text-xs text-error font-medium">
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                    
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-chocolate mb-2">
                            Email Address
                        </label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="your@email.com"
                            {...register("email", { 
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email address"
                                }
                            })} 
                            className={`form-input w-full ${errors.email ? 'border-error border-2 focus:ring-error' : ''}`}
                        />
                        {errors.email && (
                            <p className="mt-2 text-xs text-error font-medium">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-chocolate mb-2">
                            Password
                        </label>
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="Minimum 8 characters"
                            {...register("password", { 
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters"
                                }
                            })} 
                            className={`form-input w-full ${errors.password ? 'border-error border-2 focus:ring-error' : ''}`}
                        />
                        {errors.password && (
                            <p className="mt-2 text-xs text-error font-medium">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={submitting}
                        className="btn-primary w-full py-3 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <span className="flex items-center justify-center">
                                <span className="animate-spin mr-2"></span>
                                Creating account...
                            </span>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                    
                    <div className="mt-8 text-center">
                        <p className="text-chocolate/70 text-sm">
                            Already have an account?{' '}
                            <a href="/login" className="text-saffron font-semibold hover:text-saffron-dark transition-colors">
                                Sign in here
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;