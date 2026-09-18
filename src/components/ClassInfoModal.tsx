import React, { useState } from 'react';
import { ClassInfo } from '../types';
import { X, Save, School } from 'lucide-react';

interface ClassInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  classInfo: ClassInfo;
  onSaveClassInfo: (info: ClassInfo) => void;
}

export const ClassInfoModal: React.FC<ClassInfoModalProps> = ({
  isOpen,
  onClose,
  classInfo,
  onSaveClassInfo,
}) => {
  const [schoolName, setSchoolName] = useState(classInfo.schoolName || 'Trường THPT Trần Quốc Tuấn');
  const [className, setClassName] = useState(classInfo.className);
  const [academicYear, setAcademicYear] = useState(classInfo.academicYear);
  const [teacherName, setTeacherName] = useState(classInfo.teacherName);
  const [room, setRoom] = useState(classInfo.room || 'Phòng học 11A13');
  const [studentCount, setStudentCount] = useState<number>(classInfo.studentCount || 39);
  const [slogan, setSlogan] = useState(classInfo.slogan || '11A13 – ĐOÀN KẾT • TRÁCH NHIỆM • YÊU THƯƠNG • TIẾN BỘ • VƯƠN TỚI THÀNH CÔNG');

  React.useEffect(() => {
    if (isOpen) {
      setSchoolName(classInfo.schoolName || 'Trường THPT Trần Quốc Tuấn');
      setClassName(classInfo.className);
      setAcademicYear(classInfo.academicYear);
      setTeacherName(classInfo.teacherName);
      setRoom(classInfo.room || 'Phòng học 11A13');
      setStudentCount(classInfo.studentCount || 39);
      setSlogan(classInfo.slogan || '11A13 – ĐOÀN KẾT • TRÁCH NHIỆM • YÊU THƯƠNG • TIẾN BỘ • VƯƠN TỚI THÀNH CÔNG');
    }
  }, [isOpen, classInfo]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveClassInfo({
      schoolName: schoolName.trim() || 'Trường THPT Trần Quốc Tuấn',
      className: className.trim() || '11A13',
      academicYear: academicYear.trim() || '2026 - 2027',
      teacherName: teacherName.trim() || 'GVCN: Lê Ngọc Lạc',
      room: room.trim() || 'Phòng học 11A13',
      studentCount: Number(studentCount) || 39,
      slogan: slogan.trim() || '11A13 – ĐOÀN KẾT • TRÁCH NHIỆM • YÊU THƯƠNG • TIẾN BỘ • VƯƠN TỚI THÀNH CÔNG'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#2c3e50] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-[#3498db]" />
            <h3 className="font-bold text-base">Cập Nhật Thông Tin Lớp Học</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tên Trường
            </label>
            <input
              type="text"
              required
              className="w-full p-2 border border-slate-300 rounded text-xs outline-none focus:border-[#3498db]"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tên Lớp (ví dụ: 11A13)
              </label>
              <input
                type="text"
                required
                className="w-full p-2 border border-slate-300 rounded text-xs outline-none focus:border-[#3498db]"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Năm Học (ví dụ: 2026 - 2027)
              </label>
              <input
                type="text"
                required
                className="w-full p-2 border border-slate-300 rounded text-xs outline-none focus:border-[#3498db]"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Họ Tên Giáo Viên Chủ Nhiệm
              </label>
              <input
                type="text"
                required
                className="w-full p-2 border border-slate-300 rounded text-xs outline-none focus:border-[#3498db]"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Sĩ số lớp quy định
              </label>
              <input
                type="number"
                min="1"
                max="100"
                className="w-full p-2 border border-slate-300 rounded text-xs outline-none focus:border-[#3498db]"
                value={studentCount}
                onChange={(e) => setStudentCount(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Phòng Học / Dãy Nhà
            </label>
            <input
              type="text"
              className="w-full p-2 border border-slate-300 rounded text-xs outline-none focus:border-[#3498db]"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Khẩu Hiệu / Slogan của Lớp
            </label>
            <textarea
              rows={2}
              className="w-full p-2 border border-slate-300 rounded text-xs outline-none focus:border-[#3498db]"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded cursor-pointer transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center gap-1 px-4 py-1.5 bg-[#3498db] hover:bg-[#2980b9] text-white font-semibold rounded cursor-pointer transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
