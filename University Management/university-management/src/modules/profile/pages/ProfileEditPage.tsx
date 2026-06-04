import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProfileDetails, useUpdateProfile } from '../hooks/useProfile';
import { profileSchema } from '../schemas/profile.schema';
import type { ProfileFormData } from '../schemas/profile.schema';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/components/ui/Select';
import { ArrowLeft, Save, X, User, Award, GraduationCap } from 'lucide-react';

export const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading: isFetching } = useProfileDetails();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      fullName: '',
      phone: '',
      gender: '' as any,
      dateOfBirth: '',
      bloodGroup: '',
      address: '',
      qualification: '',
      specialization: '',
      officeRoom: '',
      guardianName: '',
      guardianPhone: '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        gender: (profile.gender || '') as any,
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
        bloodGroup: profile.bloodGroup || '',
        address: profile.address || '',
        qualification: profile.qualification || '',
        specialization: profile.specialization || '',
        officeRoom: profile.officeRoom || '',
        guardianName: profile.guardianName || '',
        guardianPhone: profile.guardianPhone || '',
      });
    }
  }, [profile, reset]);

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-slate-900">Profile data not found</h3>
        <p className="text-slate-500 mt-2">Could not retrieve your profile. Please try logging in again.</p>
      </div>
    );
  }

  const handleFormSubmit = (data: ProfileFormData) => {
    updateProfile(data, {
      onSuccess: () => {
        navigate('/profile');
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Update Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Edit your personal contact details and biography.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        
        {/* Read-Only System Identity Information */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Restricted Account Settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-slate-500 font-medium">Username / Login ID</p>
              <p className="font-semibold text-slate-700 mt-1">{profile.username}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Security Role</p>
              <p className="font-semibold text-slate-700 mt-1">{profile.role}</p>
            </div>
            {profile.role === 'STUDENT' && (
              <>
                <div>
                  <p className="text-slate-500 font-medium">Student ID</p>
                  <p className="font-semibold text-slate-700 mt-1">{profile.studentId}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Department</p>
                  <p className="font-semibold text-slate-700 mt-1">{profile.department}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Admission Semester</p>
                  <p className="font-semibold text-slate-700 mt-1">{profile.semester}</p>
                </div>
              </>
            )}
            {profile.role === 'FACULTY' && (
              <>
                <div>
                  <p className="text-slate-500 font-medium">Faculty Code</p>
                  <p className="font-semibold text-slate-700 mt-1">{profile.facultyCode}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Employee Serial ID</p>
                  <p className="font-semibold text-slate-700 mt-1">{profile.employeeId}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Department</p>
                  <p className="font-semibold text-slate-700 mt-1">{profile.department}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Editable Personal Details */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 flex items-center gap-2">
            <User size={18} className="text-indigo-600" /> Personal & Contact Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              placeholder="e.g., John Doe"
              {...register('fullName')}
              error={errors.fullName?.message}
            />

            <Input
              label="Contact Phone"
              placeholder="e.g., +88017XXXXXXXX"
              {...register('phone')}
              error={errors.phone?.message}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-slate-700">Gender</label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && <p className="text-xs font-medium text-red-500">{errors.gender.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-slate-700">Blood Group</label>
              <Controller
                name="bloodGroup"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <SelectTrigger className={errors.bloodGroup ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select Blood Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.bloodGroup && <p className="text-xs font-medium text-red-500">{errors.bloodGroup.message}</p>}
            </div>

            <Input
              label="Date of Birth"
              type="date"
              {...register('dateOfBirth')}
              error={errors.dateOfBirth?.message}
            />

            <div className="md:col-span-2">
              <Input
                label="Residential Address"
                placeholder="Enter your street, city details"
                {...register('address')}
                error={errors.address?.message}
              />
            </div>
          </div>
        </div>

        {/* Role-Specific Editable Details: Faculty */}
        {profile.role === 'FACULTY' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 flex items-center gap-2">
              <Award size={18} className="text-indigo-600" /> Academic & Credentials Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Highest Qualification"
                placeholder="e.g., Ph.D. in Computer Science"
                {...register('qualification')}
                error={errors.qualification?.message}
              />
              <Input
                label="Office Room Location"
                placeholder="e.g., Room 302, Block B"
                {...register('officeRoom')}
                error={errors.officeRoom?.message}
              />
              <div className="md:col-span-2">
                <Input
                  label="Area of Specialization"
                  placeholder="e.g., Machine Learning, Cyber Security, Web Engineering"
                  {...register('specialization')}
                  error={errors.specialization?.message}
                />
              </div>
            </div>
          </div>
        )}

        {/* Role-Specific Editable Details: Student */}
        {profile.role === 'STUDENT' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 flex items-center gap-2">
              <GraduationCap size={18} className="text-indigo-600" /> Guardian & Emergency Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Guardian / Emergency Contact Name"
                placeholder="Name of your guardian"
                {...register('guardianName')}
                error={errors.guardianName?.message}
              />
              <Input
                label="Guardian / Emergency Contact Phone"
                placeholder="Phone number of your guardian"
                {...register('guardianPhone')}
                error={errors.guardianPhone?.message}
              />
            </div>
          </div>
        )}

        {/* Form Action Controls */}
        <div className="flex justify-end gap-4 border-t pt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/profile')}
            disabled={isUpdating}
            className="gap-1.5"
          >
            <X size={16} /> Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isUpdating} 
            className="bg-indigo-600 hover:bg-indigo-700 gap-1.5"
          >
            <Save size={16} /> {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};
