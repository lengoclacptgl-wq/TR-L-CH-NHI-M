import React, { useState } from 'react';
import { TodoItem } from '../types';
import { CheckCircle2, Circle, Trash2, Plus, Clock, AlertCircle, FileText, CheckCheck } from 'lucide-react';
import { toDisplayDate } from '../utils/dateUtils';

interface TodoListProps {
  todos: TodoItem[];
  onToggleTodo: (id: string) => void;
  onAddTodo: (content: string, dueDate?: string, priority?: 'low' | 'medium' | 'high', notes?: string) => void;
  onDeleteTodo: (id: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggleTodo,
  onAddTodo,
  onDeleteTodo,
}) => {
  const [newContent, setNewContent] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newNotes, setNewNotes] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    onAddTodo(newContent.trim(), newDueDate || undefined, newPriority, newNotes.trim() || undefined);
    setNewContent('');
    setNewDueDate('');
    setNewNotes('');
    setIsAdding(false);
  };

  const completedCount = todos.filter(t => t.completed).length;

  const filteredTodos = todos.filter(t => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <section className="bg-white p-4.5 rounded-lg shadow-sm border border-slate-200">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
        <div>
          <h2 className="text-sm font-bold text-[#2c3e50] m-0 flex items-center gap-1.5">
            <CheckCheck className="w-4 h-4 text-[#27ae60]" />
            Sổ Tay Nhắc Việc Chủ Nhiệm
          </h2>
          <span className="text-[11px] text-slate-500">
            Nhiệm vụ tuần & tháng ({completedCount}/{todos.length} đã xong)
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs font-semibold text-white bg-[#3498db] hover:bg-[#2980b9] px-2.5 py-1.5 rounded flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          {isAdding ? 'Đóng' : 'Thêm việc'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-3 text-[11px] font-medium border-b border-slate-100 pb-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-2 py-0.5 rounded cursor-pointer ${
            filter === 'all' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Tất cả ({todos.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('pending')}
          className={`px-2 py-0.5 rounded cursor-pointer ${
            filter === 'pending' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Cần làm ({todos.length - completedCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('completed')}
          className={`px-2 py-0.5 rounded cursor-pointer ${
            filter === 'completed' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Đã xong ({completedCount})
        </button>
      </div>

      {/* Add Task Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-3 p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-2">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nội dung công việc</label>
            <input
              type="text"
              required
              className="w-full p-2 border border-slate-300 rounded bg-white outline-none focus:border-[#3498db]"
              placeholder="VD: Kiểm tra chuyên cần và nề nếp lớp tuần 2..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hạn hoàn thành</label>
              <input
                type="date"
                className="w-full p-1.5 border border-slate-300 rounded bg-white outline-none focus:border-[#3498db]"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mức độ ưu tiên</label>
              <select
                aria-label="Mức độ ưu tiên"
                className="w-full p-1.5 border border-slate-300 rounded bg-white outline-none focus:border-[#3498db]"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
              >
                <option value="low">Thấp</option>
                <option value="medium">Bình thường</option>
                <option value="high">Quan trọng / Gấp</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Ghi chú cụ thể</label>
            <input
              type="text"
              className="w-full p-1.5 border border-slate-300 rounded bg-white outline-none focus:border-[#3498db]"
              placeholder="VD: Phối hợp cùng Bí thư và Ban cán sự 4 tổ..."
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-2.5 py-1 text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-[#27ae60] hover:bg-[#219653] text-white font-semibold rounded cursor-pointer"
            >
              Lưu lời nhắc
            </button>
          </div>
        </form>
      )}

      {/* Todo list */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-0.5 text-xs">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs italic">
            Không có công việc nào trong danh mục này.
          </div>
        ) : (
          filteredTodos.map((todo) => {
            const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();

            return (
              <div
                key={todo.id}
                className={`todo-item flex items-start justify-between p-2.5 rounded bg-[#f8f9fa] border-l-[3px] hover:bg-slate-100 transition-all ${
                  todo.completed
                    ? 'opacity-65 bg-slate-50 border-l-emerald-500'
                    : todo.priority === 'high'
                    ? 'border-l-rose-500'
                    : 'border-l-amber-400'
                }`}
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-0 mr-2">
                  <button
                    type="button"
                    onClick={() => onToggleTodo(todo.id)}
                    className="mt-0.5 text-slate-400 hover:text-[#2ecc71] transition-colors cursor-pointer shrink-0"
                    title={todo.completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#2ecc71]" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <span
                      className={`text-xs block leading-snug break-words ${
                        todo.completed ? 'line-through text-slate-400' : 'text-slate-800 font-semibold'
                      }`}
                    >
                      {todo.content}
                    </span>

                    {todo.notes && (
                      <p className="text-[11px] text-slate-500 mt-0.5 italic flex items-center gap-1">
                        <FileText className="w-3 h-3 text-slate-400 shrink-0" />
                        {todo.notes}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-slate-500">
                      {todo.dueDate && (
                        <span className={`flex items-center gap-0.5 ${isOverdue ? 'text-rose-600 font-bold' : ''}`}>
                          <Clock className="w-3 h-3" />
                          Hạn: {toDisplayDate(todo.dueDate)}
                        </span>
                      )}
                      {todo.priority === 'high' && (
                        <span className="flex items-center gap-0.5 text-rose-600 font-bold bg-rose-50 px-1 rounded">
                          <AlertCircle className="w-3 h-3" />
                          Ưu tiên cao
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteTodo(todo.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer shrink-0"
                  title="Xóa lời nhắc này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
