import React, { useState } from 'react';
import { Bell, Search, LogOut, User, Key, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../modules/auth/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '../../shared/components/ui/Avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@radix-ui/react-dropdown-menu';
import { useLayoutStore } from '../../shared/utils/layoutStore';
import { cn } from '../../shared/utils/cn';
import { useNavigate } from 'react-router-dom';
import { useProfileDetails, useChangePassword } from '../../modules/profile/hooks/useProfile';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalTitle, 
  ModalDescription, 
  ModalFooter 
} from '../../shared/components/ui/Modal';
import { Input } from '../../shared/components/ui/Input';
import { Button } from '../../shared/components/ui/Button';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isSidebarOpen } = useLayoutStore();
  const navigate = useNavigate();
  
  // Fetch detailed profile to show full name
  const { data: profile } = useProfileDetails();

  // Change Password States
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  const { mutate: changePassword, isPending: isChanging } = useChangePassword();

  const handleChangePasswordClick = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setFormError('');
    setIsPasswordModalOpen(true);
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setFormError('All fields are required');
      return;
    }

    if (newPassword.length < 6) {
      setFormError('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    changePassword(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          setIsPasswordModalOpen(false);
        },
        onError: (err: any) => {
          setFormError(err.response?.data?.message || 'Failed to change password. Check your current password.');
        }
      }
    );
  };

  return (
    <>
      <header className={cn(
        "fixed top-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-20 transition-all duration-300",
        isSidebarOpen ? "left-64" : "left-20"
      )}>
        <div className="h-full px-6 flex items-center justify-between">
          {/* Search Bar */}
          <div className="hidden md:flex items-center w-full max-w-md bg-slate-100 px-4 py-2 rounded-xl border border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-all group">
            <Search size={18} className="text-slate-400 group-focus-within:text-indigo-500" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="ml-3 bg-transparent border-none outline-none text-sm w-full text-slate-600 placeholder:text-slate-400"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 ml-auto">
            <button className="p-2 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-8 w-px bg-slate-200 mx-2"></div>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-50 transition-all outline-none">
                <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.userName}`} />
                  <AvatarFallback>{user?.userName?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold text-slate-900 leading-none">
                    {profile?.fullName || user?.userName}
                  </p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase mt-1 tracking-wider">{user?.role}</p>
                </div>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56 bg-white p-2 rounded-2xl shadow-xl border border-slate-100 z-50 animate-in fade-in slide-in-from-top-1">
                <DropdownMenuLabel className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuItem 
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer outline-none transition-colors"
                >
                  <User size={18} />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleChangePasswordClick}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer outline-none transition-colors"
                >
                  <Key size={18} />
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuSeparator className="h-px bg-slate-100 my-2" />
                <DropdownMenuItem 
                  onClick={logout}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 cursor-pointer outline-none transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Change Password Dialog */}
      <Modal open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <ModalContent className="max-w-md p-6">
          <ModalHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-2">
              <Lock size={24} />
            </div>
            <ModalTitle className="text-center text-xl">Change Password</ModalTitle>
            <ModalDescription className="text-center">
              Please enter your current password to choose a new one.
            </ModalDescription>
          </ModalHeader>

          <form onSubmit={handlePasswordChangeSubmit} className="space-y-4 py-2">
            <div className="relative">
              <Input
                label="Current Password"
                type={showPasswords ? "text" : "password"}
                placeholder="••••••••"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600"
                onClick={() => setShowPasswords(!showPasswords)}
              >
                {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Input
              label="New Password"
              type={showPasswords ? "text" : "password"}
              placeholder="•••••••• (Min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <Input
              label="Confirm New Password"
              type={showPasswords ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {formError && (
              <p className="text-xs font-semibold text-red-500 bg-red-50 p-2.5 rounded-xl text-center">
                {formError}
              </p>
            )}

            <ModalFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPasswordModalOpen(false)}
                disabled={isChanging}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isChanging}
                className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto"
              >
                {isChanging ? 'Updating...' : 'Update Password'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
