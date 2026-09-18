import React, { useState, useEffect } from 'react';
import { Student, Gender, StudentRole } from '../types';
import { UserPlus, Save, X, Phone, MapPin, FileText, Users, Award } from 'lucide-react';
import { toISODate } from '../utils/dateUtils';

interface StudentFormProps {
  editingStudent: Student | null;
  onSaveStudent: (student: Student, isNew: boolean) => void;
  onCancelEdit: () => void;
  nextSuggestedId: string;
}

const COMMON_ETHNICITIES = ['Gia-rai', 'Kinh', 'Ê-đê', 'Tày', 'Ba-na', 'Nùng', 'Mường', 'Khác'];

export const StudentForm: React.FC<StudentFormProps> = ({
  editingStudent,
  onSaveStudent,
  onCancelEdit,
  nextSuggestedId,
}) => {
  const [stt, setStt] = useState<number>(1);
  const [id, setId] = useState(nextSuggestedId);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('Nữ');
  const [dob, setDob] = useState('2010-01-01');
  const [danToc, setDanToc] = useState('Gia-rai');
  const [customDanToc, setCustomDanToc] = useState('');
  const [role, setRole] = useState<StudentRole | string>('Học sinh');
  const [group, setGroup] = useState<'Tổ 1' | 'Tổ 2' | 'Tổ 3' | 'Tổ 4'>('Tổ 1');
  const [parentPhone, setParentPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Sync state when editingStudent changes
  useEffect(() => {
    if (editingStudent) {
      setStt(editingStudent.stt ?? 1);
      setId(editingStudent.id);
      setName(editingStudent.name);
      setGender(editingStudent.gender);
      setDob(toISODate(editingStudent.dob) || '2010-01-01');
      if (editingStudent.danToc && COMMON_ETHNICITIES.includes(editingStudent.danToc)) {
        setDanToc(editingStudent.danToc);
        setCustomDanToc('');
      } else if (editingStudent.danToc) {
        setDanToc('Khác');
        setCustomDanToc(editingStudent.danToc);
      } else {
        setDanToc('Gia-rai');
        setCustomDanToc('');
      }
      setRole(editingStudent.role || 'Học sinh');
      setGroup(editingStudent.group || 'Tổ 1');
      setParentPhone(editingStudent.parentPhone || '');
      setAddress(editingStudent.address || '');
      setNotes(editingStudent.notes || '');
      setErrorMessage('');
    } else {
      setId(nextSuggestedId);
      setName('');
      setGender('Nữ');
      setDob('2010-01-01');
      setDanToc('Gia-rai');
      setCustomDanToc('');
      setRole('Học sinh');
      setGroup('Tổ 1');
      setParentPhone('');
      setAddress('');
      setNotes('');
      setErrorMessage('');
    }
  }, [editingStudent, nextSuggestedId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim()) {
      setErrorMessage('Vui lòng nhập mã học sinh');
      return;
    }
    if (!name.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên học sinh');
      return;
    }
    if (!dob) {
      setErrorMessage('Vui lòng chọn ngày sinh');
      return;
    }

    const finalDanToc = danToc === 'Khác' ? customDanToc.trim() : danToc;

    const newStudent: Student = {
      stt: editingStudent?.stt ?? Number(stt),
      id: id.trim().toUpperCase(),
      name: name.trim().toUpperCase(),
      gender,
      dob,
      danToc: finalDanToc || 'Gia-rai',
      role,
      group,
      parentPhone: parentPhone.trim() || undefined,
      address: address.trim() || undefined,
      notes: notes.trim() || undefined,
      attendanceStatus: editingStudent?.attendanceStatus || 'Có mặt',
    };

    onSaveStudent(newStudent, !editingStudent);
  };

  const handleReset = () => {
    onCancelEdit();
    setName('');
    setId(nextSuggestedId);
    setGender('Nữ');
    setDob('2010-01-01');
    setDanToc('Gia-rai');
    setCustomDanToc('');
    setRole('Học sinh');
    setGroup('Tổ 1');
    setParentPhone('');
    setAddress('');
    setNotes('');
    setErrorMessage('');
  };

  return (
    <div className="bg-white p-4.5 rounded-lg shadow-sm border border-slate-200">
      {/* Form Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3.5">
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-[#3498db]" />
          <h3 className="font-bold text-[#2c3e50] text-sm">
            {editingStudent ? `Sửa Hồ Sơ: ${editingStudent.name}` : 'Thêm Học Sinh Mới'}
          </h3>
        </div>
        {editingStudent && (
          <button
            type="button"
            onClick={handleReset}
            className="text-slate-400 hover:text-slate-600 text-xs flex items-center gap-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
            Hủy sửa
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="mb-3 p-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        {/* Row 1: STT & Mã HS */}
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-1">
            <label className="block font-semibold text-slate-700 mb-1">
              STT
            </label>
            <input
              type="number"
              min="1"
              value={stt}
              onChange={(e) => setStt(Number(e.target.value))}
              className="w-full p-2 border border-slate-300 rounded outline-none focus:border-[#3498db] text-xs"
            />
          </div>
          <div className="col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">
              Mã Học Sinh <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={id}
              disabled={!!editingStudent}
              onChange={(e) => setId(e.target.value)}
              placeholder="VD: 64000738-00-5064"
              className={`w-full p-2 border border-slate-300 rounded outline-none focus:border-[#3498db] font-mono text-xs ${
                editingStudent ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''
              }`}
            />
          </div>
        </div>

        {/* Row 2: Họ và Tên */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Họ và Tên <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: RAH LAN H' AN"
            className="w-full p-2 border border-slate-300 rounded outline-none focus:border-[#3498db] text-xs font-semibold"
          />
        </div>

        {/* Row 3: Giới tính & Ngày sinh */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Giới tính
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setGender('Nam')}
                className={`flex-1 py-1.5 rounded font-medium text-xs cursor-pointer border ${
                  gender === 'Nam'
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Nam
              </button>
              <button
                type="button"
                onClick={() => setGender('Nữ')}
                className={`flex-1 py-1.5 rounded font-medium text-xs cursor-pointer border ${
                  gender === 'Nữ'
                    ? 'bg-pink-600 text-white border-pink-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Nữ
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Ngày sinh <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full p-1.5 border border-slate-300 rounded outline-none focus:border-[#3498db] text-xs"
            />
          </div>
        </div>

        {/* Row 4: Dân tộc */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Dân tộc
          </label>
          <div className="grid grid-cols-2 gap-2">
            <select
              aria-label="Chọn dân tộc"
              value={danToc}
              onChange={(e) => setDanToc(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded bg-white outline-none focus:border-[#3498db] text-xs"
            >
              {COMMON_ETHNICITIES.map(dt => (
                <option key={dt} value={dt}>{dt}</option>
              ))}
            </select>
            {danToc === 'Khác' ? (
              <input
                type="text"
                placeholder="Nhập tên dân tộc..."
                value={customDanToc}
                onChange={(e) => setCustomDanToc(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded outline-none focus:border-[#3498db] text-xs"
              />
            ) : (
              <div className="text-[11px] text-slate-500 flex items-center px-1">
                Tây Nguyên / Gia Lai
              </div>
            )}
          </div>
        </div>

        {/* Row 5: Tổ & Chức vụ */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Phân công Tổ
            </label>
            <select
              aria-label="Phân công Tổ"
              value={group}
              onChange={(e) => setGroup(e.target.value as any)}
              className="w-full p-2 border border-slate-300 rounded bg-white outline-none focus:border-[#3498db] text-xs"
            >
              <option value="Tổ 1">Tổ 1</option>
              <option value="Tổ 2">Tổ 2</option>
              <option value="Tổ 3">Tổ 3</option>
              <option value="Tổ 4">Tổ 4</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Chức vụ trong lớp
            </label>
            <select
              aria-label="Chức vụ trong lớp"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded bg-white outline-none focus:border-[#3498db] text-xs"
            >
              <option value="Học sinh">Học sinh</option>
              <option value="Lớp trưởng">Lớp trưởng</option>
              <option value="Lớp phó lao động">Lớp phó lao động</option>
              <option value="Lớp phó học tập">Lớp phó học tập</option>
              <option value="Lớp phó kỷ luật">Lớp phó kỷ luật</option>
              <option value="Lớp phó văn thể mỹ">Lớp phó văn thể mỹ</option>
              <option value="Bí thư chi đoàn">Bí thư chi đoàn</option>
              <option value="Phó bí thư">Phó bí thư</option>
              <option value="Thủ quỹ">Thủ quỹ</option>
              <option value="Tổ trưởng Tổ 1">Tổ trưởng Tổ 1</option>
              <option value="Tổ trưởng Tổ 2">Tổ trưởng Tổ 2</option>
              <option value="Tổ trưởng Tổ 3">Tổ trưởng Tổ 3</option>
              <option value="Tổ trưởng Tổ 4">Tổ trưởng Tổ 4</option>
            </select>
          </div>
        </div>

        {/* Row 6: SĐT Phụ huynh */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Số điện thoại phụ huynh
          </label>
          <div className="relative">
            <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              placeholder="VD: 0987654321"
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded outline-none focus:border-[#3498db] text-xs font-mono"
            />
          </div>
        </div>

        {/* Row 7: Địa chỉ */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Địa chỉ thường trú (Thôn / Xã / Huyện)
          </label>
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="VD: Xã Ia Hla, Chư Pưh, Gia Lai"
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded outline-none focus:border-[#3498db] text-xs"
            />
          </div>
        </div>

        {/* Row 8: Ghi chú */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Ghi chú & Đặc điểm của học sinh
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Hoàn cảnh gia đình, sở trường, cần lưu ý..."
            className="w-full p-2 border border-slate-300 rounded outline-none focus:border-[#3498db] text-xs"
          />
        </div>

        {/* Submit button */}
        <div className="pt-1 flex gap-2">
          {editingStudent && (
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded cursor-pointer transition-colors text-xs"
            >
              Hủy
            </button>
          )}
          <button
            type="submit"
            className="flex-1 py-2 bg-[#27ae60] hover:bg-[#219653] text-white font-semibold rounded cursor-pointer transition-colors text-xs flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            {editingStudent ? 'Lưu cập nhật' : 'Thêm vào lớp'}
          </button>
        </div>
      </form>
    </div>
  );
};
