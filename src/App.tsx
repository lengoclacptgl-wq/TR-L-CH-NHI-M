import React, { useState, useEffect } from 'react';
import { Student, TodoItem, ClassInfo, CriteriaItem, AttendanceRecord } from './types';
import { initialClassInfo, initialStudents, initialTodos, initialCriteria, initialAttendance } from './data/initialData';
import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import { StudentTable } from './components/StudentTable';
import { StudentForm } from './components/StudentForm';
import { TodoList } from './components/TodoList';
import { StudentDetailModal } from './components/StudentDetailModal';
import { AttendanceModal } from './components/AttendanceModal';
import { ClassInfoModal } from './components/ClassInfoModal';
import { BackupRestoreModal } from './components/BackupRestoreModal';
import { CriteriaModal } from './components/CriteriaModal';
import { CheckCircle2, Printer, Sparkles } from 'lucide-react';
import { toDisplayDate } from './utils/dateUtils';

const STORAGE_KEYS = {
  STUDENTS: 'qll_students_v1',
  TODOS: 'qll_todos_v1',
  CLASS_INFO: 'qll_class_info_v1',
  CRITERIA: 'qll_criteria_v1',
  ATTENDANCE: 'qll_attendance_v1',
};

export default function App() {
  // Load state from localStorage or fallback to initial data
  const [classInfo, setClassInfo] = useState<ClassInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLASS_INFO);
      return saved ? JSON.parse(saved) : initialClassInfo;
    } catch {
      return initialClassInfo;
    }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : initialStudents;
    } catch {
      return initialStudents;
    }
  });

  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TODOS);
      return saved ? JSON.parse(saved) : initialTodos;
    } catch {
      return initialTodos;
    }
  });

  const [criteria, setCriteria] = useState<CriteriaItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CRITERIA);
      return saved ? JSON.parse(saved) : initialCriteria;
    } catch {
      return initialCriteria;
    }
  });

  const [attendance, setAttendance] = useState<AttendanceRecord>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      return saved ? JSON.parse(saved) : initialAttendance;
    } catch {
      return initialAttendance;
    }
  });

  // UI state
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isClassInfoOpen, setIsClassInfoOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isCriteriaOpen, setIsCriteriaOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLASS_INFO, JSON.stringify(classInfo));
    } catch (e) {
      console.error('Error saving class info to localStorage', e);
    }
  }, [classInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error('Error saving students to localStorage', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
    } catch (e) {
      console.error('Error saving todos to localStorage', e);
    }
  }, [todos]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CRITERIA, JSON.stringify(criteria));
    } catch (e) {
      console.error('Error saving criteria to localStorage', e);
    }
  }, [criteria]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
    } catch (e) {
      console.error('Error saving attendance to localStorage', e);
    }
  }, [attendance]);

  // Toast notification helper
  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Next suggested student ID (e.g. 64000738-00-5263 or HS039)
  const getNextSuggestedId = () => {
    const existing = students.find(s => s.id.includes('-'));
    if (existing) {
      const nums = students
        .map(s => {
          const match = s.id.match(/\d+$/);
          return match ? parseInt(match[0], 10) : 0;
        })
        .filter(n => !isNaN(n));
      const maxNum = nums.length > 0 ? Math.max(...nums) : 5262;
      return `64000738-00-${maxNum + 1}`;
    }
    return `HS${String(students.length + 1).padStart(3, '0')}`;
  };

  // Save student (Add new or Update existing)
  const handleSaveStudent = (studentData: Student, isNew: boolean) => {
    if (isNew) {
      // Check for duplicate ID
      const exists = students.some(s => s.id.toUpperCase() === studentData.id.toUpperCase());
      if (exists) {
        showToast(`Mã học sinh "${studentData.id}" đã tồn tại trong danh sách!`, 'info');
        return;
      }
      setStudents(prev => [...prev, studentData]);
      showToast(`Đã thêm học sinh ${studentData.name} vào danh sách!`);
    } else {
      setStudents(prev =>
        prev.map(s => (s.id === studentData.id ? studentData : s))
      );
      setEditingStudent(null);
      showToast(`Đã cập nhật thông tin học sinh ${studentData.name}!`);
    }
  };

  // Delete student
  const handleDeleteStudent = (id: string) => {
    const target = students.find(s => s.id === id);
    if (!target) return;

    if (window.confirm(`Bạn có chắc chắn muốn xóa học sinh "${target.name}" (${target.id}) khỏi danh sách lớp?`)) {
      setStudents(prev => prev.filter(s => s.id !== id));
      if (editingStudent?.id === id) {
        setEditingStudent(null);
      }
      showToast(`Đã xóa học sinh ${target.name}!`, 'info');
    }
  };

  // Todo handlers
  const handleToggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTodo = (
    content: string,
    dueDate?: string,
    priority: 'low' | 'medium' | 'high' = 'medium',
    notes?: string
  ) => {
    const newTodo: TodoItem = {
      id: `td-${Date.now()}`,
      content,
      dueDate,
      priority,
      completed: false,
      notes
    };
    setTodos(prev => [newTodo, ...prev]);
    showToast('Đã thêm ghi chú nhắc nhở mới!');
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  // Attendance handlers
  const handleSaveAttendance = (updatedStudents: Student[], date: string) => {
    setStudents(updatedStudents);
    // Also store date map
    setAttendance(prev => {
      const dayRecord: { [studentId: string]: { status: 'present' | 'absent_excused' | 'absent_unexcused' | 'late'; note?: string } } = {};
      updatedStudents.forEach(s => {
        let status: 'present' | 'absent_excused' | 'absent_unexcused' | 'late' = 'present';
        if (s.attendanceStatus === 'Vắng phép') status = 'absent_excused';
        else if (s.attendanceStatus === 'Vắng không phép') status = 'absent_unexcused';
        else if (s.attendanceStatus === 'Đi trễ') status = 'late';
        dayRecord[s.id] = { status, note: '' };
      });
      return {
        ...prev,
        [date]: dayRecord
      };
    });
    showToast(`Đã lưu dữ liệu điểm danh ngày ${toDisplayDate(date)} thành công!`);
  };

  // Reset to initial demo data
  const handleResetData = () => {
    if (window.confirm('Bạn có muốn khôi phục lại dữ liệu gốc của Lớp 11A13 (THPT Trần Quốc Tuấn) không?')) {
      setStudents(initialStudents);
      setTodos(initialTodos);
      setClassInfo(initialClassInfo);
      setCriteria(initialCriteria);
      setAttendance(initialAttendance);
      setEditingStudent(null);
      showToast('Đã khôi phục dữ liệu gốc của lớp 11A13!');
    }
  };

  // Restore data from JSON backup
  const handleRestoreData = (data: {
    classInfo?: ClassInfo;
    students?: Student[];
    todos?: TodoItem[];
    criteria?: CriteriaItem[];
    attendance?: AttendanceRecord;
  }) => {
    if (data.classInfo) setClassInfo(data.classInfo);
    if (data.students) setStudents(data.students);
    if (data.todos) setTodos(data.todos);
    if (data.criteria) setCriteria(data.criteria);
    if (data.attendance) setAttendance(data.attendance);
    showToast('Đã khôi phục toàn bộ dữ liệu từ tệp sao lưu JSON!');
  };

  // Export CSV with UTF-8 BOM
  const handleExportCSV = () => {
    const headers = [
      'STT',
      'Mã Học Sinh',
      'Họ và Tên',
      'Giới tính',
      'Dân tộc',
      'Ngày sinh',
      'Tổ',
      'Chức vụ',
      'Số Điện Thoại Phụ Huynh',
      'Địa chỉ thường trú',
      'Trạng thái điểm danh',
      'Ghi chú'
    ];

    const rows = students.map((s, idx) => [
      s.stt ?? (idx + 1),
      s.id,
      `"${s.name.replace(/"/g, '""')}"`,
      s.gender,
      `"${(s.danToc || '').replace(/"/g, '""')}"`,
      toDisplayDate(s.dob),
      `"${s.group}"`,
      `"${s.role}"`,
      s.parentPhone ? `"${s.parentPhone}"` : '""',
      `"${(s.address || '').replace(/"/g, '""')}"`,
      `"${s.attendanceStatus || 'Có mặt'}"`,
      `"${(s.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvString = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeClassName = classInfo.className.replace(/\s+/g, '_');
    const safeYear = classInfo.academicYear.replace(/[\s-]+/g, '_');
    link.download = `Danh_Sach_Lop_${safeClassName}_${safeYear}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Đã xuất danh sách lớp ra file Excel/CSV thành công!');
  };

  // Trigger browser print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#eef2f3] text-[#333]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-[#2c3e50] text-white px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-[#2ecc71]" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <Header
        classInfo={classInfo}
        onEditClassInfo={() => setIsClassInfoOpen(true)}
        onOpenAttendance={() => setIsAttendanceOpen(true)}
        onOpenCriteria={() => setIsCriteriaOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
        onExportCSV={handleExportCSV}
        onResetData={handleResetData}
      />

      {/* Class Slogan Banner */}
      {classInfo.slogan && (
        <div className="bg-linear-to-r from-[#2c3e50] via-[#1f3a52] to-[#2c3e50] text-amber-300 py-2 px-4 shadow-xs text-center border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs font-bold tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{classInfo.slogan}</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="container max-w-7xl w-full mx-auto my-6 px-4 flex-1">
        {/* Quick Dashboard Cards */}
        <DashboardStats students={students} studentCountTarget={classInfo.studentCount} />

        {/* Action strip with print and quick hints */}
        <div className="flex items-center justify-between mb-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Sổ chủ nhiệm số điện tử</span>
            <span>•</span>
            <span className="text-emerald-700 font-medium">Tự động sao lưu trên trình duyệt</span>
            <span>•</span>
            <span className="text-slate-600 font-semibold">{classInfo.schoolName || 'THPT Trần Quốc Tuấn'}</span>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1 text-slate-600 hover:text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-200 shadow-2xs hover:bg-slate-50 cursor-pointer transition-colors"
            title="In danh sách lớp ra giấy hoặc PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            In danh sách
          </button>
        </div>

        {/* Main Content: Left Column (Table, 2fr) & Right Column (Form & To-dos, 1fr) */}
        <div className="main-content grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Column (Table, 2 cols in desktop) */}
          <div className="left-column lg:col-span-2 space-y-5">
            <StudentTable
              students={students}
              onEditStudent={(s) => {
                setEditingStudent(s);
                window.scrollTo({ top: 350, behavior: 'smooth' });
              }}
              onDeleteStudent={handleDeleteStudent}
              onViewStudent={(s) => setViewingStudent(s)}
            />
          </div>

          {/* Right Column (Form & To-dos, 1 col) */}
          <div className="right-column lg:col-span-1 space-y-5">
            {/* Student Add / Edit Form */}
            <StudentForm
              editingStudent={editingStudent}
              onSaveStudent={handleSaveStudent}
              onCancelEdit={() => setEditingStudent(null)}
              nextSuggestedId={getNextSuggestedId()}
            />

            {/* Homeroom Teacher Todo & Reminders */}
            <TodoList
              todos={todos}
              onToggleTodo={handleToggleTodo}
              onAddTodo={handleAddTodo}
              onDeleteTodo={handleDeleteTodo}
            />
          </div>
        </div>
      </main>

      {/* Student Detail Modal */}
      <StudentDetailModal
        student={viewingStudent}
        onClose={() => setViewingStudent(null)}
        onEdit={(s) => {
          setEditingStudent(s);
          setViewingStudent(null);
        }}
      />

      {/* Attendance Modal */}
      <AttendanceModal
        isOpen={isAttendanceOpen}
        onClose={() => setIsAttendanceOpen(false)}
        students={students}
        attendanceRecord={attendance}
        onSaveAttendance={handleSaveAttendance}
      />

      {/* Class Info Modal */}
      <ClassInfoModal
        isOpen={isClassInfoOpen}
        onClose={() => setIsClassInfoOpen(false)}
        classInfo={classInfo}
        onSaveClassInfo={(info) => {
          setClassInfo(info);
          showToast('Đã cập nhật thông tin lớp học thành công!');
        }}
      />

      {/* Backup & Restore Modal */}
      <BackupRestoreModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        classInfo={classInfo}
        students={students}
        todos={todos}
        criteria={criteria}
        attendance={attendance}
        onRestoreData={handleRestoreData}
      />

      {/* Criteria Modal */}
      <CriteriaModal
        isOpen={isCriteriaOpen}
        onClose={() => setIsCriteriaOpen(false)}
        criteria={criteria}
        onSaveCriteria={(updated) => {
          setCriteria(updated);
          showToast('Đã cập nhật bảng tiêu chí thi đua!');
        }}
      />

      {/* Footer */}
      <footer className="text-center py-4 bg-[#2c3e50] text-white text-xs mt-auto border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            {classInfo.schoolName || 'TRƯỜNG THPT TRẦN QUỐC TUẤN'} • LỚP {classInfo.className} — NĂM HỌC {classInfo.academicYear}
          </p>
          <p className="text-slate-400 text-[11px]">
            {classInfo.teacherName} • {classInfo.room}
          </p>
        </div>
      </footer>
    </div>
  );
}
