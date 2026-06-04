import React from 'react';
import { motion } from 'framer-motion';
import { LoginForm } from '../components/LoginForm';
import { GraduationCap } from 'lucide-react';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex bg-slate-50 overflow-hidden">
      {/* Left Side: Illustration & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden items-center justify-center">
        {/* Animated Background Blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />

        <div className="relative z-10 text-white p-12 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                <GraduationCap size={40} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                South East <br /> <span className="text-indigo-200">University</span>
              </h1>
            </div>
            
            <h2 className="text-4xl font-extrabold mb-6 leading-tight">
              Manage your academic journey with excellence.
            </h2>
            <p className="text-indigo-100 text-lg mb-8">
              Welcome back to the University Management System. Access your courses, grades, and administrative tools in one place.
            </p>
            
            <div className="flex gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-indigo-400 flex items-center justify-center text-xs font-bold">
                    U{i}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-bold">Joined by 2000+ students</p>
                <p className="text-indigo-200">and 500+ faculty members</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white lg:bg-transparent">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Mobile Branding */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <GraduationCap size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              South East University
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h2>
            <p className="text-slate-500">
              Please enter your credentials to access your account.
            </p>
          </div>

          {/* Glassmorphism Card (for desktop when on bg-slate-50) */}
          <div className="bg-white/70 lg:backdrop-blur-xl lg:border lg:border-white/20 lg:shadow-2xl rounded-3xl lg:p-8">
            <LoginForm />
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Contact Administration
            </a>
          </p>
          
          <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
            <p>© 2026 South East University</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-600">Privacy Policy</a>
              <a href="#" className="hover:text-slate-600">Terms of Service</a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
