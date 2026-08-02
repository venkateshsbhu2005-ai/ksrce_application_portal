import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', data);
      const { token, ...userData } = response.data;
      login(userData, token);
      
      // Route based on role
      switch (userData.role) {
        case 'ROLE_ADMIN': navigate('/admin'); break;
        case 'ROLE_STUDENT': navigate('/student'); break;
        case 'ROLE_MENTOR': navigate('/mentor'); break;
        case 'ROLE_HOD': navigate('/hod'); break;
        case 'ROLE_PRINCIPAL': navigate('/principal'); break;
        default: navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary-900 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/60 to-transparent"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-white p-12 max-w-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <img src="/favicon.png" alt="KSRCE Logo" className="w-12 h-12 object-contain" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">KSRCE</h1>
          </div>
          <h2 className="text-3xl font-semibold mb-4 leading-tight">
            Application <br />
            <span className="text-emerald-400">Portal</span>
          </h2>
          <p className="text-primary-100 text-lg">
            Streamlining campus requests with a modern, paperless workflow. Experience the future of educational administration.
          </p>
        </motion.div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-500">Please sign in to your account</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-danger-50 text-danger-600 p-3 rounded-md text-sm text-center border border-danger-100">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input 
                    type="email" 
                    placeholder="Enter your email"
                    className="pl-10"
                    {...register('email', { required: 'Email is required' })}
                  />
                </div>
                {errors.email && <span className="text-danger-500 text-xs mt-1 block">{errors.email.message}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input 
                    type="password" 
                    placeholder="••••••••"
                    className="pl-10"
                    {...register('password', { required: 'Password is required' })}
                  />
                </div>
                {errors.password && <span className="text-danger-500 text-xs mt-1 block">{errors.password.message}</span>}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember me</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">Forgot password?</a>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
