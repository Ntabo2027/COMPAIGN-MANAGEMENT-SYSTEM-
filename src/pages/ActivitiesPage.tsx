import React, { useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input, Select, Textarea } from '../components/ui/input';
import { Dialog } from '../components/ui/dialog';
import {
  Activity,
  ActivityStatus,
  ActivityType,
  NAIROBI_CONSTITUENCIES,
  NairobiConstituency,
} from '../types';
import { formatDate, formatNumber } from '../lib/utils';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Edit,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

interface ActivitiesPageProps {
  isNewModalOpen: boolean;
  setIsNewModalOpen: (open: boolean) => void;
}

export const ActivitiesPage: React.FC<ActivitiesPageProps> = ({
  isNewModalOpen,
  setIsNewModalOpen,
}) => {
  const { activities, addActivity, updateActivity, deleteActivity } = useCampaign();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Form State for New Activity
  const [formData, setFormData] = useState({
    title: '',
    type: 'Mega Rally' as ActivityType,
    constituency: 'Embakasi East' as NairobiConstituency,
    wardOrVenue: '',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    targetAttendance: 2500,
    leadOrganizer: '',
    notes: '',
    securityClearance: true,
  });

  // Modal for Recording Turnout / Quick Edit
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [turnoutInput, setTurnoutInput] = useState<string>('');
  const [statusInput, setStatusInput] = useState<ActivityStatus>('Completed');

  // Filtered Activities
  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.wardOrVenue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.leadOrganizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesConst =
      selectedConstituency === 'All' || act.constituency === selectedConstituency;
    const matchesType = selectedType === 'All' || act.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || act.status === selectedStatus;
    return matchesSearch && matchesConst && matchesType && matchesStatus;
  });

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.wardOrVenue || !formData.leadOrganizer) return;

    addActivity({
      title: formData.title,
      type: formData.type,
      constituency: formData.constituency,
      wardOrVenue: formData.wardOrVenue,
      date: formData.date,
      time: formData.time,
      targetAttendance: Number(formData.targetAttendance) || 1000,
      leadOrganizer: formData.leadOrganizer,
      notes: formData.notes,
      securityClearance: formData.securityClearance,
      status: 'Scheduled',
    });

    setIsNewModalOpen(false);
    // Reset
    setFormData({
      title: '',
      type: 'Mega Rally',
      constituency: 'Embakasi East',
      wardOrVenue: '',
      date: new Date().toISOString().split('T')[0],
      time: '14:00',
      targetAttendance: 2500,
      leadOrganizer: '',
      notes: '',
      securityClearance: true,
    });
  };

  const handleOpenTurnout = (act: Activity) => {
    setEditingActivity(act);
    setTurnoutInput(act.actualAttendance ? act.actualAttendance.toString() : act.targetAttendance.toString());
    setStatusInput(act.status);
  };

  const handleSaveTurnout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActivity) return;
    updateActivity(editingActivity.id, {
      actualAttendance: turnoutInput ? Number(turnoutInput) : undefined,
      status: statusInput,
    });
    setEditingActivity(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Campaign Activities & Mobilization Schedule
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Plan, monitor, and record attendance for rallies, town halls, and door-to-door drives.
          </p>
        </div>

        <Button
          variant="default"
          onClick={() => setIsNewModalOpen(true)}
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
          Log New Activity
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-zinc-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search rally, venue, organizer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          {/* Sub-county */}
          <div>
            <Select
              value={selectedConstituency}
              onChange={(e) => setSelectedConstituency(e.target.value)}
              className="h-9 text-xs"
            >
              <option value="All">All 17 Sub-Counties</option>
              {NAIROBI_CONSTITUENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>

          {/* Type */}
          <div>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-9 text-xs"
            >
              <option value="All">All Activity Types</option>
              <option value="Mega Rally">Mega Rally</option>
              <option value="Town Hall">Town Hall</option>
              <option value="Door-to-Door">Door-to-Door</option>
              <option value="Market Walk">Market Walk</option>
              <option value="Youth Summit">Youth Summit</option>
              <option value="Stakeholder Roundtable">Stakeholder Roundtable</option>
              <option value="Volunteer Briefing">Volunteer Briefing</option>
            </Select>
          </div>

          {/* Status */}
          <div>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-9 text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Postponed">Postponed</option>
            </Select>
          </div>
        </div>

        {/* Results summary pill */}
        <div className="flex items-center justify-between text-xs text-zinc-500 pt-1 border-t border-zinc-100">
          <span>
            Showing <strong className="text-zinc-900">{filteredActivities.length}</strong> of{' '}
            {activities.length} campaign events
          </span>
          {(searchTerm || selectedConstituency !== 'All' || selectedType !== 'All' || selectedStatus !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedConstituency('All');
                setSelectedType('All');
                setSelectedStatus('All');
              }}
              className="text-emerald-700 hover:underline font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Activities Grid */}
      {filteredActivities.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-zinc-300 p-6">
          <Calendar className="h-10 w-10 text-zinc-400 mx-auto mb-3" />
          <h3 className="font-bold text-zinc-800 text-sm">No campaign activities found</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
            Try adjusting your search criteria or schedule a new rally or town hall event.
          </p>
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsNewModalOpen(true)}
            className="mt-4 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Schedule New Activity
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredActivities.map((act) => {
            const hasTurnout = typeof act.actualAttendance === 'number';
            const turnoutPercent = hasTurnout
              ? Math.round((act.actualAttendance! / act.targetAttendance) * 100)
              : null;

            return (
              <Card
                key={act.id}
                className="bg-white border-zinc-200 hover:border-zinc-300 transition-all flex flex-col justify-between"
              >
                <CardContent className="p-4 sm:p-5 space-y-3.5">
                  {/* Card Header Top */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant={
                            act.type === 'Mega Rally'
                              ? 'default'
                              : act.type === 'Market Walk'
                              ? 'warning'
                              : act.type === 'Youth Summit'
                              ? 'info'
                              : 'secondary'
                          }
                          className="text-[10px]"
                        >
                          {act.type}
                        </Badge>
                        <Badge
                          variant={
                            act.status === 'Completed'
                              ? 'success'
                              : act.status === 'In Progress'
                              ? 'default'
                              : act.status === 'Postponed'
                              ? 'danger'
                              : 'outline'
                          }
                          className="text-[10px]"
                        >
                          {act.status}
                        </Badge>

                        {act.securityClearance ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <ShieldCheck className="h-3 w-3 text-emerald-700" />
                            Police Clearance OK
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            <ShieldAlert className="h-3 w-3 text-amber-600" />
                            Permit Pending
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-zinc-900 text-sm sm:text-base leading-snug">
                        {act.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenTurnout(act)}
                        className="h-8 w-8 text-zinc-500 hover:text-zinc-900"
                        title="Edit / Record Turnout"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteActivity(act.id)}
                        className="h-8 w-8 text-zinc-400 hover:text-red-600"
                        title="Delete Activity"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Location & Time Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded-lg border border-zinc-150">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                      <span className="truncate">
                        <strong>{act.constituency}</strong> &bull; {act.wardOrVenue}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                      <span>
                        {formatDate(act.date)} at {act.time}
                      </span>
                    </div>
                  </div>

                  {/* Turnout & Attendance Section */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500 flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-zinc-400" />
                        Target: <strong className="text-zinc-900">{formatNumber(act.targetAttendance)}</strong>
                      </span>

                      {hasTurnout ? (
                        <span className="font-semibold text-emerald-800">
                          Actual: {formatNumber(act.actualAttendance!)} ({turnoutPercent}%)
                        </span>
                      ) : (
                        <span className="text-zinc-400 italic text-[11px]">Turnout pending event</span>
                      )}
                    </div>

                    <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          hasTurnout && turnoutPercent! >= 100
                            ? 'bg-emerald-600'
                            : 'bg-zinc-800'
                        }`}
                        style={{
                          width: `${hasTurnout ? Math.min(turnoutPercent!, 100) : 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Notes / Action Item */}
                  {act.notes && (
                    <p className="text-xs text-zinc-600 bg-white p-2 rounded border border-zinc-100 leading-relaxed">
                      <span className="font-semibold text-zinc-800">Notes:</span> {act.notes}
                    </p>
                  )}

                  {/* Footer info & Quick Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-xs">
                    <span className="text-zinc-500 text-[11px]">
                      Lead: <span className="font-medium text-zinc-800">{act.leadOrganizer}</span>
                    </span>

                    <Button
                      variant={act.status === 'Completed' ? 'secondary' : 'default'}
                      size="sm"
                      onClick={() => handleOpenTurnout(act)}
                      className="text-xs h-7 px-2.5 font-medium"
                    >
                      {act.status === 'Completed' ? 'Update Turnout' : 'Record Turnout / Status'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal: New Activity */}
      <Dialog
        open={isNewModalOpen}
        onOpenChange={setIsNewModalOpen}
        title="Schedule Campaign Activity"
        description="Enter event logistics, venue location, security verification, and attendance goal."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmitNew} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-800">Activity Title *</label>
            <Input
              required
              placeholder="e.g. Westlands Boda-Boda Saccos Dialogue"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800">Activity Type *</label>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ActivityType })}
              >
                <option value="Mega Rally">Mega Rally</option>
                <option value="Town Hall">Town Hall</option>
                <option value="Door-to-Door">Door-to-Door</option>
                <option value="Market Walk">Market Walk</option>
                <option value="Youth Summit">Youth Summit</option>
                <option value="Stakeholder Roundtable">Stakeholder Roundtable</option>
                <option value="Volunteer Briefing">Volunteer Briefing</option>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800">Nairobi Sub-County *</label>
              <Select
                value={formData.constituency}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    constituency: e.target.value as NairobiConstituency,
                  })
                }
              >
                {NAIROBI_CONSTITUENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-800">Ward & Venue Details *</label>
            <Input
              required
              placeholder="e.g. Kangemi Social Hall / Jacaranda Grounds"
              value={formData.wardOrVenue}
              onChange={(e) => setFormData({ ...formData, wardOrVenue: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800">Date *</label>
              <Input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800">Time *</label>
              <Input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800">Target Attendance</label>
              <Input
                type="number"
                min="50"
                step="50"
                required
                value={formData.targetAttendance}
                onChange={(e) => setFormData({ ...formData, targetAttendance: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800">Lead Organizer / Ward Lead *</label>
              <Input
                required
                placeholder="e.g. Evelyn Wanjiku / Youth Mobilizer"
                value={formData.leadOrganizer}
                onChange={(e) => setFormData({ ...formData, leadOrganizer: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800">Security Clearance</label>
              <Select
                value={formData.securityClearance ? 'yes' : 'no'}
                onChange={(e) =>
                  setFormData({ ...formData, securityClearance: e.target.value === 'yes' })
                }
              >
                <option value="yes">Police Notice / Permit Cleared</option>
                <option value="no">Pending Police Clearance</option>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-800">Operational Notes & Sound Setup</label>
            <Textarea
              rows={2}
              placeholder="Sound equipment, PA truck, stage barriers, water stations..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
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
              Confirm & Schedule Event
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Modal: Record Turnout & Status */}
      <Dialog
        open={Boolean(editingActivity)}
        onOpenChange={(open) => !open && setEditingActivity(null)}
        title="Record Turnout & Event Status"
        description={editingActivity ? `${editingActivity.title} (${editingActivity.constituency})` : ''}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveTurnout} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-800">Update Activity Status</label>
            <Select
              value={statusInput}
              onChange={(e) => setStatusInput(e.target.value as ActivityStatus)}
            >
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Postponed">Postponed</option>
              <option value="Cancelled">Cancelled</option>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-800">
              Actual Headcount / Turnout Reached
            </label>
            <Input
              type="number"
              placeholder={`Target was ${editingActivity?.targetAttendance}`}
              value={turnoutInput}
              onChange={(e) => setTurnoutInput(e.target.value)}
            />
            <p className="text-[11px] text-zinc-500">
              Target registered goal: {editingActivity?.targetAttendance} supporters.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingActivity(null)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Save Changes
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
