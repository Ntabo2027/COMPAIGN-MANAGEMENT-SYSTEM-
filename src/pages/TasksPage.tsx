import React, { useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input, Select, Textarea } from '../components/ui/input';
import { Dialog } from '../components/ui/dialog';
import {
  NAIROBI_CONSTITUENCIES,
  NairobiConstituency,
  Task,
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from '../types';
import { formatDate } from '../lib/utils';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Kanban,
  List,
  Clock,
  User,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  Tag,
} from 'lucide-react';

interface TasksPageProps {
  isNewModalOpen: boolean;
  setIsNewModalOpen: (open: boolean) => void;
}

export const TasksPage: React.FC<TasksPageProps> = ({
  isNewModalOpen,
  setIsNewModalOpen,
}) => {
  const { tasks, addTask, updateTask, deleteTask, moveTaskStatus, teamMembers } = useCampaign();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterConstituency, setFilterConstituency] = useState<string>('All');

  // Form for New Task
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Logistics & Sound' as TaskCategory,
    constituency: 'Countywide' as NairobiConstituency | 'Countywide',
    priority: 'High' as TaskPriority,
    status: 'To Do' as TaskStatus,
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    assignedTo: teamMembers[0]?.name || 'Victor Kinyua',
  });

  const columns: { status: TaskStatus; label: string; color: string }[] = [
    { status: 'To Do', label: 'To Do', color: 'border-t-zinc-400' },
    { status: 'In Progress', label: 'In Progress', color: 'border-t-emerald-600' },
    { status: 'Under Review', label: 'Under Review', color: 'border-t-amber-500' },
    { status: 'Completed', label: 'Completed', color: 'border-t-emerald-800' },
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
    const matchesCategory = filterCategory === 'All' || task.category === filterCategory;
    const matchesConst = filterConstituency === 'All' || task.constituency === filterConstituency;
    return matchesSearch && matchesPriority && matchesCategory && matchesConst;
  });

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.assignedTo) return;

    addTask({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      constituency: formData.constituency,
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate,
      assignedTo: formData.assignedTo,
    });

    setIsNewModalOpen(false);
    // Reset
    setFormData({
      title: '',
      description: '',
      category: 'Logistics & Sound',
      constituency: 'Countywide',
      priority: 'High',
      status: 'To Do',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      assignedTo: teamMembers[0]?.name || 'Victor Kinyua',
    });
  };

  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'To Do') return 'In Progress';
    if (current === 'In Progress') return 'Under Review';
    if (current === 'Under Review') return 'Completed';
    return null;
  };

  const getPrevStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'Completed') return 'Under Review';
    if (current === 'Under Review') return 'In Progress';
    if (current === 'In Progress') return 'To Do';
    return null;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Campaign Operations & Field Tasks
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Logistics, permit approvals, sound setups, and ward mobilization deliverables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="bg-zinc-100 p-1 rounded-lg border border-zinc-200 flex items-center">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Kanban className="h-3.5 w-3.5" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              Table
            </button>
          </div>

          <Button
            variant="default"
            onClick={() => setIsNewModalOpen(true)}
            className="shrink-0"
          >
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-zinc-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search tasks, assignees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          {/* Priority */}
          <div>
            <Select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="h-9 text-xs"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </Select>
          </div>

          {/* Category */}
          <div>
            <Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="h-9 text-xs"
            >
              <option value="All">All Categories</option>
              <option value="Logistics & Sound">Logistics & Sound</option>
              <option value="Field Mobilization">Field Mobilization</option>
              <option value="Communications & Media">Communications & Media</option>
              <option value="Security & Protocols">Security & Protocols</option>
              <option value="Legal & Permits">Legal & Permits</option>
              <option value="Youth League">Youth League</option>
            </Select>
          </div>

          {/* Sub-County */}
          <div>
            <Select
              value={filterConstituency}
              onChange={(e) => setFilterConstituency(e.target.value)}
              className="h-9 text-xs"
            >
              <option value="All">All Areas (Countywide + Wards)</option>
              <option value="Countywide">Countywide</option>
              {NAIROBI_CONSTITUENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Progress summary */}
        <div className="flex items-center justify-between text-xs text-zinc-500 pt-1 border-t border-zinc-100">
          <span>
            Showing <strong className="text-zinc-900">{filteredTasks.length}</strong> tasks &bull;{' '}
            <strong className="text-emerald-700">
              {tasks.filter((t) => t.status === 'Completed').length} Completed
            </strong>
          </span>
          {(searchTerm || filterPriority !== 'All' || filterCategory !== 'All' || filterConstituency !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterPriority('All');
                setFilterCategory('All');
                setFilterConstituency('All');
              }}
              className="text-emerald-700 hover:underline font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => {
            const columnTasks = filteredTasks.filter((t) => t.status === col.status);

            return (
              <div
                key={col.status}
                className={`bg-zinc-100/70 rounded-xl p-3 border border-zinc-200 flex flex-col min-h-[500px] border-t-4 ${col.color}`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-200">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-zinc-800">
                      {col.label}
                    </span>
                    <span className="bg-white text-zinc-800 px-2 py-0.5 rounded-full text-xs font-bold border border-zinc-200 shadow-xs">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                {/* Cards in this column */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {columnTasks.length === 0 ? (
                    <div className="text-center py-10 text-zinc-400 text-xs italic">
                      No tasks in {col.label}
                    </div>
                  ) : (
                    columnTasks.map((task) => {
                      const next = getNextStatus(task.status);
                      const prev = getPrevStatus(task.status);

                      return (
                        <div
                          key={task.id}
                          className="bg-white p-3.5 rounded-xl border border-zinc-200 shadow-xs hover:shadow-sm transition-all space-y-2.5 text-xs group"
                        >
                          {/* Priority & Category */}
                          <div className="flex items-center justify-between gap-1">
                            <Badge
                              variant={
                                task.priority === 'High'
                                  ? 'danger'
                                  : task.priority === 'Medium'
                                  ? 'warning'
                                  : 'secondary'
                              }
                              className="text-[9px]"
                            >
                              {task.priority} Priority
                            </Badge>

                            <span className="text-[10px] text-zinc-500 font-medium truncate max-w-[120px]">
                              {task.category}
                            </span>
                          </div>

                          {/* Title & Description */}
                          <div>
                            <h4 className="font-bold text-zinc-900 leading-snug line-clamp-2">
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                                {task.description}
                              </p>
                            )}
                          </div>

                          {/* Sub-County & Due Date */}
                          <div className="space-y-1 pt-1 border-t border-zinc-100 text-[11px] text-zinc-500">
                            <div className="flex items-center justify-between">
                              <span className="text-emerald-800 font-semibold truncate">
                                {task.constituency}
                              </span>
                              <span className="flex items-center gap-1 text-zinc-600">
                                <Clock className="h-3 w-3 text-zinc-400" />
                                Due {formatDate(task.dueDate)}
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-0.5">
                              <span className="flex items-center gap-1 text-zinc-700 font-medium">
                                <User className="h-3 w-3 text-zinc-400" />
                                {task.assignedTo}
                              </span>

                              <button
                                onClick={() => deleteTask(task.id)}
                                className="text-zinc-400 hover:text-red-600 p-1 opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
                                title="Delete Task"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          {/* Quick Status Shift Buttons */}
                          <div className="flex items-center justify-between pt-2 border-t border-zinc-100 gap-1">
                            {prev ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => moveTaskStatus(task.id, prev)}
                                className="h-6 text-[10px] px-2 text-zinc-500 hover:text-zinc-900"
                                title={`Move back to ${prev}`}
                              >
                                <ArrowLeft className="h-2.5 w-2.5 mr-1" />
                                Back
                              </Button>
                            ) : (
                              <span />
                            )}

                            {next ? (
                              <Button
                                variant={next === 'Completed' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => moveTaskStatus(task.id, next)}
                                className="h-6 text-[10px] px-2 font-medium"
                                title={`Move to ${next}`}
                              >
                                {next === 'Completed' ? 'Complete' : next}
                                <ArrowRight className="h-2.5 w-2.5 ml-1" />
                              </Button>
                            ) : (
                              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Done
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-600 font-bold border-b border-zinc-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Task Description</th>
                  <th className="p-3.5">Area</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Due Date</th>
                  <th className="p-3.5">Assignee</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-zinc-50/70 transition-colors">
                    <td className="p-3.5 max-w-xs">
                      <div className="font-bold text-zinc-900">{task.title}</div>
                      <div className="text-[11px] text-zinc-500 line-clamp-1">{task.description}</div>
                    </td>
                    <td className="p-3.5 font-medium text-emerald-800">{task.constituency}</td>
                    <td className="p-3.5 text-zinc-600">{task.category}</td>
                    <td className="p-3.5">
                      <Badge
                        variant={
                          task.priority === 'High'
                            ? 'danger'
                            : task.priority === 'Medium'
                            ? 'warning'
                            : 'secondary'
                        }
                        className="text-[10px]"
                      >
                        {task.priority}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-zinc-600">{formatDate(task.dueDate)}</td>
                    <td className="p-3.5 font-medium text-zinc-800">{task.assignedTo}</td>
                    <td className="p-3.5">
                      <Select
                        value={task.status}
                        onChange={(e) => moveTaskStatus(task.id, e.target.value as TaskStatus)}
                        className="h-7 text-xs w-32"
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Completed">Completed</option>
                      </Select>
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTask(task.id)}
                        className="h-7 w-7 text-zinc-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: New Task */}
      <Dialog
        open={isNewModalOpen}
        onOpenChange={setIsNewModalOpen}
        title="Create Campaign Operations Task"
        description="Assign field mobilization, logistics, or security deliverables to campaign team members."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmitNew} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-800">Task Title *</label>
            <Input
              required
              placeholder="e.g. Procure 40 PA speakers for Jacaranda mega-rally"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-800">Description & Instructions</label>
            <Textarea
              rows={2}
              placeholder="Specific details, vendor contacts, or clearance instructions..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800">Category *</label>
              <Select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as TaskCategory })
                }
              >
                <option value="Logistics & Sound">Logistics & Sound</option>
                <option value="Field Mobilization">Field Mobilization</option>
                <option value="Communications & Media">Communications & Media</option>
                <option value="Security & Protocols">Security & Protocols</option>
                <option value="Legal & Permits">Legal & Permits</option>
                <option value="Youth League">Youth League</option>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800">Sub-County / Area</label>
              <Select
                value={formData.constituency}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    constituency: e.target.value as NairobiConstituency | 'Countywide',
                  })
                }
              >
                <option value="Countywide">Countywide</option>
                {NAIROBI_CONSTITUENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800">Priority *</label>
              <Select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as TaskPriority })
                }
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800">Initial Status</label>
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as TaskStatus })
                }
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Under Review">Under Review</option>
                <option value="Completed">Completed</option>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800">Due Date *</label>
              <Input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-800">Assign To Team Lead *</label>
            <Select
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            >
              {teamMembers.map((member) => (
                <option key={member.id} value={member.name}>
                  {member.name} — {member.role} ({member.constituency})
                </option>
              ))}
            </Select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsNewModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Assign & Create Task
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
