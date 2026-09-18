import React from 'react';
import { Student } from '../types';
import { Users, UserCheck, ShieldCheck, Award } from 'lucide-react';

interface DashboardStatsProps {
  students: Student[];
  studentCountTarget?: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ students, studentCountTarget }) => {
  const total = students.length;
  const maleCount = students.filter(s => s.gender === 'Nam').length;
  const femaleCount = students.filter(s => s.gender === 'Nữ').length;
  
  // Ethnic breakdown
  const ethnicMinorityCount = students.filter(s => s.danToc && s.danToc !== 'Kinh').length;
  const ethnicGroups = Array.from(new Set(students.map(s => s.danToc).filter(Boolean)));
  
  const officerCount = students.filter(s => s.role !== 'Học sinh' && s.role !== 'Thành viên').length;
  const presentCount = students.filter(s => s.attendanceStatus === 'Có mặt' || !s.attendanceStatus).length;
  const absentCount = students.filter(s => s.attendanceStatus === 'Vắng phép' || s.attendanceStatus === 'Vắng không phép').length;

  const malePercent = total > 0 ? Math.round((maleCount / total) * 100) : 0;
  const femalePercent = total > 0 ? Math.round((femaleCount / total) * 100) : 0;
  const ethnicPercent = total > 0 ? Math.round((ethnicMinorityCount / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Sĩ số lớp */}
      <div className="bg-white p-4.5 rounded-lg shadow-2xs border-l-4 border-l-[#3498db] transition-transform hover:-translate-y-0.5 duration-150">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Sĩ số lớp
          </h3>
          <span className="p-2 rounded-full bg-blue-50 text-[#3498db]">
            <Users className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <p id="txt-total" className="text-2xl font-extrabold text-[#2c3e50]">
            {total}
          </p>
          <span className="text-xs text-slate-500 font-medium">
            {studentCountTarget ? `Chỉ tiêu: ${studentCountTarget}` : 'Học sinh'}
          </span>
        </div>
        <div className="mt-1.5 text-xs text-slate-500">
          Hiện diện hôm nay: <span className="font-semibold text-emerald-600">{presentCount}/{total}</span>
          {absentCount > 0 && (
            <span className="text-rose-500 ml-1 font-semibold">({absentCount} vắng)</span>
          )}
        </div>
      </div>

      {/* Học sinh Nam / Nữ */}
      <div className="bg-white p-4.5 rounded-lg shadow-2xs border-l-4 border-l-[#1abc9c] transition-transform hover:-translate-y-0.5 duration-150">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Giới tính (Nam / Nữ)
          </h3>
          <span className="p-2 rounded-full bg-teal-50 text-[#1abc9c]">
            <UserCheck className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-extrabold text-[#2c3e50]">
            {maleCount}N <span className="text-slate-300 text-lg">/</span> {femaleCount}Nữ
          </p>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
            {malePercent}% Nam
          </span>
        </div>
        <div className="mt-1.5 text-xs text-slate-500">
          Nữ: <span className="font-semibold text-pink-600">{femaleCount} em ({femalePercent}%)</span>
        </div>
      </div>

      {/* Dân tộc thiểu số */}
      <div className="bg-white p-4.5 rounded-lg shadow-2xs border-l-4 border-l-[#e67e22] transition-transform hover:-translate-y-0.5 duration-150">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Dân Tộc Thiểu Số
          </h3>
          <span className="p-2 rounded-full bg-amber-50 text-[#e67e22]">
            <Award className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-extrabold text-[#2c3e50]">
            {ethnicMinorityCount}
          </p>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            {ethnicPercent}%
          </span>
        </div>
        <div className="mt-1.5 text-xs text-slate-500 truncate" title={ethnicGroups.join(', ')}>
          {ethnicGroups.length > 0 ? ethnicGroups.join(', ') : 'Gia-rai, Kinh, Ê-đê, Tày'}
        </div>
      </div>

      {/* Ban Cán Sự Lớp */}
      <div className="bg-white p-4.5 rounded-lg shadow-2xs border-l-4 border-l-[#9b59b6] transition-transform hover:-translate-y-0.5 duration-150">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Ban Cán Sự & Tổ Trưởng
          </h3>
          <span className="p-2 rounded-full bg-purple-50 text-[#9b59b6]">
            <ShieldCheck className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-extrabold text-[#2c3e50]">
            {officerCount}
          </p>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
            4 Tổ
          </span>
        </div>
        <div className="mt-1.5 text-xs text-slate-500">
          Lớp trưởng, 4 Tổ trưởng, Ban cán sự
        </div>
      </div>
    </div>
  );
};
