import React, { useState } from 'react';
import { CampaignProvider } from './context/CampaignContext';
import { Navigation, PageId } from './components/Navigation';
import { DashboardPage } from './pages/DashboardPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { TasksPage } from './pages/TasksPage';
import { CommunityIssuesPage } from './pages/CommunityIssuesPage';
import { TeamPage } from './pages/TeamPage';
import { TestingGuideModal } from './components/TestingGuideModal';
import { ToastContainer } from './components/ui/toast';
import { ShieldCheck, HelpCircle, AlertCircle } from 'lucide-react';
import { Button } from './components/ui/button';

export function CampaignApp() {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [isTestingGuideOpen, setIsTestingGuideOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modal states for quick additions
  const [isNewActivityOpen, setIsNewActivityOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isNewIssueOpen, setIsNewIssueOpen] = useState(false);
  const [isNewTeamOpen, setIsNewTeamOpen] = useState(false);

  const handleOpenNewActivity = () => {
    setCurrentPage('activities');
    setIsNewActivityOpen(true);
  };

  const handleOpenNewTask = () => {
    setCurrentPage('tasks');
    setIsNewTaskOpen(true);
  };

  const handleOpenNewIssue = () => {
    setCurrentPage('issues');
    setIsNewIssueOpen(true);
  };

  const handleOpenNewTeam = () => {
    setCurrentPage('team');
    setIsNewTeamOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 font-sans flex flex-col">
      {/* Navigation (Desktop Sidebar & Mobile Header/Bottom Bar) */}
      <Navigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onOpenTestingGuide={() => setIsTestingGuideOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Prototype Header Strip (Desktop) */}
        <header className="hidden lg:flex items-center justify-between px-8 py-3.5 bg-white border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm text-zinc-800">
              Nairobi County Governor Operations Desk
            </span>
            <span className="text-zinc-300">|</span>
            <span className="text-xs text-zinc-500 font-medium">
              County Campaign Manager Prototype (Fictional Data)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTestingGuideOpen(true)}
              className="text-xs h-8 border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-semibold"
            >
              <HelpCircle className="h-3.5 w-3.5 text-emerald-700" />
              How to Test Prototype
            </Button>

            <div className="flex items-center gap-2 pl-3 border-l border-zinc-200 text-xs">
              <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                HQ
              </div>
              <div className="leading-tight">
                <div className="font-bold text-zinc-800">Command Center</div>
                <div className="text-[10px] text-zinc-500">Kenyatta Ave HQ</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          {currentPage === 'dashboard' && (
            <DashboardPage
              onNavigateTo={setCurrentPage}
              onOpenNewActivity={handleOpenNewActivity}
              onOpenNewTask={handleOpenNewTask}
              onOpenNewIssue={handleOpenNewIssue}
              onOpenNewTeam={handleOpenNewTeam}
            />
          )}

          {currentPage === 'activities' && (
            <ActivitiesPage
              isNewModalOpen={isNewActivityOpen}
              setIsNewModalOpen={setIsNewActivityOpen}
            />
          )}

          {currentPage === 'tasks' && (
            <TasksPage
              isNewModalOpen={isNewTaskOpen}
              setIsNewModalOpen={setIsNewTaskOpen}
            />
          )}

          {currentPage === 'community-issues' as any && (
            <CommunityIssuesPage
              isNewModalOpen={isNewIssueOpen}
              setIsNewModalOpen={setIsNewIssueOpen}
            />
          )}

          {currentPage === 'issues' && (
            <CommunityIssuesPage
              isNewModalOpen={isNewIssueOpen}
              setIsNewModalOpen={setIsNewIssueOpen}
            />
          )}

          {currentPage === 'team' && (
            <TeamPage
              isNewModalOpen={isNewTeamOpen}
              setIsNewModalOpen={setIsNewTeamOpen}
            />
          )}
        </main>
      </div>

      {/* Global Interactive Testing Guide Modal */}
      <TestingGuideModal
        open={isTestingGuideOpen}
        onOpenChange={setIsTestingGuideOpen}
        onNavigateTo={setCurrentPage}
      />

      {/* Global Toast Feedback Notification Container */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <CampaignProvider>
      <CampaignApp />
    </CampaignProvider>
  );
}
