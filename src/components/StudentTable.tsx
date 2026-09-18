import React, { useState, useMemo } from 'react';
import { Student } from '../types';
import { Search, Edit, Trash2, Eye, Filter, ArrowUpDown, Phone, Users, RotateCcw } from 'lucide-react';
import { toDisplayDate } from '../utils/dateUtils';

interface StudentTableProps {
  students: Student[];
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onViewStudent: (student: Student) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onEditStudent,
  onDeleteStudent,
  onViewStudent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'Nam' | 'Nữ'>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [danTocFilter, setDanTocFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'stt' | 'id' | 'name' | 'dob'>('stt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Unique ethnic groups in class
  const availableDanToc = useMemo(() => {
    return Array.from(new Set(students.map(s => s.danToc).filter(Boolean))) as string[];
  }, [students]);

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'Lớp trưởng':
        return 'bg-red-50 text-red-700 border-red-200 font-bold';
      case 'Bí thư chi đoàn':
        return 'bg-purple-50 text-purple-700 border-purple-200 font-bold';
      case 'Lớp phó học tập':
      case 'Lớp phó kỷ luật':
      case 'Lớp phó văn thể mỹ':
      case 'Lớp phó lao động':
        return 'bg-blue-50 text-blue-700 border-blue-200 font-semibold';
      case 'Thủ quỹ':
        return 'bg-amber-50 text-amber-700 border-amber-200 font-medium';
      case 'Tổ trưởng Tổ 1':
      case 'Tổ trưởng Tổ 2':
      case 'Tổ trưởng Tổ 3':
      case 'Tổ trưởng Tổ 4':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const filteredStudents = useMemo(() => {
    return students
      .filter((student) => {
        const query = searchTerm.toLowerCase();
        const matchesSearch =
          student.name.toLowerCase().includes(query) ||
          student.id.toLowerCase().includes(query) ||
          (student.danToc && student.danToc.toLowerCase().includes(query)) ||
          (student.parentPhone && student.parentPhone.includes(query)) ||
          (student.notes && student.notes.toLowerCase().includes(query));

        const matchesGender = genderFilter === 'all' || student.gender === genderFilter;
        
        let matchesRole = true;
        if (roleFilter === 'officer') {
          matchesRole = student.role !== 'Học sinh' && student.role !== 'Thành viên';
        } else if (roleFilter === 'member') {
          matchesRole = student.role === 'Học sinh' || student.role === 'Thành viên';
        } else if (roleFilter !== 'all') {
          matchesRole = student.role === roleFilter;
        }

        const matchesGroup = groupFilter === 'all' || student.group === groupFilter;
        const matchesDanToc = danTocFilter === 'all' || student.danToc === danTocFilter;

        return matchesSearch && matchesGender && matchesRole && matchesGroup && matchesDanToc;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === 'stt') {
          const sttA = a.stt ?? 999;
          const sttB = b.stt ?? 999;
          comp = sttA - sttB;
        } else if (sortBy === 'name') {
          // Sort by Vietnamese first name (last word in full name)
          const lastNameA = a.name.trim().split(' ').pop() || '';
          const lastNameB = b.name.trim().split(' ').pop() || '';
          comp = lastNameA.localeCompare(lastNameB, 'vi');
          if (comp === 0) {
            comp = a.name.localeCompare(b.name, 'vi');
          }
        } else if (sortBy === 'dob') {
          comp = a.dob.localeCompare(b.dob);
        } else {
          comp = a.id.localeCompare(b.id, undefined, { numeric: true });
        }
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [students, searchTerm, genderFilter, roleFilter, groupFilter, danTocFilter, sortBy, sortOrder]);

  const toggleSort = (field: 'stt' | 'id' | 'name' | 'dob') => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setGenderFilter('all');
    setRoleFilter('all');
    setGroupFilter('all');
    setDanTocFilter('all');
    setSortBy('stt');
    setSortOrder('asc');
  };

  const hasActiveFilters = searchTerm !== '' || genderFilter !== 'all' || roleFilter !== 'all' || groupFilter !== 'all' || danTocFilter !== 'all';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Header section with search and title */}
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <h2 className="text-base font-bold text-[#2c3e50] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#3498db]" />
            Danh Sách Học Sinh Lớp 11A13
            <span className="text-xs font-semibold px-2 py-0.5 bg-sky-100 text-sky-800 rounded-full">
              {filteredStudents.length}/{students.length} em
            </span>
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Nhấn vào tên học sinh để xem hồ sơ chi tiết, chỉnh sửa thông tin hoặc liên lạc phụ huynh
          </p>
        </div>

        {/* Quick search input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="search-student"
            type="text"
            placeholder="Tìm theo tên, mã HS, SĐT, dân tộc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-[#3498db] focus:ring-1 focus:ring-[#3498db] transition-all"
          />
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="p-3 bg-slate-100/60 border-b border-slate-200 flex flex-wrap items-center gap-2 text-xs">
        <span className="flex items-center gap-1 font-semibold text-slate-600 mr-1">
          <Filter className="w-3.5 h-3.5 text-[#3498db]" />
          Lọc:
        </span>

        {/* Tổ */}
        <select
          aria-label="Lọc theo Tổ"
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-700 outline-none focus:border-[#3498db]"
        >
          <option value="all">Tất cả Tổ</option>
          <option value="Tổ 1">Tổ 1</option>
          <option value="Tổ 2">Tổ 2</option>
          <option value="Tổ 3">Tổ 3</option>
          <option value="Tổ 4">Tổ 4</option>
        </select>

        {/* Giới tính */}
        <select
          aria-label="Lọc theo Giới tính"
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value as any)}
          className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-700 outline-none focus:border-[#3498db]"
        >
          <option value="all">Tất cả Giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>

        {/* Dân tộc */}
        <select
          aria-label="Lọc theo Dân tộc"
          value={danTocFilter}
          onChange={(e) => setDanTocFilter(e.target.value)}
          className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-700 outline-none focus:border-[#3498db]"
        >
          <option value="all">Tất cả Dân tộc</option>
          {availableDanToc.map(dt => (
            <option key={dt} value={dt}>{dt}</option>
          ))}
        </select>

        {/* Chức vụ */}
        <select
          aria-label="Lọc theo Chức vụ"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-700 outline-none focus:border-[#3498db]"
        >
          <option value="all">Tất cả Chức vụ</option>
          <option value="officer">Ban Cán Sự & Tổ Trưởng</option>
          <option value="member">Học sinh thông thường</option>
          <option value="Lớp trưởng">Lớp trưởng</option>
          <option value="Lớp phó lao động">Lớp phó lao động</option>
          <option value="Tổ trưởng Tổ 1">Tổ trưởng Tổ 1</option>
          <option value="Tổ trưởng Tổ 2">Tổ trưởng Tổ 2</option>
          <option value="Tổ trưởng Tổ 3">Tổ trưởng Tổ 3</option>
          <option value="Tổ trưởng Tổ 4">Tổ trưởng Tổ 4</option>
        </select>

        {/* Sắp xếp */}
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-slate-500 font-medium">Xếp theo:</span>
          <button
            type="button"
            onClick={() => toggleSort('stt')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer ${
              sortBy === 'stt' ? 'bg-[#3498db] text-white' : 'bg-white text-slate-700 border border-slate-300'
            }`}
          >
            STT {sortBy === 'stt' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            type="button"
            onClick={() => toggleSort('name')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer ${
              sortBy === 'name' ? 'bg-[#3498db] text-white' : 'bg-white text-slate-700 border border-slate-300'
            }`}
          >
            Tên {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            type="button"
            onClick={() => toggleSort('dob')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer ${
              sortBy === 'dob' ? 'bg-[#3498db] text-white' : 'bg-white text-slate-700 border border-slate-300'
            }`}
          >
            Ngày sinh {sortBy === 'dob' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-[11px] text-rose-600 hover:text-rose-800 underline ml-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <th className="py-2.5 px-3 w-10 text-center">STT</th>
              <th className="py-2.5 px-3 min-w-[130px]">Mã Học Sinh</th>
              <th className="py-2.5 px-3 min-w-[180px]">Họ và Tên</th>
              <th className="py-2.5 px-2.5 text-center">Giới tính</th>
              <th className="py-2.5 px-2.5 text-center">Dân tộc</th>
              <th className="py-2.5 px-2.5">Ngày sinh</th>
              <th className="py-2.5 px-2.5 text-center">Tổ</th>
              <th className="py-2.5 px-3">Chức vụ</th>
              <th className="py-2.5 px-3">Số Điện Thoại</th>
              <th className="py-2.5 px-2.5 text-center">Điểm danh</th>
              <th className="py-2.5 px-3 text-center action-btns">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-8 text-slate-400 text-sm italic">
                  Không tìm thấy học sinh nào phù hợp với điều kiện tìm kiếm.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student, idx) => {
                const isMale = student.gender === 'Nam';
                const status = student.attendanceStatus || 'Có mặt';

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-sky-50/50 transition-colors group"
                  >
                    <td className="py-2 px-3 text-center font-medium text-slate-500">
                      {student.stt ?? (idx + 1)}
                    </td>

                    <td className="py-2 px-3 font-mono text-[11px] text-slate-600 font-semibold">
                      {student.id}
                    </td>

                    <td className="py-2 px-3">
                      <button
                        type="button"
                        onClick={() => onViewStudent(student)}
                        className="font-bold text-slate-800 hover:text-[#3498db] text-left block cursor-pointer transition-colors"
                      >
                        {student.name}
                      </button>
                    </td>

                    <td className="py-2 px-2.5 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          isMale
                            ? 'bg-teal-50 text-teal-700 border border-teal-200'
                            : 'bg-pink-50 text-pink-700 border border-pink-200'
                        }`}
                      >
                        {student.gender}
                      </span>
                    </td>

                    <td className="py-2 px-2.5 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        student.danToc === 'Kinh'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-amber-100/70 text-amber-900 font-semibold'
                      }`}>
                        {student.danToc || '—'}
                      </span>
                    </td>

                    <td className="py-2 px-2.5 font-medium text-slate-600 text-[11px]">
                      {toDisplayDate(student.dob)}
                    </td>

                    <td className="py-2 px-2.5 text-center">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {student.group}
                      </span>
                    </td>

                    <td className="py-2 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] border ${getRoleBadgeClass(
                          student.role
                        )}`}
                      >
                        {student.role}
                      </span>
                    </td>

                    <td className="py-2 px-3">
                      {student.parentPhone ? (
                        <a
                          href={`tel:${student.parentPhone}`}
                          className="flex items-center gap-1 text-[#3498db] hover:underline font-mono text-[11px]"
                          title="Gọi cho phụ huynh"
                        >
                          <Phone className="w-3 h-3 text-slate-400" />
                          {student.parentPhone}
                        </a>
                      ) : (
                        <span className="text-slate-300 italic">—</span>
                      )}
                    </td>

                    <td className="py-2 px-2.5 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          status === 'Có mặt'
                            ? 'bg-emerald-50 text-emerald-700'
                            : status === 'Đi trễ'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="py-2 px-3 text-center action-btns">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewStudent(student)}
                          className="p-1 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded cursor-pointer transition-colors"
                          title="Xem chi tiết hồ sơ"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditStudent(student)}
                          className="p-1 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded cursor-pointer transition-colors"
                          title="Chỉnh sửa thông tin"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteStudent(student.id)}
                          className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer transition-colors"
                          title="Xóa học sinh này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
        <div>
          Tổng số học sinh hiển thị: <span className="font-bold text-slate-700">{filteredStudents.length}</span> / {students.length} em
        </div>
        <div className="flex gap-4">
          <span>Nam: <strong className="text-teal-700">{filteredStudents.filter(s => s.gender === 'Nam').length}</strong></span>
          <span>Nữ: <strong className="text-pink-700">{filteredStudents.filter(s => s.gender === 'Nữ').length}</strong></span>
          <span>Dân tộc: <strong className="text-amber-800">{filteredStudents.filter(s => s.danToc && s.danToc !== 'Kinh').length}</strong></span>
        </div>
      </div>
    </div>
  );
};
