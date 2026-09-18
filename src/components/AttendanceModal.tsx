import React, { useState } from 'react';
import { Student, AttendanceRecord } from '../types';
import { X, CheckCircle2, UserX, Clock, CheckCheck, Save, Calendar, Search } from 'lucide-react';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  attendanceRecord?: AttendanceRecord;
  onSaveAttendance: (updatedStudents: Student[], date: string) => void;
}

export const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isOpen,
  onClose,
  students,
  attendanceRecord,
  onSaveAttendance,
}) => {
  // Default to today or 2026-09-06
  const [selectedDate, setSelectedDate] = useState('2026-09-06');
  const [localStudents, setLocalStudents] = useState<Student[]>(students);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState<'all' | 'Tổ 1' | 'Tổ 2' | 'Tổ 3' | 'Tổ 4'>('all');

  // When opening or date changes, load attendance for that date
  React.useEffect(() => {
    if (isOpen) {
      if (attendanceRecord && attendanceRecord[selectedDate]) {
        const dayRecord = attendanceRecord[selectedDate];
        setLocalStudents(
          students.map(s => {
            const entry = dayRecord[s.id];
            let status: Student['attendanceStatus'] = 'Có mặt';
            if (entry) {
              if (entry.status === 'present') status = 'Có mặt';
              else if (entry.status === 'absent_excused') status = 'Vắng phép';
              else if (entry.status === 'absent_unexcused') status = 'Vắng không phép';
              else if (entry.status === 'late') status = 'Đi trễ';
            }
            return {
              ...s,
              attendanceStatus: status
            };
          })
        );
      } else {
        setLocalStudents(students);
      }
    }
  }, [isOpen, selectedDate, students, attendanceRecord]);

  if (!isOpen) return null;

  const handleStatusChange = (id: string, status: 'Có mặt' | 'Vắng phép' | 'Vắng không phép' | 'Đi trễ') => {
    setLocalStudents(prev =>
      prev.map(s => s.id === id ? { ...s, attendanceStatus: status } : s)
    );
  };

  const handleMarkAllPresent = () => {
    setLocalStudents(prev =>
      prev.map(s => ({ ...s, attendanceStatus: 'Có mặt' }))
    );
  };

  const handleSave = () => {
    onSaveAttendance(localStudents, selectedDate);
    onClose();
  };

  const presentCount = localStudents.filter(s => (s.attendanceStatus || 'Có mặt') === 'Có mặt').length;
  const absentWithPermission = localStudents.filter(s => s.attendanceStatus === 'Vắng phép').length;
  const absentWithoutPermission = localStudents.filter(s => s.attendanceStatus === 'Vắng không phép').length;
  const lateCount = localStudents.filter(s => s.attendanceStatus === 'Đi trễ').length;

  const filteredLocalStudents = localStudents.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = groupFilter === 'all' || s.group === groupFilter;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#2c3e50] text-white p-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base md:text-lg">Sổ Điểm Danh Sĩ Số Lớp Học</h3>
            <p className="text-xs text-slate-300">
              Quản lý chuyên cần hàng ngày • Sĩ số: {students.length} học sinh
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Date Selector & Search */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <Calendar className="w-4 h-4 text-[#3498db]" />
              Ngày điểm danh:
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-1.5 border border-slate-300 rounded bg-white text-xs font-semibold outline-none focus:border-[#3498db]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              aria-label="Lọc theo Tổ"
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value as any)}
              className="p-1.5 border border-slate-300 rounded bg-white text-xs outline-none"
            >
              <option value="all">Tất cả các Tổ</option>
              <option value="Tổ 1">Tổ 1</option>
              <option value="Tổ 2">Tổ 2</option>
              <option value="Tổ 3">Tổ 3</option>
              <option value="Tổ 4">Tổ 4</option>
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm học sinh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 pr-2 py-1.5 border border-slate-300 rounded bg-white text-xs outline-none focus:border-[#3498db]"
              />
            </div>
          </div>
        </div>

        {/* Quick summary bar */}
        <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Có mặt: {presentCount}
            </span>
            <span className="text-blue-700 font-semibold flex items-center gap-1">
              <UserX className="w-3.5 h-3.5" /> Vắng phép: {absentWithPermission}
            </span>
            <span className="text-rose-700 font-semibold flex items-center gap-1">
              <UserX className="w-3.5 h-3.5" /> Không phép: {absentWithoutPermission}
            </span>
            <span className="text-amber-700 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Đi trễ: {lateCount}
            </span>
          </div>

          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium cursor-pointer transition-colors text-xs"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Tất cả có mặt
          </button>
        </div>

        {/* List of students for attendance */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100 text-xs">
          {filteredLocalStudents.map((student, idx) => {
            const currentStatus = student.attendanceStatus || 'Có mặt';

            return (
              <div
                key={student.id}
                className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/80 px-2 rounded transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[11px] font-bold text-slate-400 w-6 text-center shrink-0">
                    {student.stt ?? (idx + 1)}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 truncate">
                        {student.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                        {student.group}
                      </span>
                      {student.danToc && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-amber-50 text-amber-800 rounded">
                          {student.danToc}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {student.id}
                    </span>
                  </div>
                </div>

                {/* Status selector buttons */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(student.id, 'Có mặt')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors border ${
                      currentStatus === 'Có mặt'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Có mặt
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(student.id, 'Vắng phép')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors border ${
                      currentStatus === 'Vắng phép'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Có phép
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(student.id, 'Vắng không phép')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors border ${
                      currentStatus === 'Vắng không phép'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Không phép
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(student.id, 'Đi trễ')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors border ${
                      currentStatus === 'Đi trễ'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Đi trễ
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Dữ liệu điểm danh ngày <strong className="text-slate-800">{selectedDate}</strong> sẽ được lưu vào hệ thống.
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded cursor-pointer transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#27ae60] hover:bg-[#219653] text-white text-xs font-semibold rounded cursor-pointer transition-colors shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              Lưu điểm danh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
