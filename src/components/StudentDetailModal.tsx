import React from 'react';
import { Student } from '../types';
import { X, Phone, MapPin, Calendar, Award, Users, FileText, CheckCircle, Edit } from 'lucide-react';
import { toDisplayDate } from '../utils/dateUtils';

interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
  onEdit: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onEdit,
}) => {
  if (!student) return null;

  const isMale = student.gender === 'Nam';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header with Student Name */}
        <div className="bg-[#2c3e50] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base shadow-xs ${
              isMale ? 'bg-teal-600 text-white' : 'bg-pink-600 text-white'
            }`}>
              {student.name.charAt(student.name.lastIndexOf(' ') + 1) || student.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">{student.name}</h3>
              <p className="text-[11px] text-slate-300 font-mono">
                Mã định danh: {student.id} {student.stt ? `• STT: ${student.stt}` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3.5 text-xs">
          {/* Quick Badges */}
          <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-100">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isMale
                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                  : 'bg-pink-50 text-pink-700 border border-pink-200'
              }`}
            >
              {student.gender}
            </span>

            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              Dân tộc: {student.danToc || 'Gia-rai'}
            </span>

            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#3498db] border border-blue-200">
              {student.role}
            </span>

            <span className="px-2.5 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700 font-medium">
              {student.group}
            </span>

            {student.attendanceStatus && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                student.attendanceStatus === 'Có mặt'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : student.attendanceStatus === 'Đi trễ'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {student.attendanceStatus}
              </span>
            )}
          </div>

          {/* Details list */}
          <div className="space-y-3 text-slate-700 text-xs">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Ngày sinh</span>
                <span className="font-semibold text-slate-800">{toDisplayDate(student.dob) || 'Chưa cập nhật'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Điện thoại phụ huynh</span>
                {student.parentPhone ? (
                  <a
                    href={`tel:${student.parentPhone}`}
                    className="font-semibold text-[#3498db] hover:underline font-mono"
                  >
                    {student.parentPhone}
                  </a>
                ) : (
                  <span className="text-slate-400 italic">Chưa cập nhật</span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Địa chỉ thường trú</span>
                <span className="font-medium text-slate-800">
                  {student.address || <span className="text-slate-400 italic">Chưa cập nhật địa chỉ</span>}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Ghi chú của Giáo Viên Chủ Nhiệm</span>
                <p className="font-medium text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200 mt-1 leading-relaxed">
                  {student.notes || 'Chưa có ghi chú đặc biệt cho học sinh này.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-end gap-2">
          <button
            onClick={() => {
              onEdit(student);
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3498db] hover:bg-[#2980b9] text-white text-xs font-semibold rounded cursor-pointer transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            Chỉnh sửa hồ sơ
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded cursor-pointer transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
