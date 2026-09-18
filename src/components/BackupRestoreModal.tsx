import React, { useState, useRef } from 'react';
import { AppBackupData, ClassInfo, Student, TodoItem, CriteriaItem, AttendanceRecord } from '../types';
import { parseImportBackup, createExportBackup } from '../utils/backupUtils';
import { X, Download, Upload, Copy, Check, AlertCircle, FileJson, CheckCircle2 } from 'lucide-react';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  classInfo: ClassInfo;
  students: Student[];
  todos: TodoItem[];
  criteria: CriteriaItem[];
  attendance: AttendanceRecord;
  onRestoreData: (data: {
    classInfo?: ClassInfo;
    students?: Student[];
    todos?: TodoItem[];
    criteria?: CriteriaItem[];
    attendance?: AttendanceRecord;
  }) => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  isOpen,
  onClose,
  classInfo,
  students,
  todos,
  criteria,
  attendance,
  onRestoreData,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [pastedJson, setPastedJson] = useState('');
  const [importPreview, setImportPreview] = useState<{
    classInfo?: ClassInfo;
    students?: Student[];
    todos?: TodoItem[];
    criteria?: CriteriaItem[];
    attendance?: AttendanceRecord;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentBackup = createExportBackup(classInfo, students, todos, criteria, attendance);
  const jsonString = JSON.stringify(currentBackup, null, 2);

  const handleDownloadBackup = () => {
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeClassName = (classInfo.className || '11A13').replace(/\s+/g, '_');
    const safeYear = (classInfo.academicYear || '2026_2027').replace(/[\s-]+/g, '_');
    link.download = `Sao_Luu_Lop_${safeClassName}_${safeYear}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        setPastedJson(text);
        const parsed = JSON.parse(text);
        const preview = parseImportBackup(parsed);
        setImportPreview(preview);
      } catch (err: any) {
        setErrorMsg('Tệp tải lên không phải là JSON hợp lệ hoặc định dạng bị sai.');
        setImportPreview(null);
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleAnalyzePasted = (text: string) => {
    setPastedJson(text);
    setErrorMsg('');
    if (!text.trim()) {
      setImportPreview(null);
      return;
    }
    try {
      const parsed = JSON.parse(text);
      const preview = parseImportBackup(parsed);
      setImportPreview(preview);
    } catch (err: any) {
      setErrorMsg('Nội dung dán vào không phải JSON hợp lệ.');
      setImportPreview(null);
    }
  };

  const handleConfirmRestore = () => {
    if (!importPreview) return;
    onRestoreData(importPreview);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-[#2c3e50] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileJson className="w-5 h-5 text-[#3498db]" />
            <div>
              <h3 className="font-bold text-base">Sao Lưu & Khôi Phục Dữ Liệu Lớp Học (JSON)</h3>
              <p className="text-xs text-slate-300">
                Đồng bộ dữ liệu học sinh, điểm danh, nề nếp và lịch công tác
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 cursor-pointer transition-colors border-b-2 ${
              activeTab === 'export'
                ? 'border-[#3498db] text-[#3498db] bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-4 h-4" />
            Sao Lưu Dữ Liệu Ra File JSON
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 cursor-pointer transition-colors border-b-2 ${
              activeTab === 'import'
                ? 'border-[#3498db] text-[#3498db] bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            Khôi Phục / Nhập Dữ Liệu Từ JSON
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-5 text-sm">
          {activeTab === 'export' ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3.5 text-xs text-blue-900 leading-relaxed">
                <span className="font-bold block text-sm mb-1 text-[#2980b9]">
                  Bản sao lưu đầy đủ của Lớp {classInfo.className}
                </span>
                Gói dữ liệu bao gồm: Thông tin lớp học, danh sách {students.length} học sinh (mã định danh, dân tộc, chức vụ, SĐT), sổ điểm danh, các tiêu chí thi đua, và toàn bộ ghi chú công tác chủ nhiệm.
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#27ae60] hover:bg-[#219653] text-white font-semibold rounded text-xs shadow-sm cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Tải xuống tệp .JSON
                </button>
                <button
                  type="button"
                  onClick={handleCopyClipboard}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded text-xs border border-slate-300 cursor-pointer transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Đã sao chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-600" />
                      Sao chép mã JSON
                    </>
                  )}
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Xem trước cấu trúc JSON:
                </label>
                <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-[11px] font-mono max-h-56 overflow-y-auto leading-tight">
                  {jsonString}
                </pre>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-5 text-center bg-slate-50/70 hover:bg-slate-100/50 transition-colors">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">
                  Kéo thả tệp sao lưu .json vào đây hoặc
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 px-3 py-1.5 bg-[#3498db] hover:bg-[#2980b9] text-white text-xs font-semibold rounded cursor-pointer transition-colors inline-flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Chọn tệp từ máy tính
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hoặc dán trực tiếp nội dung JSON vào đây:
                </label>
                <textarea
                  rows={4}
                  value={pastedJson}
                  onChange={(e) => handleAnalyzePasted(e.target.value)}
                  placeholder='Dán đoạn mã {"version": "1.0", "settings": {...}, "students": [...]} vào đây...'
                  className="w-full p-2.5 border border-slate-300 rounded text-xs font-mono outline-none focus:border-[#3498db]"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {importPreview && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1.5 text-emerald-900">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Đã đọc thành công bản sao lưu!
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1">
                    <div>
                      • Lớp: <span className="font-semibold">{importPreview.classInfo?.className || 'N/A'}</span>
                    </div>
                    <div>
                      • GVCN: <span className="font-semibold">{importPreview.classInfo?.teacherName || 'N/A'}</span>
                    </div>
                    <div>
                      • Sĩ số học sinh: <span className="font-semibold">{importPreview.students?.length || 0} em</span>
                    </div>
                    <div>
                      • Số việc cần làm: <span className="font-semibold">{importPreview.todos?.length || 0} mục</span>
                    </div>
                    <div>
                      • Tiêu chí thi đua: <span className="font-semibold">{importPreview.criteria?.length || 0} tiêu chí</span>
                    </div>
                    <div>
                      • Dữ liệu điểm danh: <span className="font-semibold">{Object.keys(importPreview.attendance || {}).length} ngày</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {activeTab === 'import' && importPreview
              ? 'Dữ liệu mới sẽ thay thế danh sách hiện tại trên trình duyệt.'
              : 'Dữ liệu JSON tương thích 100% với hệ thống.'}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded cursor-pointer transition-colors"
            >
              Đóng
            </button>
            {activeTab === 'import' && (
              <button
                type="button"
                disabled={!importPreview}
                onClick={handleConfirmRestore}
                className="px-4 py-1.5 bg-[#27ae60] hover:bg-[#219653] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded cursor-pointer transition-colors flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                Xác nhận khôi phục
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
