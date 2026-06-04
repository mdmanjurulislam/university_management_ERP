import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';
import { departmentSchema, type DepartmentFormData } from '../schemas/department.schema';
import type { Department } from '../types/department.types';

interface DepartmentFormProps {
  initialData?: Department | null;
  onSubmit: (data: DepartmentFormData) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export function DepartmentForm({ initialData, onSubmit, isLoading, onCancel }: DepartmentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      departmentCode: '',
      departmentName: '',
      description: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        departmentCode: initialData.departmentCode,
        departmentName: initialData.departmentName,
        shortName: initialData.shortName,
        description: initialData.description,
      });
    } else {
      reset({
        departmentCode: '',
        departmentName: '',
        shortName: '',
        description: '',
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Department Code
          </label>
          <Input
            {...register('departmentCode')}
            placeholder="e.g. CSE"
            error={errors.departmentCode?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Department Name
          </label>
          <Input
            {...register('departmentName')}
            placeholder="e.g. Computer Science and Engineering"
            error={errors.departmentName?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Short Name
          </label>
          <Input
            {...register('shortName')}
            placeholder="e.g. Computer Science and Engineering"
            error={errors.shortName?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          {/* Note: since there isn't a Textarea component in shared UI, using a basic text area for description, styled similarly to Input */}
          <textarea
            {...register('description')}
            placeholder="Enter department description"
            rows={3}
            className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
              errors.description ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Department' : 'Create Department'}
        </Button>
      </div>
    </form>
  );
}
