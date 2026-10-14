import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_ACTIVITIES,
  INITIAL_CONSTITUENCY_METRICS,
  INITIAL_ISSUES,
  INITIAL_TASKS,
  INITIAL_TEAM_MEMBERS,
} from '../data/mockData';
import {
  Activity,
  CommunityIssue,
  ConstituencyMetric,
  Task,
  TaskStatus,
  TeamMember,
} from '../types';

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning';
}

interface CampaignContextType {
  activities: Activity[];
  tasks: Task[];
  issues: CommunityIssue[];
  teamMembers: TeamMember[];
  constituencyMetrics: ConstituencyMetric[];
  
  // Activities
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;

  // Tasks
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTaskStatus: (id: string, newStatus: TaskStatus) => void;

  // Community Issues
  addIssue: (issue: Omit<CommunityIssue, 'id' | 'upvotes'>) => void;
  updateIssue: (id: string, updates: Partial<CommunityIssue>) => void;
  deleteIssue: (id: string) => void;
  upvoteIssue: (id: string) => void;

  // Team
  addTeamMember: (member: Omit<TeamMember, 'id' | 'assignedTasksCount'>) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;

  // Demo Control
  resetToDemoData: () => void;

  // Toast
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  showToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning') => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ACTIVITIES: 'nairobi_campaign_activities_v1',
  TASKS: 'nairobi_campaign_tasks_v1',
  ISSUES: 'nairobi_campaign_issues_v1',
  TEAM: 'nairobi_campaign_team_v1',
  METRICS: 'nairobi_campaign_metrics_v1',
};

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [issues, setIssues] = useState<CommunityIssue[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ISSUES);
    return saved ? JSON.parse(saved) : INITIAL_ISSUES;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TEAM);
    return saved ? JSON.parse(saved) : INITIAL_TEAM_MEMBERS;
  });

  const [constituencyMetrics, setConstituencyMetrics] = useState<ConstituencyMetric[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.METRICS);
    return saved ? JSON.parse(saved) : INITIAL_CONSTITUENCY_METRICS;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(constituencyMetrics));
  }, [constituencyMetrics]);

  const showToast = (title: string, description?: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Activity methods
  const addActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activity,
      id: `act-${Date.now().toString(36)}`,
    };
    setActivities((prev) => [newActivity, ...prev]);
    showToast('Activity Logged', `"${newActivity.title}" added to campaign schedule.`);
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === id ? { ...act, ...updates } : act))
    );
    showToast('Activity Updated', 'Schedule changes have been recorded.');
  };

  const deleteActivity = (id: string) => {
    const item = activities.find((a) => a.id === id);
    setActivities((prev) => prev.filter((act) => act.id !== id));
    showToast('Activity Removed', item ? `"${item.title}" removed.` : 'Activity removed.', 'info');
  };

  // Task methods
  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now().toString(36)}`,
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast('Task Created', `"${newTask.title}" assigned to ${newTask.assignedTo}.`);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    showToast('Task Updated', 'Task details updated.');
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task Deleted', 'Task removed from board.', 'info');
  };

  const moveTaskStatus = (id: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: newStatus,
              completedAt: newStatus === 'Completed' ? new Date().toISOString().split('T')[0] : undefined,
            }
          : t
      )
    );
    showToast('Task Moved', `Status set to ${newStatus}.`);
  };

  // Community Issues
  const addIssue = (issue: Omit<CommunityIssue, 'id' | 'upvotes'>) => {
    const newIssue: CommunityIssue = {
      ...issue,
      id: `iss-${Date.now().toString(36)}`,
      upvotes: 1,
    };
    setIssues((prev) => [newIssue, ...prev]);
    showToast('Community Issue Logged', `Logged: "${newIssue.title}" for ${newIssue.constituency}.`);
  };

  const updateIssue = (id: string, updates: Partial<CommunityIssue>) => {
    setIssues((prev) =>
      prev.map((iss) => (iss.id === id ? { ...iss, ...updates } : iss))
    );
    showToast('Issue Updated', 'Community issue status saved.');
  };

  const deleteIssue = (id: string) => {
    setIssues((prev) => prev.filter((i) => i.id !== id));
    showToast('Issue Removed', 'Item removed from registry.', 'info');
  };

  const upvoteIssue = (id: string) => {
    setIssues((prev) =>
      prev.map((iss) => (iss.id === id ? { ...iss, upvotes: iss.upvotes + 1 } : iss))
    );
    showToast('Endorsement Added', '+1 community endorsement recorded.');
  };

  // Team
  const addTeamMember = (member: Omit<TeamMember, 'id' | 'assignedTasksCount'>) => {
    const colors = ['bg-emerald-700', 'bg-green-800', 'bg-slate-800', 'bg-teal-700', 'bg-emerald-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newMember: TeamMember = {
      ...member,
      id: `team-${Date.now().toString(36)}`,
      assignedTasksCount: 0,
      avatarBgColor: member.avatarBgColor || randomColor,
    };
    setTeamMembers((prev) => [...prev, newMember]);
    showToast('Team Member Added', `${newMember.name} has been enrolled.`);
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    showToast('Member Updated', 'Profile updated.');
  };

  const deleteTeamMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
    showToast('Member Removed', 'Team member removed.', 'info');
  };

  const resetToDemoData = () => {
    setActivities(INITIAL_ACTIVITIES);
    setTasks(INITIAL_TASKS);
    setIssues(INITIAL_ISSUES);
    setTeamMembers(INITIAL_TEAM_MEMBERS);
    setConstituencyMetrics(INITIAL_CONSTITUENCY_METRICS);
    localStorage.clear();
    showToast('Reset Complete', 'Fictional demo data restored to initial state.', 'info');
  };

  return (
    <CampaignContext.Provider
      value={{
        activities,
        tasks,
        issues,
        teamMembers,
        constituencyMetrics,
        addActivity,
        updateActivity,
        deleteActivity,
        addTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        addIssue,
        updateIssue,
        deleteIssue,
        upvoteIssue,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        resetToDemoData,
        toasts,
        dismissToast,
        showToast,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
};
