export type Gender = 'Nam' | 'Nữ';

export type StudentRole = 
  | 'Học sinh'
  | 'Thành viên'
  | 'Lớp trưởng'
  | 'Lớp phó học tập'
  | 'Lớp phó kỷ luật'
  | 'Lớp phó văn thể mỹ'
  | 'Lớp phó lao động'
  | 'Bí thư chi đoàn'
  | 'Phó bí thư'
  | 'Thủ quỹ'
  | 'Tổ trưởng Tổ 1'
  | 'Tổ trưởng Tổ 2'
  | 'Tổ trưởng Tổ 3'
  | 'Tổ trưởng Tổ 4';

export interface Student {
  stt?: number;
  id: string; // e.g. "64000738-00-5064" or "HS001"
  name: string; // e.g. "RAH LAN H' AN"
  gender: Gender;
  dob: string; // "YYYY-MM-DD" or "DD/MM/YYYY"
  danToc?: string; // e.g. "Gia-rai", "Kinh", "Ê-đê", "Tày"
  role: StudentRole | string;
  group: 'Tổ 1' | 'Tổ 2' | 'Tổ 3' | 'Tổ 4';
  parentPhone?: string;
  address?: string;
  notes?: string;
  attendanceStatus?: 'Có mặt' | 'Vắng phép' | 'Vắng không phép' | 'Đi trễ';
}

export interface TodoItem {
  id: string;
  content: string;
  dueDate?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface ClassInfo {
  className: string;
  academicYear: string;
  teacherName: string;
  schoolName?: string;
  studentCount?: number;
  slogan?: string;
  room?: string;
}

export interface CriteriaItem {
  id: string;
  name: string;
  type: 'plus' | 'minus';
  points: number;
}

export interface AttendanceRecord {
  [date: string]: {
    [studentId: string]: {
      status: 'present' | 'absent_excused' | 'absent_unexcused' | 'late' | string;
      note?: string;
    };
  };
}

export interface AppBackupData {
  version: string;
  exportDate: string;
  settings: {
    teacherName: string;
    className: string;
    schoolName: string;
    schoolYear: string;
    studentCount?: number;
    slogan?: string;
    room?: string;
  };
  students: Array<{
    stt?: number;
    hoTen: string;
    maHocSinh: string;
    ngaySinh: string;
    gioiTinh: string;
    danToc?: string;
    to: string;
    chucVu: string;
    sdt?: string;
    ghiChu?: string;
  }>;
  attendance?: AttendanceRecord;
  emulationLogs?: any[];
  criteria?: CriteriaItem[];
  remarks?: any[];
  meetings?: Record<string, any>;
  tasks?: Array<{
    id: string;
    title: string;
    dueDate?: string;
    priority?: 'low' | 'medium' | 'high' | string;
    status?: 'completed' | 'in_progress' | 'pending' | string;
    notes?: string;
  }>;
}
