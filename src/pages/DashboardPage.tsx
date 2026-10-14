import React, { useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { formatNumber, formatDate } from '../lib/utils';
import { NairobiConstituency } from '../types';
import {
  Users,
  Calendar,
  CheckSquare,
  AlertCircle,
  MapPin,
  TrendingUp,
  Clock,
  PlusCircle,
  ShieldCheck,
  ChevronRight,
  Flame,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigateTo: (page: 'dashboard' | 'activities' | 'tasks' | 'issues' | 'team') => void;
  onOpenNewActivity: () => void;
  onOpenNewTask: () => void;
  onOpenNewIssue: () => void;
  onOpenNewTeam: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateTo,
  onOpenNewActivity,
  onOpenNewTask,
  onOpenNewIssue,
  onOpenNewTeam,
}) => {
  const { activities, tasks, issues, teamMembers, constituencyMetrics } = useCampaign();
  const [selectedConstituency, setSelectedConstituency] = useState<NairobiConstituency | 'All'>('All');

  // Aggregates
  const totalMobilized = constituencyMetrics.reduce((acc, c) => acc + c.currentMobilized, 0);
  const totalTarget = constituencyMetrics.reduce((acc, c) => acc + c.supporterTarget, 0);
  const mobilizationPercentage = Math.round((totalMobilized / totalTarget) * 100);

  const upcomingActivities = activities
    .filter((a) => a.status === 'Scheduled' || a.status === 'In Progress')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pendingTasks = tasks.filter((t) => t.status !== 'Completed');
  const completedTasks = tasks.filter((t) => t.status === 'Completed');
  const taskCompletionRate = Math.round((completedTasks.length / (tasks.length || 1)) * 100);

  const criticalIssues = issues.filter((i) => i.severity === 'Critical');

  // Sub-county filtered view
  const filteredActivities = selectedConstituency === 'All'
    ? upcomingActivities.slice(0, 4)
    : activities.filter((a) => a.constituency === selectedConstituency);

  const activeCoordinator = constituencyMetrics.find((c) => c.name === selectedConstituency);

  return (
    <div className="space-y-6 pb-12">
      {/* Campaign Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-zinc-950 to-black text-white p-5 sm:p-7 shadow-md border border-emerald-950/60">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Nairobi County 2027 Gubernatorial Campaign Prototype
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Team Nairobi One Command Center
            </h1>
            <p className="text-zinc-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Real-time grassroots mobilization, rally coordination, ward task distribution, and community policy priorities across all 17 Nairobi sub-counties.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="default"
              onClick={onOpenNewActivity}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-9 sm:h-10"
            >
              <PlusCircle className="h-4 w-4" />
              Log Activity
            </Button>
            <Button
              variant="secondary"
              onClick={onOpenNewTask}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium text-xs h-9 sm:h-10 border border-zinc-700"
            >
              <CheckSquare className="h-4 w-4" />
              Assign Task
            </Button>
            <Button
              variant="secondary"
              onClick={onOpenNewIssue}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium text-xs h-9 sm:h-10 border border-zinc-700"
            >
              <AlertCircle className="h-4 w-4" />
              Report Issue
            </Button>
          </div>
        </div>

        {/* Ambient watermark graphics */}
        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
          <div className="w-64 h-64 rounded-full border-16 border-emerald-500" />
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <Card className="border-l-4 border-l-emerald-600 bg-white shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                Supporters Mobilized
              </span>
              <Users className="h-4 w-4 text-emerald-700" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-zinc-950">
              {formatNumber(totalMobilized)}
            </div>
            <div className="mt-2.5">
              <div className="flex justify-between text-[11px] font-medium text-zinc-500 mb-1">
                <span>Target: {formatNumber(totalTarget)}</span>
                <span className="text-emerald-700 font-bold">{mobilizationPercentage}%</span>
              </div>
              <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(mobilizationPercentage, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="border-l-4 border-l-zinc-900 bg-white shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                Campaign Events
              </span>
              <Calendar className="h-4 w-4 text-zinc-900" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-zinc-950">
              {activities.length} Total
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-zinc-500 font-medium">
              <span className="text-emerald-700 font-bold">
                {upcomingActivities.length} Upcoming
              </span>
              <span>
                {activities.filter((a) => a.status === 'Completed').length} Completed
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="border-l-4 border-l-emerald-600 bg-white shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                Operations Tasks
              </span>
              <CheckSquare className="h-4 w-4 text-emerald-700" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-zinc-950">
              {pendingTasks.length} Pending
            </div>
            <div className="mt-2.5">
              <div className="flex justify-between text-[11px] font-medium text-zinc-500 mb-1">
                <span>{completedTasks.length} of {tasks.length} Done</span>
                <span className="text-zinc-900 font-bold">{taskCompletionRate}%</span>
              </div>
              <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-zinc-800 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(taskCompletionRate, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card className="border-l-4 border-l-amber-600 bg-white shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                Community Issues
              </span>
              <AlertCircle className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-zinc-950">
              {issues.length} Logged
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-zinc-500 font-medium">
              <span className="text-red-600 font-bold">
                {criticalIssues.length} Critical
              </span>
              <span className="text-emerald-700 font-bold">
                {issues.filter((i) => i.status === 'Manifesto Pledged' || i.status === 'Resolved').length} Pledged
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Sub-County Momentum & Upcoming Schedules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Sub-County Momentum Tracker */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-white shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base text-zinc-900 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-700" />
                  Nairobi Sub-Counties & Wards Ground Momentum
                </CardTitle>
                <CardDescription>
                  Click on any sub-county to filter activities and coordinator contacts.
                </CardDescription>
              </div>

              {selectedConstituency !== 'All' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedConstituency('All')}
                  className="text-xs text-emerald-700 hover:text-emerald-800"
                >
                  Clear Filter
                </Button>
              )}
            </CardHeader>

            <CardContent>
              {/* Constituency Filter Chips Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                {constituencyMetrics.map((item) => {
                  const isSelected = selectedConstituency === item.name;
                  const progressPct = Math.round((item.currentMobilized / item.supporterTarget) * 100);

                  return (
                    <button
                      key={item.name}
                      onClick={() =>
                        setSelectedConstituency(isSelected ? 'All' : item.name)
                      }
                      className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-50/80 ring-2 ring-emerald-600/30'
                          : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-zinc-900 truncate">
                          {item.name}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-sm font-semibold uppercase ${
                            item.momentum === 'Stronghold'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.momentum === 'High Momentum'
                              ? 'bg-green-100 text-green-800'
                              : item.momentum === 'Battleground'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-zinc-100 text-zinc-700'
                          }`}
                        >
                          {item.momentum === 'High Momentum' ? 'Surging' : item.momentum}
                        </span>
                      </div>

                      <div className="text-[11px] text-zinc-500 font-mono">
                        {formatNumber(item.currentMobilized)} / {formatNumber(item.supporterTarget)}
                      </div>

                      <div className="w-full bg-zinc-200 h-1 rounded-full overflow-hidden mt-1.5">
                        <div
                          className="bg-emerald-600 h-full rounded-full"
                          style={{ width: `${Math.min(progressPct, 100)}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Selection Details Card */}
              {selectedConstituency !== 'All' && activeCoordinator && (
                <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-emerald-950 text-sm">
                      {activeCoordinator.name} Sub-County Operations
                    </div>
                    <div className="text-zinc-600 mt-0.5">
                      Sub-County Lead: <strong className="text-zinc-900">{activeCoordinator.coordinatorName}</strong> &bull; Status: <span className="font-semibold text-emerald-800">{activeCoordinator.momentum}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigateTo('activities')}
                      className="text-xs h-8 bg-white border-emerald-300 text-emerald-900 hover:bg-emerald-100"
                    >
                      View All Events in {activeCoordinator.name}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Schedule Spotlight */}
          <Card className="bg-white shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base text-zinc-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-700" />
                  Upcoming Mobilization Activities
                  {selectedConstituency !== 'All' && (
                    <Badge variant="outline" className="text-[10px] ml-1">
                      {selectedConstituency}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Campaign rallies, market walks, and volunteer briefings on the calendar.
                </CardDescription>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTo('activities')}
                className="text-xs text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-semibold"
              >
                Full Schedule
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-3">
              {filteredActivities.length === 0 ? (
                <div className="text-center py-6 text-zinc-500 text-xs">
                  No upcoming activities for {selectedConstituency}. Click "Log Activity" to schedule one.
                </div>
              ) : (
                filteredActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant={
                            act.type === 'Mega Rally'
                              ? 'default'
                              : act.type === 'Market Walk'
                              ? 'warning'
                              : 'secondary'
                          }
                          className="text-[10px]"
                        >
                          {act.type}
                        </Badge>
                        <span className="text-xs font-bold text-zinc-900">
                          {act.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-zinc-600 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-emerald-700 shrink-0" />
                          {act.wardOrVenue} ({act.constituency})
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-zinc-400 shrink-0" />
                          {formatDate(act.date)} at {act.time}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-semibold text-zinc-900">
                          Target: {formatNumber(act.targetAttendance)}
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          Lead: {act.leadOrganizer.split(' ')[0]}
                        </div>
                      </div>
                      <Badge
                        variant={
                          act.status === 'Completed'
                            ? 'success'
                            : act.status === 'In Progress'
                            ? 'default'
                            : 'outline'
                        }
                        className="text-[10px]"
                      >
                        {act.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col): Operational Priorities & High Severity Issues */}
        <div className="space-y-4">
          {/* Action Tasks Due Soon */}
          <Card className="bg-white shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base text-zinc-900 flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-emerald-700" />
                  Urgent Campaign Tasks
                </CardTitle>
                <CardDescription>High priority actions requiring sign-off.</CardDescription>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTo('tasks')}
                className="text-xs text-emerald-700 font-semibold p-1"
              >
                Kanban
                <ChevronRight className="h-3.5 w-3.5 inline" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-2.5">
              {tasks
                .filter((t) => t.status !== 'Completed')
                .slice(0, 4)
                .map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg border border-zinc-200 bg-white hover:border-zinc-300 transition-colors text-xs space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-zinc-900 leading-snug line-clamp-1">
                        {task.title}
                      </span>
                      <Badge
                        variant={task.priority === 'High' ? 'danger' : 'secondary'}
                        className="text-[9px] shrink-0"
                      >
                        {task.priority}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-500">
                      <span>Assigned: {task.assignedTo}</span>
                      <span className="text-zinc-700 font-medium">Due: {formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateTo('tasks')}
                className="w-full text-xs mt-2 text-zinc-700"
              >
                View All {tasks.length} Operational Tasks
              </Button>
            </CardContent>
          </Card>

          {/* Grassroots Priority Issues */}
          <Card className="bg-white shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base text-zinc-900 flex items-center gap-2">
                  <Flame className="h-4 w-4 text-amber-600" />
                  Top Nairobi Community Issues
                </CardTitle>
                <CardDescription>Grassroots priorities for manifesto pledges.</CardDescription>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTo('issues')}
                className="text-xs text-emerald-700 font-semibold p-1"
              >
                All Issues
                <ChevronRight className="h-3.5 w-3.5 inline" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-2.5">
              {issues.slice(0, 3).map((issue) => (
                <div
                  key={issue.id}
                  className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/60 hover:bg-zinc-50 transition-colors text-xs space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <span className="font-semibold text-zinc-900 line-clamp-2 leading-tight">
                      {issue.title}
                    </span>
                    <Badge
                      variant={issue.severity === 'Critical' ? 'danger' : 'warning'}
                      className="text-[9px] shrink-0"
                    >
                      {issue.severity}
                    </Badge>
                  </div>

                  <div className="text-[11px] text-zinc-500 flex items-center justify-between">
                    <span className="font-medium text-emerald-800">{issue.constituency}</span>
                    <span>{issue.upvotes} Citizens Endorsed</span>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={onOpenNewIssue}
                className="w-full text-xs mt-2 border-dashed border-zinc-300 text-emerald-800 hover:bg-emerald-50"
              >
                + Log New Community Concern
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
