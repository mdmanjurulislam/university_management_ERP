import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '../schemas/user.schema';
import type { UserFormValues } from '../schemas/user.schema';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../../shared/components/ui/Select';
import type { UserRole } from '../types/user.types';
import { useAuth } from '../../auth/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

interface UserFormProps {
  initialData?: Partial<UserFormValues>;
  onSubmit: (data: UserFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  isLoading 
}) => {
  const { user: currentUser } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      userName: '',
      userPassword: '',
      role: 'STUDENT',
    },
  });

  const normalizeRole = (role: any): UserRole => {
    if (!role) return 'STUDENT';
    const r = String(role).trim().toUpperCase();
    if (r.includes('ADMIN')) return 'ADMIN';
    if (r.includes('FACULTY')) return 'FACULTY';
    if (r.includes('STUDENT')) return 'STUDENT';
    if (r.includes('USER')) return 'USER';
    return 'STUDENT';
  };

  // Reset form when initialData changes (handles Create vs Edit switching)
  React.useEffect(() => {
    if (initialData) {
      reset({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        userName: initialData.userName || '',
        userPassword: '',
        role: normalizeRole(initialData.role),
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        userName: '',
        userPassword: '',
        role: 'STUDENT',
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4" autoComplete="off">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          placeholder="e.g. Manjurul"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <Input
          label="Last Name"
          placeholder="e.g. Islam"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
        <Input
          label="Username"
          placeholder="e.g. manjurul"
          error={errors.userName?.message}
          autoComplete="off"
          {...register('userName')}
        />
        
        <Input
          label={initialData ? "New Password (Leave blank to keep current)" : "Password"}
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          error={errors.userPassword?.message}
          autoComplete="new-password"
          {...register('userPassword')}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="hover:text-indigo-600 transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />
        
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Assign Role</label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select 
                key={field.value}
                onValueChange={field.onChange} 
                value={field.value}
                disabled={currentUser?.role !== 'ADMIN'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrator</SelectItem>
                  <SelectItem value="FACULTY">Faculty Member</SelectItem>
                  <SelectItem value="STUDENT">Student</SelectItem>
                  <SelectItem value="USER">Regular User</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
        <Button variant="outline" type="button" onClick={onCancel} className="px-6">
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading} className="px-8 shadow-lg shadow-indigo-100">
          {initialData ? 'Update User' : 'Save User'}
        </Button>
      </div>
    </form>
  );
};
