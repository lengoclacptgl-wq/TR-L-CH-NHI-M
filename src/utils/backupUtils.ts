import { Student, TodoItem, ClassInfo, CriteriaItem, AttendanceRecord, AppBackupData } from '../types';
import { toDisplayDate, toISODate } from './dateUtils';

export function createExportBackup(
  classInfo: ClassInfo,
  students: Student[],
  todos: TodoItem[],
  criteria: CriteriaItem[],
  attendance: AttendanceRecord
): AppBackupData {
  return {
    version: '1.0',
    exportDate: new Date().toISOString(),
    settings: {
      teacherName: classInfo.teacherName,
      className: classInfo.className,
      schoolName: classInfo.schoolName || 'Trường THPT Trần Quốc Tuấn',
      schoolYear: classInfo.academicYear,
      studentCount: classInfo.studentCount || students.length,
      slogan: classInfo.slogan || '11A13 – ĐOÀN KẾT • TRÁCH NHIỆM • YÊU THƯƠNG • TIẾN BỘ • VƯƠN TỚI THÀNH CÔNG',
      room: classInfo.room || 'Phòng học 11A13'
    },
    students: students.map((s, idx) => ({
      stt: s.stt ?? (idx + 1),
      hoTen: s.name,
      maHocSinh: s.id,
      ngaySinh: toDisplayDate(s.dob),
      gioiTinh: s.gender,
      danToc: s.danToc || '',
      to: s.group,
      chucVu: s.role,
      sdt: s.parentPhone || '',
      ghiChu: s.notes || ''
    })),
    attendance: attendance || {},
    emulationLogs: [],
    criteria: criteria || [],
    remarks: [],
    meetings: {},
    tasks: todos.map(t => ({
      id: t.id,
      title: t.content,
      dueDate: t.dueDate,
      priority: t.priority,
      status: t.completed ? 'completed' : 'pending',
      notes: t.notes || ''
    }))
  };
}

export function parseImportBackup(jsonData: any): {
  classInfo?: ClassInfo;
  students?: Student[];
  todos?: TodoItem[];
  criteria?: CriteriaItem[];
  attendance?: AttendanceRecord;
} {
  const result: {
    classInfo?: ClassInfo;
    students?: Student[];
    todos?: TodoItem[];
    criteria?: CriteriaItem[];
    attendance?: AttendanceRecord;
  } = {};

  if (!jsonData || typeof jsonData !== 'object') {
    throw new Error('Dữ liệu JSON không hợp lệ.');
  }

  // Parse Settings
  if (jsonData.settings) {
    result.classInfo = {
      className: jsonData.settings.className || '11A13',
      academicYear: jsonData.settings.schoolYear || jsonData.settings.academicYear || '2026 - 2027',
      teacherName: jsonData.settings.teacherName || 'GVCN: Lê Ngọc Lạc',
      schoolName: jsonData.settings.schoolName || 'Trường THPT Trần Quốc Tuấn',
      studentCount: jsonData.settings.studentCount || (jsonData.students ? jsonData.students.length : 39),
      slogan: jsonData.settings.slogan || '11A13 – ĐOÀN KẾT • TRÁCH NHIỆM • YÊU THƯƠNG • TIẾN BỘ • VƯƠN TỚI THÀNH CÔNG',
      room: jsonData.settings.room || 'Phòng học 11A13'
    };
  }

  // Parse Students
  if (Array.isArray(jsonData.students)) {
    result.students = jsonData.students.map((item: any, idx: number) => {
      const id = item.maHocSinh || item.id || `HS${String(idx + 1).padStart(3, '0')}`;
      const name = item.hoTen || item.name || `Học sinh ${idx + 1}`;
      const gender = (item.gioiTinh === 'Nữ' || item.gender === 'Nữ') ? 'Nữ' : 'Nam';
      const rawDob = item.ngaySinh || item.dob || '2010-01-01';
      const dob = toISODate(rawDob);
      const danToc = item.danToc || (item.dan_toc ? item.dan_toc : '');
      const group = (item.to || item.group || 'Tổ 1') as 'Tổ 1' | 'Tổ 2' | 'Tổ 3' | 'Tổ 4';
      const role = item.chucVu || item.role || 'Học sinh';
      const parentPhone = item.sdt || item.parentPhone || '';
      const notes = item.ghiChu || item.notes || '';

      return {
        stt: item.stt ?? (idx + 1),
        id,
        name,
        gender,
        dob,
        danToc,
        group,
        role,
        parentPhone: parentPhone || undefined,
        notes: notes || undefined,
        attendanceStatus: 'Có mặt'
      } as Student;
    });
  }

  // Parse Tasks / Todos
  if (Array.isArray(jsonData.tasks)) {
    result.todos = jsonData.tasks.map((t: any, idx: number) => ({
      id: t.id || `td-${idx + 1}`,
      content: t.title || t.content || 'Công việc',
      dueDate: t.dueDate,
      completed: t.status === 'completed' || t.completed === true,
      priority: (t.priority === 'high' || t.priority === 'low') ? t.priority : 'medium',
      notes: t.notes || ''
    }));
  } else if (Array.isArray(jsonData.todos)) {
    result.todos = jsonData.todos;
  }

  // Parse Criteria
  if (Array.isArray(jsonData.criteria)) {
    result.criteria = jsonData.criteria;
  }

  // Parse Attendance
  if (jsonData.attendance && typeof jsonData.attendance === 'object') {
    result.attendance = jsonData.attendance;
  }

  return result;
}
