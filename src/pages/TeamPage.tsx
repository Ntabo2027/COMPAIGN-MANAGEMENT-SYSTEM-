import React, { useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input, Select } from '../components/ui/input';
import { Dialog } from '../components/ui/dialog';
import {
  NAIROBI_CONSTITUENCIES,
  NairobiConstituency,
  TeamMember,
  TeamRole,
} from '../types';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Trash2,
  Edit,
  Shield,
  Briefcase,
  UserCheck,
} from 'lucide-react';

interface TeamPageProps {
  isNewModalOpen: boolean;
  setIsNewModalOpen: (open: boolean) => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({
  isNewModalOpen,
  setIsNewModalOpen,
}) => {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember, tasks } = useCampaign();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('All');
  const [filterConstituency, setFilterConstituency] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Form for New Team Member
  const [formData, setFormData] = useState({
    name: '',
    role: 'Sub-County Coordinator' as TeamRole,
    constituency: 'Westlands' as NairobiConstituency | 'Countywide',
    phone: '+254 7',
    email: '',
    status: 'Active' as 'Active' | 'On Leave' | 'Inactive',
  });

  // Edit modal
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm);
    const matchesRole = filterRole === 'All' || member.role === filterRole;
    const matchesConst =
      filterConstituency === 'All' || member.constituency === filterConstituency;
    const matchesStatus =
      filterStatus === 'All' || member.status === filterStatus;

    return matchesSearch && matchesRole && matchesConst && matchesStatus;
  });

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    addTeamMember({
      name: formData.name,
      role: formData.role,
      constituency: formData.constituency,
      phone: formData.phone,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@nairobi-campaign.ke`,
      status: formData.status,
    });

    setIsNewModalOpen(false);
    // Reset
    setFormData({
      name: '',
      role: 'Sub-County Coordinator',
      constituency: 'Westlands',
      phone: '+254 7',
      email: '',
      status: 'Active',
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    updateTeamMember(editingMember.id, {
      name: editingMember.name,
      role: editingMember.role,
      constituency: editingMember.constituency,
      phone: editingMember.phone,
      email: editingMember.email,
      status: editingMember.status,
    });
    setEditingMember(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Team & Field Volunteer Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Roster of campaign leads, sub-county directors, ward captains, and ground mobilizers.
          </p>
        </div>

        <Button
          variant="default"
          onClick={() => setIsNewModalOpen(true)}
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
          Enrol Team Member
        </Button>
      </div>

      {/* Operational Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-zinc-200">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Total Staff & Leads
          </div>
          <div className="text-2xl font-bold text-zinc-900 mt-1">
            {teamMembers.length}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
            {teamMembers.filter((m) => m.status === 'Active').length} Active on Field
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-zinc-200">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Sub-County Leads
          </div>
          <div className="text-2xl font-bold text-zinc-900 mt-1">
            {teamMembers.filter((m) => m.role === 'Sub-County Coordinator').length} / 17
          </div>
          <div className="text-[11px] text-zinc-500 font-medium mt-0.5">
            Nairobi Constituencies
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-zinc-200">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Tasks in Execution
          </div>
          <div className="text-2xl font-bold text-zinc-900 mt-1">
            {tasks.filter((t) => t.status === 'In Progress').length}
          </div>
          <div className="text-[11px] text-zinc-500 font-medium mt-0.5">
            Across All Teams
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-zinc-200">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Volunteer Network
          </div>
          <div className="text-2xl font-bold text-emerald-800 mt-1">
            1,420+
          </div>
          <div className="text-[11px] text-zinc-500 font-medium mt-0.5">
            Registered Grassroots Force
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-zinc-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          {/* Role */}
          <div>
            <Select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="h-9 text-xs"
            >
              <option value="All">All Roles</option>
              <option value="Campaign Manager">Campaign Manager</option>
              <option value="Sub-County Coordinator">Sub-County Coordinator</option>
              <option value="Field Mobilization Lead">Field Mobilization Lead</option>
              <option value="Communications & Media Director">Communications & Media</option>
              <option value="Youth League Coordinator">Youth League Coordinator</option>
              <option value="Women Caucus Lead">Women Caucus Lead</option>
              <option value="Logistics Specialist">Logistics Specialist</option>
              <option value="Ward Captain">Ward Captain</option>
              <option value="Volunteer Agent">Volunteer Agent</option>
            </Select>
          </div>

          {/* Area */}
          <div>
            <Select
              value={filterConstituency}
              onChange={(e) => setFilterConstituency(e.target.value)}
              className="h-9 text-xs"
            >
              <option value="All">All Areas</option>
              <option value="Countywide">Countywide</option>
              {NAIROBI_CONSTITUENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>

          {/* Status */}
          <div>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-9 text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between text-xs text-zinc-500 pt-1 border-t border-zinc-100">
          <span>
            Showing <strong className="text-zinc-900">{filteredMembers.length}</strong> of{' '}
            {teamMembers.length} campaign personnel
          </span>
          {(searchTerm || filterRole !== 'All' || filterConstituency !== 'All' || filterStatus !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterRole('All');
                setFilterConstituency('All');
                setFilterStatus('All');
              }}
              className="text-emerald-700 hover:underline font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Team Cards Grid */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-zinc-300 p-6">
          <Users className="h-10 w-10 text-zinc-400 mx-auto mb-3" />
          <h3 className="font-bold text-zinc-800 text-sm">No team members found</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
            Try adjusting your search filters or enrol a new volunteer coordinator.
          </p>
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsNewModalOpen(true)}
            className="mt-4 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Enrol Team Member
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => {
            const memberTasksCount = tasks.filter(
              (t) => t.assignedTo.toLowerCase() === member.name.toLowerCase()
            ).length;

            return (
              <Card
                key={member.id}
                className="bg-white border-zinc-200 hover:border-zinc-300 transition-all flex flex-col justify-between"
              >
                <CardContent className="p-4 sm:p-5 space-y-3.5">
                  {/* Card Header & Avatar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${
                          member.avatarBgColor || 'bg-emerald-700'
                        }`}
                      >
                        {getInitials(member.name)}
                      </div>

                      <div className="space-y-0.5 min-w-0">
                        <h3 className="font-bold text-zinc-900 text-sm truncate">
                          {member.name}
                        </h3>
                        <p className="text-xs font-semibold text-emerald-800 truncate">
                          {member.role}
                        </p>
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <Badge
                            variant={
                              member.status === 'Active'
                                ? 'success'
                                : member.status === 'On Leave'
                                ? 'warning'
                                : 'secondary'
                            }
                            className="text-[9px]"
                          >
                            {member.status}
                          </Badge>

                          <span className="text-[10px] text-zinc-500 font-medium">
                            {memberTasksCount} assigned tasks
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingMember(member)}
                        className="h-8 w-8 text-zinc-500 hover:text-zinc-900"
                        title="Edit Profile"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTeamMember(member.id)}
                        className="h-8 w-8 text-zinc-400 hover:text-red-600"
                        title="Remove Member"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Constituency & Contact Info */}
                  <div className="text-xs text-zinc-600 space-y-2 bg-zinc-50 p-2.5 rounded-lg border border-zinc-150">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                      <span className="font-medium text-zinc-800 truncate">
                        Assigned: {member.constituency}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                      <span className="font-mono text-[11px] text-zinc-700">
                        {member.phone}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate text-zinc-700 text-[11px]">
                        {member.email}
                      </span>
                    </div>
                  </div>

                  {/* Quick Status Switcher */}
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-100 text-xs">
                    <span className="text-[11px] text-zinc-500">Quick Toggle:</span>
                    <button
                      onClick={() =>
                        updateTeamMember(member.id, {
                          status: member.status === 'Active' ? 'On Leave' : 'Active',
                        })
                      }
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer"
                    >
                      Set to {member.status === 'Active' ? 'On Leave' : 'Active'}
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal: Enrol New Team Member */}
      <Dialog
        open={isNewModalOpen}
        onOpenChange={setIsNewModalOpen}
        title="Enrol Campaign Staff or Field Lead"
        description="Add a coordinator, ward agent, or volunteer specialist to the Nairobi campaign network."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmitNew} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-800">Full Official Name *</label>
            <Input
              required
              placeholder="e.g. Christine Mutiso"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-800">Campaign Role *</label>
            <Select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as TeamRole })}
            >
              <option value="Sub-County Coordinator">Sub-County Coordinator</option>
              <option value="Field Mobilization Lead">Field Mobilization Lead</option>
              <option value="Youth League Coordinator">Youth League Coordinator</option>
              <option value="Women Caucus Lead">Women Caucus Lead</option>
              <option value="Logistics Specialist">Logistics Specialist</option>
              <option value="Communications & Media Director">Communications & Media</option>
              <option value="Ward Captain">Ward Captain</option>
              <option value="Volunteer Agent">Volunteer Agent</option>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-800">Assigned Constituency / Jurisdiction *</label>
            <Select
              value={formData.constituency}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  constituency: e.target.value as NairobiConstituency | 'Countywide',
                })
              }
            >
              <option value="Countywide">Countywide Campaign Headquarters</option>
              {NAIROBI_CONSTITUENCIES.map((c) => (
                <option key={c} value={c}>
                  {c} Sub-County
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800">Phone (Kenyan Format) *</label>
              <Input
                required
                placeholder="+254 7XX XXX XXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800">Status</label>
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'Active' | 'On Leave' | 'Inactive',
                  })
                }
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-800">Email Address (Optional)</label>
            <Input
              type="email"
              placeholder="e.g. c.mutiso@nairobi-campaign.ke"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              Enrol Member
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Modal: Edit Member */}
      <Dialog
        open={Boolean(editingMember)}
        onOpenChange={(open) => !open && setEditingMember(null)}
        title="Edit Team Member Profile"
        description={editingMember ? `Modify assignments for ${editingMember.name}` : ''}
        maxWidth="max-w-md"
      >
        {editingMember && (
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800">Full Name</label>
              <Input
                required
                value={editingMember.name}
                onChange={(e) =>
                  setEditingMember({ ...editingMember, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800">Role</label>
              <Select
                value={editingMember.role}
                onChange={(e) =>
                  setEditingMember({
                    ...editingMember,
                    role: e.target.value as TeamRole,
                  })
                }
              >
                <option value="Campaign Manager">Campaign Manager</option>
                <option value="Sub-County Coordinator">Sub-County Coordinator</option>
                <option value="Field Mobilization Lead">Field Mobilization Lead</option>
                <option value="Communications & Media Director">Communications & Media</option>
                <option value="Youth League Coordinator">Youth League Coordinator</option>
                <option value="Women Caucus Lead">Women Caucus Lead</option>
                <option value="Logistics Specialist">Logistics Specialist</option>
                <option value="Ward Captain">Ward Captain</option>
                <option value="Volunteer Agent">Volunteer Agent</option>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800">Assigned Constituency</label>
              <Select
                value={editingMember.constituency}
                onChange={(e) =>
                  setEditingMember({
                    ...editingMember,
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-800">Phone</label>
                <Input
                  required
                  value={editingMember.phone}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, phone: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-800">Status</label>
                <Select
                  value={editingMember.status}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      status: e.target.value as 'Active' | 'On Leave' | 'Inactive',
                    })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800">Email</label>
              <Input
                type="email"
                value={editingMember.email}
                onChange={(e) =>
                  setEditingMember({ ...editingMember, email: e.target.value })
                }
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingMember(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="default">
                Update Profile
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
};
