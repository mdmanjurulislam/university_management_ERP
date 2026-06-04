export interface CreatedBy {
  userId: number;
  firstName: string;
  lastName: string;
  userName: string;
  role: string;
}

export interface Semester {
  id: number;
  semesterCode: string;
  semesterName: string;
  year: number;
  startDate: string;
  endDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  resultPublishDate: string;
  isCurrentSemester: boolean;
  isActive: boolean;
  createdBy: CreatedBy;
  createdAt: string;
  updatedBy: CreatedBy | null;
  updatedAt: string | null;
}

export interface CreateSemesterDto {
  semesterCode: string;
  semesterName: string;
  year: number;
  startDate: string;
  endDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  resultPublishDate: string;
  isCurrentSemester: boolean;
}

export interface UpdateSemesterDto extends Partial<CreateSemesterDto> {
  isActive?: boolean;
}

export interface ApiResponse<T> {
  message: string;
  code: number;
  response: T;
}
