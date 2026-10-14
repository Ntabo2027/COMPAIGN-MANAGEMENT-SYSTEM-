import React from 'react';
import { useCampaign } from '../context/CampaignContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  AlertCircle,
  Users,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  MapPin,
  Sparkles,
} from 'lucide-react';

export type PageId = 'dashboard' | 'activities' | 'tasks' | 'issues' | 'team';

interface NavigationProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  onOpenTestingGuide: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  setCurrentPage,
  onOpenTestingGuide,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const { activities, tasks, issues, teamMembers, resetToDemoData } = useCampaign();

  const pendingTasksCount = tasks.filter((t) => t.status !== 'Completed').length;
  const criticalIssuesCount = issues.filter((i) => i.severity === 'Critical').length;
  const scheduledActivitiesCount = activities.filter((a) => a.status === 'Scheduled').length;

  const navItems: { id: PageId; label: string; icon: React.ReactNode; badge?: string | number; badgeVariant?: 'default' | 'danger' | 'secondary' | 'warning' }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      id: 'activities',
      label: 'Activities',
      icon: <Calendar className="h-4 w-4" />,
      badge: scheduledActivitiesCount,
      badgeVariant: 'secondary',
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: <CheckSquare className="h-4 w-4" />,
      badge: pendingTasksCount,
      badgeVariant: 'warning',
    },
    {
      id: 'issues',
      label: 'Community Issues',
      icon: <AlertCircle className="h-4 w-4" />,
      badge: criticalIssuesCount > 0 ? `${criticalIssuesCount} crit` : undefined,
      badgeVariant: 'danger',
    },
    {
      id: 'team',
      label: 'Team & Users',
      icon: <Users className="h-4 w-4" />,
      badge: teamMembers.length,
      badgeVariant: 'secondary',
    },
  ];

  const handleNavClick = (id: PageId) => {
    setCurrentPage(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 bg-zinc-950 text-white z-40 border-r border-zinc-800">
        {/* Brand Header */}
        <div className="p-5 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-md font-extrabold text-lg">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                County Campaign
              </h2>
              <p className="text-[11px] text-emerald-400 font-semibold tracking-wide">
                Nairobi Governor 2027
              </p>
            </div>
          </div>
        </div>

        {/* Candidate Banner Card */}
        <div className="px-4 py-3 bg-zinc-900/70 border-b border-zinc-800">
          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Official Campaign
          </div>
          <div className="text-xs font-bold text-zinc-100 mt-0.5">
            Eng. Davis M. Mwangi
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5 font-medium">
            <MapPin className="h-3 w-3 shrink-0" />
            Nairobi City County &bull; 17 Wards
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-300">
            Navigation
          </div>

          {navItems.map((item) => {
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white' : 'text-zinc-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <Badge
                    variant={
                      isActive
                        ? 'black'
                        : item.badgeVariant || 'secondary'
                    }
                    className="text-[9px] px-1.5 py-0 font-bold"
                  >
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Testing & Actions */}
        <div className="p-3 border-t border-zinc-800 space-y-2 bg-zinc-950/90">
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenTestingGuide}
            className="w-full text-xs h-8.5 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900 border border-emerald-800/60 font-semibold flex items-center justify-center gap-1.5"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            How to Test Prototype
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={resetToDemoData}
            className="w-full text-[11px] h-7 text-zinc-400 hover:text-red-400 hover:bg-zinc-900 flex items-center justify-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Reset Demo Data
          </Button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-zinc-950 text-white border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-xs text-white leading-tight">
              County Campaign Manager
            </h1>
            <p className="text-[10px] text-emerald-400 font-medium">
              Nairobi Governor 2027
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenTestingGuide}
            className="h-7 text-[11px] px-2 bg-emerald-900 text-emerald-200 border border-emerald-700 font-semibold"
          >
            <HelpCircle className="h-3 w-3 mr-1" />
            Test Guide
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="h-8 w-8 text-zinc-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile Drawer (When Open) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-zinc-950 text-white rounded-t-2xl p-5 border-t border-zinc-800 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <span className="font-bold text-sm">Campaign Navigation</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                className="h-8 w-8 text-zinc-400"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <Badge variant={isActive ? 'black' : 'secondary'} className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-zinc-800 space-y-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  onOpenTestingGuide();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-xs bg-emerald-700 hover:bg-emerald-800"
              >
                <HelpCircle className="h-3.5 w-3.5 mr-1.5" />
                Open Prototype Testing Guide
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  resetToDemoData();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-xs text-zinc-400 hover:text-red-400"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Reset Sample Demo Data
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Fixed Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-zinc-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 min-w-[58px] rounded-lg cursor-pointer transition-colors ${
                isActive
                  ? 'text-emerald-800 font-bold'
                  : 'text-zinc-500 hover:text-zinc-900 font-medium'
              }`}
            >
              <div className="relative">
                <span className={isActive ? 'text-emerald-700' : 'text-zinc-500'}>
                  {item.icon}
                </span>
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2.5 w-2 h-2 rounded-full bg-emerald-600" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[62px]">
                {item.id === 'issues' ? 'Issues' : item.id === 'team' ? 'Team' : item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
