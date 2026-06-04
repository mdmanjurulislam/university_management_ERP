import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { semesterSchema } from '../schemas/semester.schema';
import type { SemesterFormData } from '../schemas/semester.schema';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/components/ui/Select';
import type { Semester } from '../types';

interface SemesterFormProps {
  initialData?: Semester;
  onSubmit: (data: SemesterFormData) => void;
  isLoading: boolean;
}

export const SemesterForm: React.FC<SemesterFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SemesterFormData>({
    resolver: zodResolver(semesterSchema) as any,
    defaultValues: {
      semesterCode: '',
      semesterName: '',
      year: new Date().getFullYear(),
      startDate: '',
      endDate: '',
      registrationStartDate: '',
      registrationEndDate: '',
      resultPublishDate: '',
      isCurrentSemester: false,
      isActive: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        semesterCode: initialData.semesterCode,
        semesterName: initialData.semesterName,
        year: initialData.year,
        startDate: initialData.startDate.split('T')[0],
        endDate: initialData.endDate.split('T')[0],
        registrationStartDate: initialData.registrationStartDate.split('T')[0],
        registrationEndDate: initialData.registrationEndDate.split('T')[0],
        resultPublishDate: initialData.resultPublishDate.split('T')[0],
        isCurrentSemester: initialData.isCurrentSemester,
        isActive: initialData.isActive,
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Semester Details */}
        <div className="space-y-6 md:col-span-2">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-slate-700">Semester Name</label>
              <Controller
                name="semesterName"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={errors.semesterName ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SPRING">Spring</SelectItem>
                      <SelectItem value="SUMMER">Summer</SelectItem>
                      <SelectItem value="FALL">Fall</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.semesterName && <p className="text-xs font-medium text-red-500">{errors.semesterName.message}</p>}
            </div>

            <Input
              label="Year"
              type="number"
              {...register('year')}
              error={errors.year?.message}
            />

            <Input
              label="Semester Code"
              placeholder="e.g., 20261"
              {...register('semesterCode')}
              error={errors.semesterCode?.message}
            />
          </div>
        </div>

        {/* Academic Timeline */}
        <div className="space-y-6 md:col-span-1">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Academic Timeline</h3>
          <div className="space-y-4">
            <Input
              label="Start Date"
              type="date"
              {...register('startDate')}
              error={errors.startDate?.message}
            />
            <Input
              label="End Date"
              type="date"
              {...register('endDate')}
              error={errors.endDate?.message}
            />
            <Input
              label="Result Publish Date"
              type="date"
              {...register('resultPublishDate')}
              error={errors.resultPublishDate?.message}
            />
          </div>
        </div>

        {/* Registration Timeline */}
        <div className="space-y-6 md:col-span-1">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Registration Timeline</h3>
          <div className="space-y-4">
            <Input
              label="Registration Start Date"
              type="date"
              {...register('registrationStartDate')}
              error={errors.registrationStartDate?.message}
            />
            <Input
              label="Registration End Date"
              type="date"
              {...register('registrationEndDate')}
              error={errors.registrationEndDate?.message}
            />
          </div>
        </div>

        {/* Status Settings */}
        <div className="space-y-6 md:col-span-2">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Status Settings</h3>
          <div className="flex gap-8">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('isCurrentSemester')}
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-slate-700">Set as Current Semester</span>
            </label>
            
            {initialData && (
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isActive')}
                  className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-slate-700">Active Status</span>
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t pt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/administration/semesters')}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
          {isLoading ? 'Saving...' : initialData ? 'Update Semester' : 'Create Semester'}
        </Button>
      </div>
    </form>
  );
};
