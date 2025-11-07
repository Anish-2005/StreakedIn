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

export interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
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

// Chat Service
export class ChatService {
  static async saveMessage(userId: string, message: Omit<ChatMessage, 'id' | 'userId' | 'createdAt'>): Promise<string>;
  static async saveMessage(userId: string, role: 'user' | 'assistant', content: string): Promise<string>;
  static async saveMessage(userId: string, roleOrMessage: Omit<ChatMessage, 'id' | 'userId' | 'createdAt'> | 'user' | 'assistant', content?: string): Promise<string> {
    try {
      let messageData: Omit<ChatMessage, 'id' | 'userId' | 'createdAt'>;
      
      if (typeof roleOrMessage === 'string') {
        // Called with (userId, role, content)
        messageData = {
          role: roleOrMessage as 'user' | 'assistant',
          content: content!,
        };
      } else {
        // Called with (userId, message)
        messageData = roleOrMessage;
      }

      const docRef = await addDoc(collection(db, 'chat_messages'), {
        ...messageData,
        userId,
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving chat message:', error);
      throw error;
    }
  }

  static subscribeToChatHistory(userId: string, callback: (messages: ChatMessage[]) => void): () => void {
    const q = query(
      collection(db, 'chat_messages'),
      where('userId', '==', userId),
      orderBy('createdAt', 'asc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const messages: ChatMessage[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as ChatMessage);
      });
      callback(messages);
    });
  }

  static async clearChatHistory(userId: string): Promise<void> {
    try {
      const q = query(
        collection(db, 'chat_messages'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log('Chat history cleared for user:', userId);
    } catch (error) {
      console.error('Error clearing chat history:', error);
      throw error;
    }
  }

  static async loadChatHistory(userId: string): Promise<Array<{role: 'user' | 'assistant', content: string}>> {
    try {
      const q = query(
        collection(db, 'chat_messages'),
        where('userId', '==', userId),
        orderBy('createdAt', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        role: doc.data().role,
        content: doc.data().content,
      }));
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [];
    }
  }
}

// AI Suggestions Service
export class AISuggestionsService {
  private static get GEMINI_API_KEY(): string | undefined {
    return process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  }
  private static readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  private static apiWorking = true; // Flag to track if API is working - reset to true with working key

  static resetApiStatus(): void {
    this.apiWorking = true;
    console.log('Gemini API status reset - will attempt API calls again');
  }

  static async generateGoalSuggestions(userId: string): Promise<string[]> {
    try {
      // Check if API key is available and API is working
      if (!this.GEMINI_API_KEY || !this.apiWorking) {
        console.warn('Gemini API key not found or API not working, using fallback suggestions');
        return [
          'Learn a new professional skill this month',
          'Expand your professional network by 20 connections',
          'Complete a certification in your field',
          'Start a personal project to build your portfolio',
          'Read one industry-related book per week'
        ];
      }

      console.log('Gemini API key found, length:', this.GEMINI_API_KEY.length);

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

      // Create context for AI
      const context = {
        goals: goals.map(g => ({ title: g.title, category: g.category, progress: g.progress, status: g.status })),
        tasks: tasks.map(t => ({ title: t.title, completed: t.completed, priority: t.priority })),
        totalGoals: goals.length,
        completedGoals: goals.filter(g => g.status === 'completed').length,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.completed).length
      };

      const prompt = `Based on this user's productivity data, generate 5 personalized goal suggestions. Focus on helping them improve their productivity, achieve their goals faster, and develop better habits.

User Data:
- Total Goals: ${context.totalGoals}
- Completed Goals: ${context.completedGoals}
- Total Tasks: ${context.totalTasks}
- Completed Tasks: ${context.completedTasks}
- Current Goals: ${context.goals.map(g => `${g.title} (${g.category}, ${g.progress}% complete, ${g.status})`).join(', ')}
- Current Tasks: ${context.tasks.map(t => `${t.title} (${t.priority}, ${t.completed ? 'completed' : 'pending'})`).join(', ')}

Provide 5 specific, actionable goal suggestions that would help this user be more productive. Make them SMART goals where possible. Return only the suggestions as a numbered list, no additional text.`;

      console.log('Making Gemini API request for goal suggestions...');

      const response = await fetch(`${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      console.log('Gemini API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error details:', response.status, errorText);

        // If it's a 404 or authentication error, the API key might be invalid
        if (response.status === 404 || response.status === 403 || response.status === 401) {
          console.warn('Gemini API key appears to be invalid or not properly configured');
        }

        this.apiWorking = false; // Disable API calls if it fails
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Gemini API response data:', data);

      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiResponse) {
        console.warn('No valid response from Gemini API, using fallback');
        return [
          'Learn a new professional skill this month',
          'Expand your professional network by 20 connections',
          'Complete a certification in your field',
          'Start a personal project to build your portfolio',
          'Read one industry-related book per week'
        ];
      }

      // Parse the numbered list into an array
      const suggestions = aiResponse
        .split('\n')
        .filter((line: string) => line.trim().match(/^\d+\./))
        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim());

      return suggestions.length > 0 ? suggestions : [
        'Learn a new professional skill this month',
        'Expand your professional network by 20 connections',
        'Complete a certification in your field',
        'Start a personal project to build your portfolio',
        'Read one industry-related book per week'
      ];
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      this.apiWorking = false; // Disable API calls on any error
      return [
        'Learn a new professional skill this month',
        'Expand your professional network',
        'Complete a certification in your field',
        'Start a personal project',
        'Read industry-related books'
      ];
    }
  }

  static async generateAIResponse(userId: string, prompt: string, conversationHistory?: Array<{role: 'user' | 'assistant', content: string}>): Promise<string> {
    try {
      // Check if API key is available and API is working
      if (!this.GEMINI_API_KEY || !this.apiWorking) {
        console.warn('Gemini API key not found or API not working, using fallback response');
        return `I apologize, but I'm having trouble connecting to my AI services right now. Based on your current goals and progress, here are some general recommendations:

1. **Review your active goals**: Make sure they're still aligned with your current priorities
2. **Break down large tasks**: Divide complex goals into smaller, manageable steps
3. **Set daily priorities**: Focus on 3-5 key tasks each day to maintain momentum
4. **Track your progress**: Regular check-ins help maintain motivation and identify areas for improvement

Would you like me to help you create specific tasks or adjust your current goals?`;
      }

      // Get user's current data for context
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

      const stats = await StatsService.calculateUserStats(userId);

      // Build conversation context
      let conversationContext = '';
      if (conversationHistory && conversationHistory.length > 0) {
        conversationContext = '\n\nConversation History:\n' +
          conversationHistory.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n') +
          '\n\n';
      }

      const context = `You are a productivity assistant helping a user optimize their goals and tasks. Here's their current data:

Goals (${goals.length} total, ${goals.filter(g => g.status === 'completed').length} completed):
${goals.map(g => `- ${g.title} (${g.category}): ${g.progress}% complete, status: ${g.status}`).join('\n')}

Tasks (${tasks.length} total, ${tasks.filter(t => t.completed).length} completed):
${tasks.map(t => `- ${t.title} (${t.priority} priority): ${t.completed ? 'completed' : 'pending'}`).join('\n')}

Stats:
- Productivity Score: ${stats.productivityScore}/100
- Current Streak: ${stats.streakDays} days
- Network Growth: ${stats.networkGrowth}%

${conversationContext}User's question: ${prompt}

Provide a helpful, actionable response focused on productivity, goal achievement, and task management. Keep it concise but comprehensive. If appropriate, suggest specific actions they can take. Maintain context from the conversation history if relevant.`;

      console.log('Making Gemini API request for AI response...');

      const response = await fetch(`${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: context
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      });

      console.log('Gemini API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error details:', response.status, errorText);

        // If it's a 404 or authentication error, the API key might be invalid
        if (response.status === 404 || response.status === 403 || response.status === 401) {
          console.warn('Gemini API key appears to be invalid or not properly configured');
        }

        this.apiWorking = false; // Disable API calls if it fails
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Gemini API response data:', data);

      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiResponse) {
        console.warn('No valid response from Gemini API, using fallback');
        return `I apologize, but I'm having trouble connecting to my AI services right now. Based on your current goals and progress, here are some general recommendations:

1. **Review your active goals**: Make sure they're still aligned with your current priorities
2. **Break down large tasks**: Divide complex goals into smaller, manageable steps
3. **Set daily priorities**: Focus on 3-5 key tasks each day to maintain momentum
4. **Track your progress**: Regular check-ins help maintain motivation and identify areas for improvement

Would you like me to help you create specific tasks or adjust your current goals?`;
      }

      return aiResponse;
    } catch (error) {
      console.error('Error generating AI response:', error);
      this.apiWorking = false; // Disable API calls on any error
      return `I apologize, but I'm having trouble connecting to my AI services right now. Based on your current goals and progress, here are some general recommendations:

1. **Review your active goals**: Make sure they're still aligned with your current priorities
2. **Break down large tasks**: Divide complex goals into smaller, manageable steps
3. **Set daily priorities**: Focus on 3-5 key tasks each day to maintain momentum
4. **Track your progress**: Regular check-ins help maintain motivation and identify areas for improvement

Would you like me to help you create specific tasks or adjust your current goals?`;
    }
  }
}