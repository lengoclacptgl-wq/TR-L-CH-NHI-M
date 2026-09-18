import React from 'react';
import { ClassInfo } from '../types';
import { School, Calendar, User, Edit3, Download, CheckSquare, RotateCcw, FileJson, Award } from 'lucide-react';

interface HeaderProps {
  classInfo: ClassInfo;
  onEditClassInfo: () => void;
  onOpenAttendance: () => void;
  onOpenCriteria: () => void;
  onOpenBackup: () => void;
  onExportCSV: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  classInfo,
  onEditClassInfo,
  onOpenAttendance,
  onOpenCriteria,
  onOpenBackup,
  onExportCSV,
  onResetData,
}) => {
  return (
    <header className="bg-[#2c3e50] text-white py-4 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Title and Class Details */}
        <div className="text-center lg:text-left">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-1.5">
            <School className="w-6 h-6 text-[#3498db]" />
            <span className="text-xs uppercase font-bold tracking-wider text-sky-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              {classInfo.schoolName || 'Trường THPT Trần Quốc Tuấn'}
            </span>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-white">
              SỔ CHỦ NHIỆM LỚP {classInfo.className}
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs text-slate-200">
            <span className="font-bold text-white bg-[#34495e] px-2 py-0.5 rounded">
              Lớp: {classInfo.className}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#f1c40f]" />
              Năm học: {classInfo.academicYear}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#2ecc71]" />
              {classInfo.teacherName}
            </span>
            {classInfo.room && (
              <span className="text-slate-300">
                • {classInfo.room}
              </span>
            )}
            <button
              onClick={onEditClassInfo}
              className="text-[11px] text-sky-300 hover:text-sky-100 flex items-center gap-1 underline ml-1 cursor-pointer transition-colors"
              title="Chỉnh sửa thông tin lớp"
            >
              <Edit3 className="w-3 h-3" />
              Đổi thông tin
            </button>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={onOpenAttendance}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#27ae60] hover:bg-[#219653] text-white text-xs font-semibold rounded shadow-xs cursor-pointer transition-all active:scale-95"
            title="Điểm danh nhanh cả lớp cho buổi học"
          >
            <CheckSquare className="w-4 h-4" />
            Sổ Điểm Danh
          </button>
          
          <button
            onClick={onOpenCriteria}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8e44ad] hover:bg-[#7d3c98] text-white text-xs font-semibold rounded shadow-xs cursor-pointer transition-all active:scale-95"
            title="Xem bảng tiêu chí thi đua & nề nếp lớp"
          >
            <Award className="w-4 h-4 text-amber-300" />
            Tiêu Chí Thi Đua
          </button>

          <button
            onClick={onOpenBackup}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2980b9] hover:bg-[#1f618d] text-white text-xs font-semibold rounded shadow-xs cursor-pointer transition-all active:scale-95"
            title="Sao lưu và khôi phục dữ liệu định dạng JSON"
          >
            <FileJson className="w-4 h-4 text-sky-200" />
            Sao Lưu JSON
          </button>

          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3498db] hover:bg-[#2980b9] text-white text-xs font-semibold rounded shadow-xs cursor-pointer transition-all active:scale-95"
            title="Xuất danh sách học sinh ra file Excel / CSV"
          >
            <Download className="w-4 h-4" />
            Xuất Excel
          </button>

          <button
            onClick={onResetData}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#34495e] hover:bg-[#415b76] text-slate-300 hover:text-white text-xs rounded transition-all cursor-pointer"
            title="Khôi phục danh sách mẫu ban đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Khôi phục gốc
          </button>
        </div>
      </div>
    </header>
  );
};
