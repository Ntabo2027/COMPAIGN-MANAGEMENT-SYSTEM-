import React from 'react';
import { Dialog } from './ui/dialog';
import { Button } from './ui/button';
import { CheckCircle2, Smartphone, Monitor, RotateCcw, Calendar, CheckSquare, MessageSquare, Users, ShieldAlert } from 'lucide-react';
import { useCampaign } from '../context/CampaignContext';

interface TestingGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigateTo: (page: 'dashboard' | 'activities' | 'tasks' | 'issues' | 'team') => void;
}

export const TestingGuideModal: React.FC<TestingGuideModalProps> = ({
  open,
  onOpenChange,
  onNavigateTo,
}) => {
  const { resetToDemoData } = useCampaign();

  const handleTestStep = (page: 'dashboard' | 'activities' | 'tasks' | 'issues' | 'team') => {
    onNavigateTo(page);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="How to Test County Campaign Manager"
      description="Quick walkthrough scenarios to verify all functional features of this Nairobi Governor campaign prototype."
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5 text-sm">
        {/* Notice banner */}
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-emerald-800 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900 leading-relaxed">
            <span className="font-bold">Prototype Integrity:</span> All data is fictional Nairobi campaign sample data. Data persists in your browser storage. You can restore default sample data anytime using the <span className="font-bold">"Reset Demo Data"</span> button.
          </div>
        </div>

        {/* Test Scenarios */}
        <div className="space-y-3">
          <h3 className="font-bold text-zinc-900 text-xs tracking-wider uppercase text-zinc-600">
            Interactive Test Scenarios
          </h3>

          {/* Test 1 */}
          <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl hover:border-zinc-300 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm">Test Dashboard Metrics & Sub-County Filters</h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    View total supporter mobilization target vs current count, key operational alerts, and click on any of Nairobi's 17 sub-counties (e.g. Westlands, Lang'ata, Kasarani) to filter upcoming local events and coordinators.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTestStep('dashboard')}
                className="shrink-0 text-xs h-7"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>

          {/* Test 2 */}
          <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl hover:border-zinc-300 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm">Schedule a New Campaign Rally or Town Hall</h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    Open <strong>Activities</strong> &rarr; click <strong>"Log New Activity"</strong>. Enter event details (e.g. "Kangemi Traders Assembly", venue, target attendance). Submit the form and see it appear instantly in the schedule with badge indicators.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTestStep('activities')}
                className="shrink-0 text-xs h-7"
              >
                Go to Activities
              </Button>
            </div>
          </div>

          {/* Test 3 */}
          <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl hover:border-zinc-300 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm">Manage Campaign Operations on Tasks Kanban</h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    Open <strong>Tasks</strong> &rarr; test dragging or using the <strong>quick-move action buttons</strong> to transition items across columns: <em>To Do &rarr; In Progress &rarr; Under Review &rarr; Completed</em>. Also test the "Add Task" modal.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTestStep('tasks')}
                className="shrink-0 text-xs h-7"
              >
                Go to Tasks
              </Button>
            </div>
          </div>

          {/* Test 4 */}
          <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl hover:border-zinc-300 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm">Log Citizen Community Issues & Upvote</h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    Open <strong>Community Issues</strong> &rarr; view issues logged across Nairobi (water shortages, market sheds, clinic staff). Click <strong>"Verify / Endorse"</strong> on any issue to increment support, or click <strong>"Log Issue"</strong> to report a new ward priority.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTestStep('issues')}
                className="shrink-0 text-xs h-7"
              >
                Go to Issues
              </Button>
            </div>
          </div>

          {/* Test 5 */}
          <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl hover:border-zinc-300 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  5
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm">Enrol Campaign Staff or Field Volunteers</h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    Open <strong>Team & Users</strong> &rarr; view the sub-county coordinator roster. Click <strong>"Add Team Member"</strong> to register a new ward agent or youth coordinator with phone, role, and assigned sub-county.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTestStep('team')}
                className="shrink-0 text-xs h-7"
              >
                Go to Team
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile vs Desktop test notice */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-zinc-100 rounded-xl border border-zinc-200 flex items-start gap-2.5">
            <Smartphone className="h-4 w-4 text-zinc-700 shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-700">
              <strong className="text-zinc-900">Mobile Experience:</strong> Resize your browser window or use DevTools Device Mode (e.g. iPhone / Pixel) to test the bottom navigation bar and mobile cards.
            </div>
          </div>
          <div className="p-3 bg-zinc-100 rounded-xl border border-zinc-200 flex items-start gap-2.5">
            <Monitor className="h-4 w-4 text-zinc-700 shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-700">
              <strong className="text-zinc-900">Desktop Command Center:</strong> Full multi-column view with collapsible sidebar, fast search filters, and wide operational metrics.
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              resetToDemoData();
              onOpenChange(false);
            }}
            className="text-xs text-zinc-600 hover:text-red-700 flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to Sample Data
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Got It, Start Exploring
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
