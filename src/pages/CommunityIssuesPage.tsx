import React, { useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input, Select, Textarea } from '../components/ui/input';
import { Dialog } from '../components/ui/dialog';
import {
  CommunityIssue,
  IssueCategory,
  IssueSeverity,
  IssueStatus,
  NAIROBI_CONSTITUENCIES,
  NairobiConstituency,
} from '../types';
import { formatDate } from '../lib/utils';
import {
  AlertCircle,
  Plus,
  Search,
  Filter,
  ThumbsUp,
  MapPin,
  Clock,
  CheckCircle2,
  BookmarkCheck,
  ShieldAlert,
  Trash2,
  Edit,
  Sparkles,
} from 'lucide-react';

interface CommunityIssuesPageProps {
  isNewModalOpen: boolean;
  setIsNewModalOpen: (open: boolean) => void;
}

export const CommunityIssuesPage: React.FC<CommunityIssuesPageProps> = ({
  isNewModalOpen,
  setIsNewModalOpen,
}) => {
  const { issues, addIssue, updateIssue, deleteIssue, upvoteIssue } = useCampaign();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterConstituency, setFilterConstituency] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // New Issue form
  const [formData, setFormData] = useState({
    title: '',
    category: 'Water & Sanitation' as IssueCategory,
    constituency: "Lang'ata" as NairobiConstituency,
    ward: '',
    locationDetails: '',
    severity: 'High' as IssueSeverity,
    status: 'Logged' as IssueStatus,
    reportedBy: '',
    pledgedSolution: '',
  });

  // Edit / Status update modal
  const [editingIssue, setEditingIssue] = useState<CommunityIssue | null>(null);
  const [editStatus, setEditStatus] = useState<IssueStatus>('Manifesto Pledged');
  const [editPledge, setEditPledge] = useState<string>('');

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.locationDetails.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.ward.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.reportedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesConst =
      filterConstituency === 'All' || issue.constituency === filterConstituency;
    const matchesCategory =
      filterCategory === 'All' || issue.category === filterCategory;
    const matchesSeverity =
      filterSeverity === 'All' || issue.severity === filterSeverity;
    const matchesStatus =
      filterStatus === 'All' || issue.status === filterStatus;

    return matchesSearch && matchesConst && matchesCategory && matchesSeverity && matchesStatus;
  });

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.ward || !formData.reportedBy) return;

    addIssue({
      title: formData.title,
      category: formData.category,
      constituency: formData.constituency,
      ward: formData.ward,
      locationDetails: formData.locationDetails,
      severity: formData.severity,
      status: formData.status,
      reportedBy: formData.reportedBy,
      dateReported: new Date().toISOString().split('T')[0],
      pledgedSolution: formData.pledgedSolution || 'Awaiting policy team manifesto review.',
    });

    setIsNewModalOpen(false);
    // Reset
    setFormData({
      title: '',
      category: 'Water & Sanitation',
      constituency: "Lang'ata",
      ward: '',
      locationDetails: '',
      severity: 'High',
      status: 'Logged',
      reportedBy: '',
      pledgedSolution: '',
    });
  };

  const handleOpenEdit = (issue: CommunityIssue) => {
    setEditingIssue(issue);
    setEditStatus(issue.status);
    setEditPledge(issue.pledgedSolution);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIssue) return;

    updateIssue(editingIssue.id, {
      status: editStatus,
      pledgedSolution: editPledge,
    });
    setEditingIssue(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Nairobi Citizen Voice & Community Issues Registry
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Log grassroots citizen grievances, track campaign manifesto pledges, and solve ward priorities.
          </p>
        </div>

        <Button
          variant="default"
          onClick={() => setIsNewModalOpen(true)}
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
          Log Community Issue
        </Button>
      </div>

      {/* Category Pills Quick Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          'All',
          'Water & Sanitation',
          'Waste Management',
          'Hawkers & Trade Markets',
          'Roads & Drainage',
          'Youth Jobs & Vocational',
          'Healthcare Clinics',
          'Street Lighting & Security',
        ].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors border ${
              filterCategory === cat
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-zinc-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search problem, ward, association..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          {/* Sub-county */}
          <div>
            <Select
              value={filterConstituency}
              onChange={(e) => setFilterConstituency(e.target.value)}
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

          {/* Severity */}
          <div>
            <Select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="h-9 text-xs"
            >
              <option value="All">All Severity Levels</option>
              <option value="Critical">Critical Emergency</option>
              <option value="High">High Urgency</option>
              <option value="Moderate">Moderate Priority</option>
            </Select>
          </div>

          {/* Status */}
          <div>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-9 text-xs"
            >
              <option value="All">All Resolution Stages</option>
              <option value="Logged">Logged</option>
              <option value="Investigating">Investigating</option>
              <option value="Action Plan Drafted">Action Plan Drafted</option>
              <option value="Manifesto Pledged">Manifesto Pledged</option>
              <option value="Resolved">Resolved</option>
            </Select>
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between text-xs text-zinc-500 pt-1 border-t border-zinc-100">
          <span>
            Showing <strong className="text-zinc-900">{filteredIssues.length}</strong> of{' '}
            {issues.length} verified community concerns
          </span>
          {(searchTerm || filterConstituency !== 'All' || filterCategory !== 'All' || filterSeverity !== 'All' || filterStatus !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterConstituency('All');
                setFilterCategory('All');
                setFilterSeverity('All');
                setFilterStatus('All');
              }}
              className="text-emerald-700 hover:underline font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Issues List Grid */}
      {filteredIssues.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-zinc-300 p-6">
          <AlertCircle className="h-10 w-10 text-zinc-400 mx-auto mb-3" />
          <h3 className="font-bold text-zinc-800 text-sm">No community issues match criteria</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
            Try adjusting your search criteria or report a new citizen priority.
          </p>
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsNewModalOpen(true)}
            className="mt-4 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Log Community Issue
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIssues.map((issue) => (
            <Card
              key={issue.id}
              className="bg-white border-zinc-200 hover:border-zinc-300 transition-all flex flex-col justify-between"
            >
              <CardContent className="p-4 sm:p-5 space-y-3.5">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant={
                          issue.severity === 'Critical'
                            ? 'danger'
                            : issue.severity === 'High'
                            ? 'warning'
                            : 'secondary'
                        }
                        className="text-[10px]"
                      >
                        {issue.severity}
                      </Badge>

                      <Badge
                        variant={
                          issue.status === 'Resolved'
                            ? 'success'
                            : issue.status === 'Manifesto Pledged'
                            ? 'default'
                            : issue.status === 'Action Plan Drafted'
                            ? 'info'
                            : 'outline'
                        }
                        className="text-[10px]"
                      >
                        {issue.status}
                      </Badge>

                      <span className="text-[11px] text-zinc-500 font-medium">
                        {issue.category}
                      </span>
                    </div>

                    <h3 className="font-bold text-zinc-900 text-sm sm:text-base leading-snug">
                      {issue.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEdit(issue)}
                      className="h-8 w-8 text-zinc-500 hover:text-zinc-900"
                      title="Update Pledge & Status"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteIssue(issue.id)}
                      className="h-8 w-8 text-zinc-400 hover:text-red-600"
                      title="Delete Issue"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Location & Reported By */}
                <div className="text-xs text-zinc-600 space-y-1.5 bg-zinc-50 p-2.5 rounded-lg border border-zinc-150">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                    <span>
                      <strong className="text-zinc-900">{issue.constituency}</strong> &bull; {issue.ward}
                    </span>
                  </div>
                  <p className="text-zinc-700 leading-relaxed text-[11px]">
                    {issue.locationDetails}
                  </p>
                </div>

                {/* Campaign Manifesto Pledge */}
                <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-[11px] uppercase tracking-wider">
                    <BookmarkCheck className="h-3.5 w-3.5 text-emerald-700" />
                    Campaign Manifesto Action Pledge:
                  </div>
                  <p className="text-emerald-900 leading-relaxed text-xs">
                    {issue.pledgedSolution}
                  </p>
                </div>

                {/* Footer Info & Endorsement Button */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-xs">
                  <div className="text-[11px] text-zinc-500">
                    Source: <strong className="text-zinc-700">{issue.reportedBy}</strong> &bull; {formatDate(issue.dateReported)}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => upvoteIssue(issue.id)}
                    className="h-7 text-xs px-2.5 text-emerald-800 border-emerald-300 hover:bg-emerald-50 flex items-center gap-1 font-semibold"
                    title="Click to endorse this citizen concern"
                  >
                    <ThumbsUp className="h-3 w-3 text-emerald-600" />
                    <span>{issue.upvotes} Endorse</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal: New Community Issue */}
      <Dialog
        open={isNewModalOpen}
        onOpenChange={setIsNewModalOpen}
        title="Log Nairobi Community Issue"
        description="Register a ward problem identified during town halls, door-to-door visits, or stakeholder meetings."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmitNew} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-800">Issue Summary / Title *</label>
            <Input
              required
              placeholder="e.g. Acute piped water shortage in Southlands Estate"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800">Category *</label>
              <Select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as IssueCategory })
                }
              >
                <option value="Water & Sanitation">Water & Sanitation</option>
                <option value="Waste Management">Waste Management</option>
                <option value="Hawkers & Trade Markets">Hawkers & Trade Markets</option>
                <option value="Roads & Drainage">Roads & Drainage</option>
                <option value="Youth Jobs & Vocational">Youth Jobs & Vocational</option>
                <option value="Healthcare Clinics">Healthcare Clinics</option>
                <option value="Street Lighting & Security">Street Lighting & Security</option>
                <option value="Early Childhood Education">Early Childhood Education</option>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800">Sub-County *</label>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800">Ward & Exact Location *</label>
              <Input
                required
                placeholder="e.g. Southlands / Karanja Road"
                value={formData.ward}
                onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800">Severity Level *</label>
              <Select
                value={formData.severity}
                onChange={(e) =>
                  setFormData({ ...formData, severity: e.target.value as IssueSeverity })
                }
              >
                <option value="Critical">Critical Emergency</option>
                <option value="High">High Urgency</option>
                <option value="Moderate">Moderate Priority</option>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-800">Grassroots Problem Details *</label>
            <Textarea
              rows={2}
              required
              placeholder="Describe how this affects residents, business operations, or safety..."
              value={formData.locationDetails}
              onChange={(e) => setFormData({ ...formData, locationDetails: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-800">
              Reported By (Group, Elder, Resident Association) *
            </label>
            <Input
              required
              placeholder="e.g. Langata Estate Welfare Association / Boda Sacco"
              value={formData.reportedBy}
              onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-800">
              Proposed Campaign Manifesto Commitment / Solution
            </label>
            <Textarea
              rows={2}
              placeholder="e.g. County borehole commissioning within 90 days of taking office..."
              value={formData.pledgedSolution}
              onChange={(e) => setFormData({ ...formData, pledgedSolution: e.target.value })}
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
              Submit & Register Issue
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Modal: Edit Status & Pledge */}
      <Dialog
        open={Boolean(editingIssue)}
        onOpenChange={(open) => !open && setEditingIssue(null)}
        title="Update Resolution Status & Manifesto Pledge"
        description={editingIssue ? `${editingIssue.title} (${editingIssue.constituency})` : ''}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-800">Current Campaign Status</label>
            <Select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as IssueStatus)}
            >
              <option value="Logged">Logged</option>
              <option value="Investigating">Investigating</option>
              <option value="Action Plan Drafted">Action Plan Drafted</option>
              <option value="Manifesto Pledged">Manifesto Pledged</option>
              <option value="Resolved">Resolved</option>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-800">
              Manifesto Policy Pledge
            </label>
            <Textarea
              rows={3}
              value={editPledge}
              onChange={(e) => setEditPledge(e.target.value)}
              placeholder="Governor campaign commitment to the residents..."
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingIssue(null)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Save Status
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
