import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/components/ui/Select';
import { useDepartments } from '../hooks/useDepartments';

interface DepartmentSelectProps {
  value?: string | number;
  onChange: (value: number) => void;
  error?: string;
  disabled?: boolean;
}

export const DepartmentSelect: React.FC<DepartmentSelectProps> = ({ value, onChange, error, disabled }) => {
  const { departments, isLoading, isError } = useDepartments();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none text-slate-700">Department</label>
      <Select 
        onValueChange={(val) => onChange(Number(val))} 
        value={value?.toString() || ""}
        disabled={isLoading || disabled || isError}
      >
        <SelectTrigger className={error ? 'border-red-500' : ''}>
          <SelectValue placeholder={isLoading ? "Loading departments..." : isError ? "Failed to load departments" : "Select Department"} />
        </SelectTrigger>
        <SelectContent>
          {departments?.map((dept: any) => (
            <SelectItem key={dept.id} value={dept.id.toString()}>
              {dept.departmentName} ({dept.departmentCode})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
};
