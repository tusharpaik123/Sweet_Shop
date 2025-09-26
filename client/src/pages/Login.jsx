import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../store/authSlice.js";
import { selectIsAdmin } from "../store/authSlice.js";
import { useSelector } from "react-redux";
import { login as loginApi } from "../services/auth.js";

function Login(){
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const dispatch = useDispatch();
    const isAdmin = useSelector(selectIsAdmin);
    const navigate = useNavigate();
    const [apiError, setApiError] = useState("");

    const onSubmit = async (data) => {
        setApiError("");
        try {
            const result = await loginApi(data); 
            dispatch(loginAction(result));
            const role = result?.user?.role;
            navigate(role === 'admin' ? "/admin" : "/products", { replace: true });
        } catch (err) {
            const msg = err?.response?.data?.message || "Invalid credentials";
            setApiError(msg);
        }
    };

    return(
        <div className="pt-8 min-h-[60vh] flex items-center justify-center animate-fade-in">
            <div className="max-w-md w-full p-8 card shadow-chocolate">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4"></div>
                    <h2 className="text-3xl font-bold text-chocolate mb-2">Welcome Back!</h2>
                    <p className="text-chocolate/70">Sign in to your Sweet Shop account</p>
                </div>
                
                {apiError && (
                    <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-lg">
                        <div className="text-error text-sm font-medium">⚠️ {apiError}</div>
                    </div>
                )}
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-chocolate mb-2">
                            Email Address
                        </label>
                        <input 
                            id="email" 
                            type="email" 
                            placeholder="your@email.com"
                            {...register("email", { required: "Email is required" })}
                            className={`form-input w-full ${errors.email ? 'border-error border-2 focus:ring-error' : ''}`}
                        />
                        {errors.email && <p className="mt-2 text-xs text-error">{errors.email.message}</p>}
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-chocolate mb-2">
                            Password
                        </label>
                        <input 
                            id="password" 
                            type="password" 
                            placeholder="••••••••"
                            {...register("password", { required: "Password is required" })}
                            className={`form-input w-full ${errors.password ? 'border-error border-2 focus:ring-error' : ''}`}
                        />
                        {errors.password && <p className="mt-2 text-xs text-error">{errors.password.message}</p>}
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="btn-primary w-full py-3 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <span className="animate-spin mr-2">🍯</span>
                                Signing in...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>
                
                <div className="mt-8 text-center">
                    <p className="text-chocolate/70 text-sm">
                        Don't have an account?{' '}
                        <a href="/signup" className="text-saffron font-semibold hover:text-saffron-dark transition-colors">
                            Sign up here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;