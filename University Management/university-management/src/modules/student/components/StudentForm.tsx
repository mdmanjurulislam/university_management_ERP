import React, { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { studentSchema } from '../schemas/student.schema';
import type { StudentFormData } from '../schemas/student.schema';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/components/ui/Select';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Student } from '../types';
import { useDepartments } from '../../department/hooks/useDepartments';
import { useSemesters } from '../../semester/hooks/useSemesters';

interface StudentFormProps {
  initialData?: Student;
  onSubmit: (data: StudentFormData) => void;
  isLoading: boolean;
}

export const StudentForm: React.FC<StudentFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const navigate = useNavigate();
  const { departments, isLoading: isLoadingDepartments } = useDepartments();
  const { data: semesters, isLoading: isLoadingSemesters } = useSemesters();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema) as any,
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      gender: '',
      bloodGroup: '',
      dateOfBirth: '',
      address: '',
      guardianName: '',
      guardianPhone: '',
      batchYear: new Date().getFullYear(),
      departmentId: undefined,
      semesterId: undefined,
      admissionDate: new Date().toISOString().split('T')[0],
      isActive: true,
    },
  });

  const selectedSemesterId = watch('semesterId');

  const selectedSemester = useMemo(() => {
    return semesters?.find(s => s.id === selectedSemesterId);
  }, [semesters, selectedSemesterId]);

  const registrationStatus = useMemo(() => {
    if (!selectedSemester) return null;
    const now = new Date();
    const start = new Date(selectedSemester.registrationStartDate);
    const end = new Date(selectedSemester.registrationEndDate);
    
    // Set hours to cover the whole day of end date
    end.setHours(23, 59, 59, 999);
    
    if (now < start) return 'UPCOMING';
    if (now > end) return 'CLOSED';
    return 'OPEN';
  }, [selectedSemester]);

  useEffect(() => {
    if (initialData) {
      reset({
        fullName: initialData.fullName,
        email: initialData.email,
        phone: initialData.phone,
        gender: initialData.gender,
        bloodGroup: initialData.bloodGroup,
        dateOfBirth: initialData.dateOfBirth.split('T')[0],
        address: initialData.address,
        guardianName: initialData.guardianName,
        guardianPhone: initialData.guardianPhone,
        batchYear: initialData.batchYear,
        departmentId: initialData.departmentId,
        semesterId: initialData.semesterId,
        admissionDate: initialData.admissionDate ? initialData.admissionDate.split('T')[0] : '',
        isActive: initialData.isActive,
      });
    }
  }, [initialData, reset]);

  const isRegistrationClosed = registrationStatus === 'CLOSED' || registrationStatus === 'UPCOMING';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="space-y-6 md:col-span-2 lg:col-span-1">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Personal Information</h3>
          <div className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g., John Doe"
              {...register('fullName')}
              error={errors.fullName?.message}
            />
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
                label="Batch Year"
                type="number"
                {...register('batchYear')}
                error={errors.batchYear?.message}
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
              placeholder="student@example.com"
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
              label="Current Address"
              placeholder="Full physical address"
              {...register('address')}
              error={errors.address?.message}
            />
          </div>
        </div>

        {/* Academic Details */}
        <div className="space-y-6 md:col-span-2 lg:col-span-1">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Academic Placement</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-slate-700">Department</label>
              <Controller
                name="departmentId"
                control={control}
                render={({ field }) => (
                  <Select 
                    onValueChange={(val) => field.onChange(Number(val))} 
                    value={field.value?.toString() || ""}
                    disabled={isLoadingDepartments}
                  >
                    <SelectTrigger className={errors.departmentId ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept: any) => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {dept.departmentName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.departmentId && <p className="text-xs font-medium text-red-500">{errors.departmentId.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-slate-700">Semester</label>
                <Controller
                  name="semesterId"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      onValueChange={(val) => field.onChange(Number(val))} 
                      value={field.value?.toString() || ""}
                      disabled={isLoadingSemesters}
                    >
                      <SelectTrigger className={errors.semesterId ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters?.map((sem: any) => (
                          <SelectItem key={sem.id} value={sem.id.toString()}>
                            {sem.semesterName} {sem.year} {sem.isCurrentSemester ? '(Current)' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.semesterId && <p className="text-xs font-medium text-red-500">{errors.semesterId.message}</p>}
              </div>

              <Input
                label="Admission Date"
                type="date"
                {...register('admissionDate')}
                error={errors.admissionDate?.message}
              />
            </div>

            {/* Validation UI for Semester Registration */}
            {selectedSemester && (
              <div className={`p-4 rounded-xl border ${registrationStatus === 'OPEN' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                <div className="flex items-center gap-2 font-medium">
                  {registrationStatus === 'OPEN' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span>
                    Registration is {registrationStatus === 'OPEN' ? 'Open' : registrationStatus === 'CLOSED' ? 'Closed' : 'Upcoming'}
                  </span>
                </div>
                <p className="text-sm mt-1 opacity-90">
                  {registrationStatus === 'OPEN' 
                    ? 'Student can be enrolled in this semester.' 
                    : `Registration period was ${new Date(selectedSemester.registrationStartDate).toLocaleDateString()} to ${new Date(selectedSemester.registrationEndDate).toLocaleDateString()}.`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Guardian Information */}
        <div className="space-y-6 md:col-span-2 lg:col-span-1">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Guardian Information</h3>
          <div className="space-y-4">
            <Input
              label="Guardian Name"
              placeholder="e.g., Jane Doe"
              {...register('guardianName')}
              error={errors.guardianName?.message}
            />
            <Input
              label="Guardian Phone"
              placeholder="+1234567890"
              {...register('guardianPhone')}
              error={errors.guardianPhone?.message}
            />
            
            {initialData && (
              <label className="flex items-center space-x-3 cursor-pointer pt-4">
                <input
                  type="checkbox"
                  {...register('isActive')}
                  className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-slate-700">Student Account is Active</span>
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t pt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/students')}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || isRegistrationClosed} 
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Student' : 'Enroll Student'}
        </Button>
      </div>
    </form>
  );
};
