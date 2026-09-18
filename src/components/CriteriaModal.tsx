import React, { useState } from 'react';
import { CriteriaItem } from '../types';
import { X, Award, PlusCircle, MinusCircle, Plus, Trash2 } from 'lucide-react';

interface CriteriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  criteria: CriteriaItem[];
  onSaveCriteria: (items: CriteriaItem[]) => void;
}

export const CriteriaModal: React.FC<CriteriaModalProps> = ({
  isOpen,
  onClose,
  criteria,
  onSaveCriteria,
}) => {
  const [items, setItems] = useState<CriteriaItem[]>(criteria);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'plus' | 'minus'>('plus');
  const [newPoints, setNewPoints] = useState<number>(2);

  React.useEffect(() => {
    if (isOpen) {
      setItems(criteria);
    }
  }, [isOpen, criteria]);

  if (!isOpen) return null;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newItem: CriteriaItem = {
      id: `c_${Date.now()}`,
      name: newName.trim(),
      type: newType,
      points: Number(newPoints) || 1,
    };
    const updated = [...items, newItem];
    setItems(updated);
    onSaveCriteria(updated);
    setNewName('');
    setNewPoints(2);
  };

  const handleDeleteItem = (id: string) => {
    const updated = items.filter(c => c.id !== id);
    setItems(updated);
    onSaveCriteria(updated);
  };

  const plusItems = items.filter(c => c.type === 'plus');
  const minusItems = items.filter(c => c.type === 'minus');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#2c3e50] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#f1c40f]" />
            <div>
              <h3 className="font-bold text-base">Tiêu Chí Thi Đua & Nề Nếp Lớp Học</h3>
              <p className="text-xs text-slate-300">
                Quy định thang điểm cộng / trừ nề nếp hàng tuần của lớp chủ nhiệm
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 text-sm space-y-5">
          {/* Add Criteria Form */}
          <form onSubmit={handleAddItem} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
            <span className="font-bold text-slate-700 block">Thêm tiêu chí thi đua mới</span>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-6">
                <input
                  type="text"
                  required
                  placeholder="Nội dung tiêu chí..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded bg-white outline-none focus:border-[#3498db]"
                />
              </div>
              <div className="sm:col-span-3">
                <select
                  aria-label="Loại điểm"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded bg-white outline-none focus:border-[#3498db]"
                >
                  <option value="plus">Cộng điểm (+)</option>
                  <option value="minus">Trừ điểm (-)</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <input
                  type="number"
                  min="1"
                  max="50"
                  aria-label="Số điểm"
                  value={newPoints}
                  onChange={(e) => setNewPoints(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded bg-white outline-none focus:border-[#3498db]"
                />
              </div>
              <div className="sm:col-span-1 flex items-center">
                <button
                  type="submit"
                  className="w-full py-2 bg-[#27ae60] hover:bg-[#219653] text-white rounded font-semibold flex items-center justify-center cursor-pointer transition-colors"
                  title="Thêm tiêu chí"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Criteria Columns: Plus vs Minus */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Điểm cộng */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider pb-1 border-b border-emerald-200">
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                Tiêu chí khen thưởng / Cộng điểm ({plusItems.length})
              </div>
              <div className="space-y-1.5">
                {plusItems.map((c) => (
                  <div
                    key={c.id}
                    className="p-2 bg-emerald-50/70 border border-emerald-100 rounded flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-slate-800">{c.name}</span>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        +{c.points}đ
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(c.id)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Điểm trừ */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 uppercase tracking-wider pb-1 border-b border-rose-200">
                <MinusCircle className="w-4 h-4 text-rose-600" />
                Tiêu chí vi phạm / Trừ điểm ({minusItems.length})
              </div>
              <div className="space-y-1.5">
                {minusItems.map((c) => (
                  <div
                    key={c.id}
                    className="p-2 bg-rose-50/70 border border-rose-100 rounded flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-slate-800">{c.name}</span>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                        -{c.points}đ
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(c.id)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#2c3e50] hover:bg-[#34495e] text-white text-xs font-semibold rounded cursor-pointer transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
