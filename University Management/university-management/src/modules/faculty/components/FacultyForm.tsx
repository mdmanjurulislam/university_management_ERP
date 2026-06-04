import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { facultySchema } from '../schemas/faculty.schema';
import type { FacultyFormData } from '../schemas/faculty.schema';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/components/ui/Select';
import { DepartmentSelect } from '../../department/components/DepartmentSelect';
import type { Faculty } from '../types';

interface FacultyFormProps {
  initialData?: Faculty;
  onSubmit: (data: FacultyFormData) => void;
  isLoading: boolean;
}

export const FacultyForm: React.FC<FacultyFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FacultyFormData>({
    resolver: zodResolver(facultySchema) as any,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: '' as any,
      dateOfBirth: '',
      bloodGroup: '',
      employeeId: '',
      designation: '' as any,
      joiningDate: new Date().toISOString().split('T')[0],
      employmentType: '' as any,
      highestQualification: '',
      specialization: '',
      officeRoom: '',
      departmentId: undefined,
      isActive: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        phone: initialData.phone,
        gender: initialData.gender as any,
        dateOfBirth: initialData.dateOfBirth.split('T')[0],
        bloodGroup: initialData.bloodGroup,
        employeeId: initialData.employeeId,
        designation: initialData.designation as any,
        joiningDate: initialData.joiningDate.split('T')[0],
        employmentType: initialData.employmentType as any,
        highestQualification: initialData.highestQualification,
        specialization: initialData.specialization,
        officeRoom: initialData.officeRoom,
        departmentId: initialData.department?.id,
        isActive: initialData.isActive,
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="space-y-6 md:col-span-2 lg:col-span-1">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Personal Information</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                {...register('firstName')}
                error={errors.firstName?.message}
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                {...register('lastName')}
                error={errors.lastName?.message}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date of Birth"
                type="date"
                {...register('dateOfBirth')}
                error={errors.dateOfBirth?.message}
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
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                label="Employee ID"
                placeholder="e.g., EMP-123"
                {...register('employeeId')}
                error={errors.employeeId?.message}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-6 md:col-span-2 lg:col-span-1">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Contact Details</h3>
          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="faculty@university.edu"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Phone Number"
              placeholder="+1234567890"
              {...register('phone')}
              error={errors.phone?.message}
            />
            <Input
              label="Office Room"
              placeholder="e.g., Room 405, Block B"
              {...register('officeRoom')}
              error={errors.officeRoom?.message}
            />
          </div>
        </div>

        {/* Employment Information */}
        <div className="space-y-6 md:col-span-2 lg:col-span-1">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Employment Information</h3>
          <div className="space-y-4">
            <Controller
              name="departmentId"
              control={control}
              render={({ field }) => (
                <DepartmentSelect 
                  value={field.value} 
                  onChange={field.onChange} 
                  error={errors.departmentId?.message} 
                />
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-slate-700">Designation</label>
                <Controller
                  name="designation"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger className={errors.designation ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select Designation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LECTURER">Lecturer</SelectItem>
                        <SelectItem value="SENIOR_LECTURER">Senior Lecturer</SelectItem>
                        <SelectItem value="ASSISTANT_PROFESSOR">Assistant Professor</SelectItem>
                        <SelectItem value="ASSOCIATE_PROFESSOR">Associate Professor</SelectItem>
                        <SelectItem value="PROFESSOR">Professor</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.designation && <p className="text-xs font-medium text-red-500">{errors.designation.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-slate-700">Employment Type</label>
                <Controller
                  name="employmentType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger className={errors.employmentType ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FULL_TIME">Full Time</SelectItem>
                        <SelectItem value="PART_TIME">Part Time</SelectItem>
                        <SelectItem value="VISITING">Visiting</SelectItem>
                        <SelectItem value="CONTRACTUAL">Contractual</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.employmentType && <p className="text-xs font-medium text-red-500">{errors.employmentType.message}</p>}
              </div>
            </div>

            <Input
              label="Joining Date"
              type="date"
              {...register('joiningDate')}
              error={errors.joiningDate?.message}
            />
          </div>
        </div>

        {/* Academic Profile */}
        <div className="space-y-6 md:col-span-2 lg:col-span-1">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Academic Profile</h3>
          <div className="space-y-4">
            <Input
              label="Highest Qualification"
              placeholder="e.g., Ph.D. in Computer Science"
              {...register('highestQualification')}
              error={errors.highestQualification?.message}
            />
            <Input
              label="Specialization"
              placeholder="e.g., Artificial Intelligence, Cyber Security"
              {...register('specialization')}
              error={errors.specialization?.message}
            />
            
            {initialData && (
              <label className="flex items-center space-x-3 cursor-pointer pt-4">
                <input
                  type="checkbox"
                  {...register('isActive')}
                  className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-slate-700">Faculty Account is Active</span>
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t pt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/faculties')}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Faculty' : 'Enroll Faculty'}
        </Button>
      </div>
    </form>
  );
};
