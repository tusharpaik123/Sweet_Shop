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
            navigate(role === 'admin' ? "/admin" : "/dashboard", { replace: true });
        } catch (err) {
            const msg = err?.response?.data?.message || "Invalid credentials";
            setApiError(msg);
        }
    };

    return(
        <div className="pt-8 min-h-[60vh] flex items-center justify-center">
            <div className="max-w-md w-full p-8 bg-dark-primary/90 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700">
                <h2 className="text-3xl font-extrabold text-light-blue mb-6 text-center tracking-wide">Login</h2>
                {apiError && <div className="mb-3 text-red-400 text-sm">{apiError}</div>}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input 
                            id="email" 
                            type="email" 
                            placeholder="you@example.com"
                            {...register("email", { required: "Email is required" })}
                            className={`w-full px-4 py-2 bg-slate-800/30 text-white rounded-lg focus:ring-light-blue focus:border-light-blue transition ${errors.email ? 'border-red-500 border-2' : 'border border-slate-600'}`}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input 
                            id="password" 
                            type="password" 
                            placeholder="••••••••"
                            {...register("password", { required: "Password is required" })}
                            className={`w-full px-4 py-2 bg-slate-800/30 text-white rounded-lg focus:ring-light-blue focus:border-light-blue transition ${errors.password ? 'border-red-500 border-2' : 'border border-slate-600'}`}
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
                    </div>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full mt-2 bg-light-blue text-dark-primary py-2.5 px-4 rounded-lg font-bold hover:bg-opacity-90 disabled:opacity-60"
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;