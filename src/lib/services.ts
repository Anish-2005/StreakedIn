import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';

// Types
export interface Goal {
  id: string;
  title: string;
  description?: string;
  progress: number;
  deadline: string;
  category: string;
  aiSuggested: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'completed' | 'paused';
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  goalId?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalyticsData {
  id: string;
  userId: string;
  date: string;
  productivityScore: number;
  tasksCompleted: number;
  goalsProgressed: number;
  timeSpent: number; // in minutes
  createdAt: Date;
}

export interface UserStats {
  totalGoals: number;
  completedGoals: number;
  totalTasks: number;
  completedTasks: number;
  productivityScore: number;
  streakDays: number;
  networkGrowth: number;
}

// Goals Service
export class GoalsService {
  static async createGoal(userId: string, goalData: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'goals'), {
        ...goalData,
        userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  }

  static async updateGoal(goalId: string, updates: Partial<Omit<Goal, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
    try {
      const goalRef = doc(db, 'goals', goalId);
      await updateDoc(goalRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  }

  static async deleteGoal(goalId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'goals', goalId));
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  }

  static subscribeToGoals(userId: string, callback: (goals: Goal[]) => void): () => void {
    const q = query(
      collection(db, 'goals'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const goals: Goal[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        goals.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Goal);
      });
      callback(goals);
    });
  }

  static async getGoalById(goalId: string): Promise<Goal | null> {
    try {
      const docRef = doc(db, 'goals', goalId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Goal;
      }
      return null;
    } catch (error) {
      console.error('Error getting goal:', error);
      throw error;
    }
  }
}

// Tasks Service
export class TasksService {
  static async createTask(userId: string, taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'tasks'), {
        ...taskData,
        userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  static async updateTask(taskId: string, updates: Partial<Omit<Task, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  static async deleteTask(taskId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  static subscribeToTasks(userId: string, callback: (tasks: Task[]) => void): () => void {
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const tasks: Task[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tasks.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Task);
      });
      callback(tasks);
    });
  }

  static subscribeToTasksByGoal(userId: string, goalId: string, callback: (tasks: Task[]) => void): () => void {
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', userId),
      where('goalId', '==', goalId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const tasks: Task[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tasks.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Task);
      });
      callback(tasks);
    });
  }
}

// Analytics Service
export class AnalyticsService {
  static async createAnalyticsEntry(userId: string, analyticsData: Omit<AnalyticsData, 'id' | 'userId' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'analytics'), {
        ...analyticsData,
        userId,
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating analytics entry:', error);
      throw error;
    }
  }

  static subscribeToAnalytics(userId: string, callback: (analytics: AnalyticsData[]) => void): () => void {
    const q = query(
      collection(db, 'analytics'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const analytics: AnalyticsData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        analytics.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as AnalyticsData);
      });
      callback(analytics);
    });
  }

  static async getAnalyticsForDateRange(userId: string, startDate: Date, endDate: Date): Promise<AnalyticsData[]> {
    try {
      const q = query(
        collection(db, 'analytics'),
        where('userId', '==', userId),
        where('date', '>=', startDate.toISOString().split('T')[0]),
        where('date', '<=', endDate.toISOString().split('T')[0]),
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const analytics: AnalyticsData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        analytics.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as AnalyticsData);
      });
      return analytics;
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  }
}

// Stats Service
export class StatsService {
  static async calculateUserStats(userId: string): Promise<UserStats> {
    try {
      // Get all goals
      const goalsQuery = query(
        collection(db, 'goals'),
        where('userId', '==', userId)
      );
      const goalsSnapshot = await getDocs(goalsQuery);
      const goals = goalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Get all tasks
      const tasksQuery = query(
        collection(db, 'tasks'),
        where('userId', '==', userId)
      );
      const tasksSnapshot = await getDocs(tasksQuery);
      const tasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Get recent analytics (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const analyticsQuery = query(
        collection(db, 'analytics'),
        where('userId', '==', userId),
        where('date', '>=', thirtyDaysAgo.toISOString().split('T')[0]),
        orderBy('date', 'desc')
      );
      const analyticsSnapshot = await getDocs(analyticsQuery);
      const analytics = analyticsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Calculate stats
      const totalGoals = goals.length;
      const completedGoals = goals.filter((goal: any) => goal.status === 'completed').length;
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((task: any) => task.completed).length;

      // Calculate productivity score (average of recent analytics)
      const productivityScore = analytics.length > 0
        ? Math.round(analytics.reduce((sum: number, entry: any) => sum + entry.productivityScore, 0) / analytics.length)
        : 0;

      // Calculate streak (simplified - consecutive days with tasks completed)
      let streakDays = 0;
      const sortedAnalytics = analytics
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .filter((entry: any) => entry.tasksCompleted > 0);

      streakDays = sortedAnalytics.length;

      // Network growth (placeholder - would need network connections data)
      const networkGrowth = Math.floor(Math.random() * 50) + 10; // Placeholder

      return {
        totalGoals,
        completedGoals,
        totalTasks,
        completedTasks,
        productivityScore,
        streakDays,
        networkGrowth,
      };
    } catch (error) {
      console.error('Error calculating user stats:', error);
      throw error;
    }
  }

  static subscribeToUserStats(userId: string, callback: (stats: UserStats) => void): () => void {
    // Subscribe to goals changes
    const goalsUnsubscribe = GoalsService.subscribeToGoals(userId, (goals) => {
      this.calculateUserStats(userId).then(callback);
    });

    // Subscribe to tasks changes
    const tasksUnsubscribe = TasksService.subscribeToTasks(userId, (tasks) => {
      this.calculateUserStats(userId).then(callback);
    });

    // Return combined unsubscribe function
    return () => {
      goalsUnsubscribe();
      tasksUnsubscribe();
    };
  }
}

// AI Suggestions Service
export class AISuggestionsService {
  static async generateGoalSuggestions(userId: string): Promise<string[]> {
    try {
      // Get user's current goals and tasks to generate relevant suggestions
      const goals = await new Promise<Goal[]>((resolve) => {
        const unsubscribe = GoalsService.subscribeToGoals(userId, (goals) => {
          unsubscribe();
          resolve(goals);
        });
      });

      const tasks = await new Promise<Task[]>((resolve) => {
        const unsubscribe = TasksService.subscribeToTasks(userId, (tasks) => {
          unsubscribe();
          resolve(tasks);
        });
      });

      // Simple AI logic based on existing data
      const suggestions: string[] = [];

      // If user has learning goals, suggest related tasks
      const learningGoals = goals.filter(g => g.category.toLowerCase().includes('learn'));
      if (learningGoals.length > 0) {
        suggestions.push('Complete advanced course on current learning topic');
        suggestions.push('Practice coding exercises for 1 hour daily');
        suggestions.push('Read technical articles related to your field');
      }

      // If user has networking goals
      const networkingGoals = goals.filter(g => g.category.toLowerCase().includes('network'));
      if (networkingGoals.length > 0) {
        suggestions.push('Send 5 personalized connection requests on LinkedIn');
        suggestions.push('Attend virtual networking event this week');
        suggestions.push('Follow up with 3 recent connections');
      }

      // If user has career goals
      const careerGoals = goals.filter(g => g.category.toLowerCase().includes('career'));
      if (careerGoals.length > 0) {
        suggestions.push('Update resume with recent achievements');
        suggestions.push('Research job opportunities in target companies');
        suggestions.push('Prepare for technical interviews');
      }

      // General productivity suggestions
      if (tasks.length < 5) {
        suggestions.push('Break down large goals into smaller daily tasks');
      }

      if (goals.length === 0) {
        suggestions.push('Set your first SMART goal for this month');
        suggestions.push('Define career objectives for the next quarter');
      }

      // Return at least some default suggestions
      if (suggestions.length === 0) {
        suggestions.push(
          'Learn a new professional skill this month',
          'Expand your professional network by 20 connections',
          'Complete a certification in your field',
          'Start a personal project to build your portfolio',
          'Read one industry-related book per week'
        );
      }

      return suggestions.slice(0, 5); // Return top 5 suggestions
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      return [
        'Learn a new professional skill this month',
        'Expand your professional network',
        'Complete a certification in your field',
        'Start a personal project',
        'Read industry-related books'
      ];
    }
  }
}