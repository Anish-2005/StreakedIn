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

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: string;
  messageCount: number;
}

export interface ChatMessage {
  id: string;
  chatSessionId: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  type: 'email' | 'browser' | 'sms';
  frequency: 'daily' | 'weekly' | 'monthly' | 'once';
  enabled: boolean;
  nextTrigger?: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
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
  // Chat Sessions
  static async createChatSession(userId: string, title: string = 'New Chat'): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'chatSessions'), {
        userId,
        title,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        messageCount: 0,
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw error;
    }
  }

  static async getChatSessions(userId: string): Promise<ChatSession[]> {
    console.log('ChatService.getChatSessions called with userId:', userId);
    try {
      // First try with the indexed query
      try {
        console.log('ChatService: Trying indexed query for chatSessions');
        const q = query(
          collection(db, 'chatSessions'),
          where('userId', '==', userId),
          orderBy('updatedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        console.log('ChatService: Indexed query successful, found', querySnapshot.size, 'sessions');
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as ChatSession[];
      } catch (indexError) {
        console.warn('Composite index not ready for chatSessions, falling back to unindexed query');
        // Fallback: get all sessions for user without ordering
        const q = query(
          collection(db, 'chatSessions'),
          where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);

        // Sort manually on the client side
        const sessions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as ChatSession[];

        // Sort by updatedAt descending
        sessions.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

        return sessions;
      }
    } catch (error) {
      console.error('Error getting chat sessions:', error);
      return [];
    }
  }

  static async updateChatSession(chatSessionId: string, updates: Partial<Omit<ChatSession, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
    try {
      const chatSessionRef = doc(db, 'chatSessions', chatSessionId);
      await updateDoc(chatSessionRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating chat session:', error);
      throw error;
    }
  }

  static async deleteChatSession(chatSessionId: string): Promise<void> {
    console.log('deleteChatSession called with sessionId:', chatSessionId);
    try {
      // First, get the chat session to verify ownership
      console.log('Getting chat session document');
      const sessionDoc = await getDoc(doc(db, 'chatSessions', chatSessionId));

      if (!sessionDoc.exists()) {
        throw new Error('Chat session not found');
      }

      const sessionData = sessionDoc.data();
      console.log('Session data:', sessionData);

      // Delete all messages in the chat session (filter by both chatSessionId and userId for security)
      console.log('Querying messages for session:', chatSessionId, 'and user:', sessionData?.userId);
      const messagesQuery = query(
        collection(db, 'chatMessages'),
        where('chatSessionId', '==', chatSessionId),
        where('userId', '==', sessionData?.userId)
      );
      const messagesSnapshot = await getDocs(messagesQuery);
      console.log('Found', messagesSnapshot.size, 'messages to delete');

      const batch = writeBatch(db);
      messagesSnapshot.docs.forEach((doc) => {
        console.log('Adding message to batch delete:', doc.id);
        batch.delete(doc.ref);
      });

      // Delete the chat session
      console.log('Adding chat session to batch delete:', chatSessionId);
      batch.delete(doc(db, 'chatSessions', chatSessionId));

      console.log('Committing batch delete');
      await batch.commit();
      console.log('Batch delete completed successfully');
    } catch (error) {
      console.error('Error deleting chat session:', error);
      throw error;
    }
  }  // Chat Messages
  static async saveMessage(chatSessionId: string, userId: string, role: 'user' | 'assistant', content: string): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'chatMessages'), {
        chatSessionId,
        userId,
        role,
        content,
        createdAt: Timestamp.now(),
      });

      // Update chat session metadata
      await this.updateChatSession(chatSessionId, {
        lastMessage: content,
        messageCount: await this.getMessageCount(chatSessionId) + 1,
      });

      return docRef.id;
    } catch (error) {
      console.error('Error saving chat message:', error);
      throw error;
    }
  }

  static async loadChatHistory(chatSessionId: string): Promise<Array<{role: 'user' | 'assistant', content: string}>> {
    try {
      // First, get the chat session to verify ownership
      const sessionDoc = await getDoc(doc(db, 'chatSessions', chatSessionId));

      if (!sessionDoc.exists()) {
        return [];
      }

      const sessionData = sessionDoc.data();

      // First try with the indexed query
      try {
        const q = query(
          collection(db, 'chatMessages'),
          where('chatSessionId', '==', chatSessionId),
          where('userId', '==', sessionData?.userId),
          orderBy('createdAt', 'asc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          role: doc.data().role,
          content: doc.data().content,
        }));
      } catch (indexError) {
        console.warn('Composite index not ready, falling back to unindexed query');
        // Fallback: get all messages for chat session without ordering
        const q = query(
          collection(db, 'chatMessages'),
          where('chatSessionId', '==', chatSessionId),
          where('userId', '==', sessionData?.userId)
        );
        const querySnapshot = await getDocs(q);

        // Sort manually on the client side
        const messages = querySnapshot.docs.map(doc => ({
          role: doc.data().role,
          content: doc.data().content,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));

        // Sort by createdAt
        messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

        // Return only role and content
        return messages.map(({ role, content }) => ({ role, content }));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [];
    }
  }

  static async clearChatHistory(chatSessionId: string): Promise<void> {
    console.log('clearChatHistory called with sessionId:', chatSessionId);
    try {
      // First, get the chat session to verify ownership
      const sessionDoc = await getDoc(doc(db, 'chatSessions', chatSessionId));

      if (!sessionDoc.exists()) {
        throw new Error('Chat session not found');
      }

      const sessionData = sessionDoc.data();

      const q = query(
        collection(db, 'chatMessages'),
        where('chatSessionId', '==', chatSessionId),
        where('userId', '==', sessionData?.userId)
      );
      const querySnapshot = await getDocs(q);

      const batch = writeBatch(db);
      querySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      // Reset chat session metadata
      await this.updateChatSession(chatSessionId, {
        lastMessage: undefined,
        messageCount: 0,
      });
    } catch (error) {
      console.error('Error clearing chat history:', error);
      throw error;
    }
  }

  private static async getMessageCount(chatSessionId: string): Promise<number> {
    try {
      const q = query(
        collection(db, 'chatMessages'),
        where('chatSessionId', '==', chatSessionId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting message count:', error);
      return 0;
    }
  }

  // Legacy methods for backward compatibility (deprecated)
  static async saveMessageLegacy(userId: string, role: 'user' | 'assistant', content: string): Promise<string> {
    // Create a default chat session if none exists
    const sessions = await this.getChatSessions(userId);
    let sessionId = sessions[0]?.id;
    
    if (!sessionId) {
      sessionId = await this.createChatSession(userId, 'Default Chat');
    }
    
    return this.saveMessage(sessionId, userId, role, content);
  }

  static async loadChatHistoryLegacy(userId: string): Promise<Array<{role: 'user' | 'assistant', content: string}>> {
    // Load from the most recent chat session
    const sessions = await this.getChatSessions(userId);
    if (sessions.length === 0) return [];
    
    return this.loadChatHistory(sessions[0].id);
  }

  static async clearChatHistoryLegacy(userId: string): Promise<void> {
    const sessions = await this.getChatSessions(userId);
    for (const session of sessions) {
      await this.clearChatHistory(session.id);
    }
  }
}

// Reminders Service
export class RemindersService {
  static async createReminder(userId: string, reminderData: Omit<Reminder, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'reminders'), {
        ...reminderData,
        userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating reminder:', error);
      throw error;
    }
  }

  static async updateReminder(reminderId: string, updates: Partial<Omit<Reminder, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
    try {
      const reminderRef = doc(db, 'reminders', reminderId);
      await updateDoc(reminderRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating reminder:', error);
      throw error;
    }
  }

  static async deleteReminder(reminderId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'reminders', reminderId));
    } catch (error) {
      console.error('Error deleting reminder:', error);
      throw error;
    }
  }

  static subscribeToReminders(userId: string, callback: (reminders: Reminder[]) => void): () => void {
    // Use unindexed query to avoid requiring composite index
    // Sorting will be done client-side
    const q = query(
      collection(db, 'reminders'),
      where('userId', '==', userId)
    );

    return onSnapshot(q, (querySnapshot) => {
      const reminders: Reminder[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reminders.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Reminder);
      });

      // Sort by createdAt descending on the client side
      reminders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      callback(reminders);
    });
  }

  static async generateReminderFromPrompt(userId: string, prompt: string): Promise<Partial<Reminder> | null> {
    try {
      // Check if API key is available
      if (!AISuggestionsService['GEMINI_API_KEY'] || AISuggestionsService['GEMINI_API_KEY'] === 'YOUR_GEMINI_API_KEY_HERE') {
        console.warn('Gemini API key not configured, using intelligent fallback');
        return RemindersService.generateReminderFromPromptFallback(prompt);
      }

      if (!AISuggestionsService['apiWorking']) {
        console.warn('Gemini API not working, using intelligent fallback');
        return RemindersService.generateReminderFromPromptFallback(prompt);
      }

      const context = `You are a professional productivity assistant specializing in creating structured reminders from natural language requests. Your expertise lies in parsing user intentions and generating appropriate reminder configurations.

USER REQUEST: "${prompt}"

ANALYSIS OBJECTIVE:
Extract and structure the following reminder components from the user's natural language request:

REQUIRED OUTPUT FIELDS:
• title: A professional, concise title (4-10 words) that clearly identifies the reminder's purpose. Use action-oriented language and be specific about the task or event.

• description: A professional description providing essential context, timing details, or specific instructions. Include relevant details like time, location, or additional context that would help the user understand the reminder's importance. Keep it informative and actionable (1-2 sentences).

• type: Select the most appropriate notification delivery method:
  - 'browser': Default choice for general reminders and notifications
  - 'email': Use when user mentions email, messages, or professional communications
  - 'sms': Use only when user specifically requests text messages or SMS notifications

• frequency: Determine the reminder recurrence pattern:
  - 'once': Single occurrence reminders
  - 'daily': Daily recurring reminders
  - 'weekly': Weekly recurring reminders
  - 'monthly': Monthly recurring reminders

PROFESSIONAL GUIDELINES:
• Parse temporal indicators (e.g., "every Monday", "daily at 9 AM", "weekly") to determine frequency
• Identify communication preferences (email, text, SMS) to select appropriate notification type
• Craft titles that are professional, actionable, and immediately understandable
• Always include a description with relevant context, timing, or specific details that enhance the reminder's value
• Include timing information, location details, or specific instructions in the description when mentioned
• Default to 'browser' notification type unless user specifies otherwise
• Default to 'once' frequency unless temporal patterns are clearly indicated
• Focus on the core professional objective or task requiring reminder

OUTPUT FORMAT:
Return exclusively a valid JSON object containing only these fields: title, description, type, frequency.
Do not include explanatory text, markdown formatting, code blocks, or additional commentary outside the JSON structure.
Return only the raw JSON object, nothing else.

EXAMPLES:
Input: "Remind me to review quarterly reports every Friday at 2 PM"
Output: {"title":"Review Quarterly Reports","description":"Conduct weekly review of quarterly performance reports every Friday at 2:00 PM to ensure accurate tracking and timely updates.","type":"browser","frequency":"weekly"}

Input: "Send me an email reminder for the team meeting tomorrow"
Output: {"title":"Team Meeting Reminder","description":"Important team meeting scheduled for tomorrow. Prepare agenda items and review action items from previous meeting.","type":"email","frequency":"once"}

Input: "Remind me daily to drink water"
Output: {"title":"Daily Hydration Reminder","description":"Stay hydrated throughout the day with regular water intake. Aim for 8 glasses of water daily for optimal health and productivity.","type":"browser","frequency":"daily"}`;

      console.log('Making Gemini API request for reminder generation...');
      console.log('API URL:', AISuggestionsService['GEMINI_API_URL']);
      console.log('API Key available:', !!AISuggestionsService['GEMINI_API_KEY']);
      console.log('API Key length:', AISuggestionsService['GEMINI_API_KEY']?.length);

      const response = await fetch(`${AISuggestionsService['GEMINI_API_URL']}?key=${AISuggestionsService['GEMINI_API_KEY']}`, {
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
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 512,
          }
        })
      });

      console.log('Gemini API response status:', response.status);
      console.log('Gemini API response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error details:', response.status, errorText);
        console.error('Full error response:', errorText);

        // If it's a 404 or authentication error, the API key might be invalid
        if (response.status === 404 || response.status === 403 || response.status === 401) {
          console.warn('Gemini API key appears to be invalid or not properly configured');
        }

        AISuggestionsService['apiWorking'] = false; // Disable API calls if it fails
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Gemini API response data:', JSON.stringify(data, null, 2));
      console.log('AI Response text:', data.candidates?.[0]?.content?.parts?.[0]?.text);

      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiResponse) {
        console.warn('No valid response from Gemini API for reminder generation');
        return null;
      }

      console.log('Raw AI response:', aiResponse);

      // Try to parse the JSON response
      try {
        // Clean the AI response by removing markdown code blocks and extra whitespace
        let cleanResponse = aiResponse.trim();

        // Remove markdown code blocks if present
        if (cleanResponse.startsWith('```json')) {
          cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanResponse.startsWith('```')) {
          cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        // Remove any leading/trailing whitespace again
        cleanResponse = cleanResponse.trim();

        console.log('Cleaned AI response:', cleanResponse);

        const parsed = JSON.parse(cleanResponse);
        return {
          title: parsed.title || 'New Reminder',
          description: parsed.description || 'AI-generated reminder for your request.',
          type: parsed.type || 'browser',
          frequency: parsed.frequency || 'once',
          enabled: true,
        };
      } catch (parseError) {
        console.warn('Failed to parse AI reminder response, using fallback parsing');
        console.error('Parse error:', parseError);

        // Try to extract basic information from the AI response
        // Look for JSON-like content within the response
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
              title: parsed.title || 'New Reminder',
              description: parsed.description || 'AI-generated reminder for your request.',
              type: parsed.type || 'browser',
              frequency: parsed.frequency || 'once',
              enabled: true,
            };
          } catch (innerParseError) {
            console.warn('Failed to parse extracted JSON, using basic fallback');
          }
        }

        // Final fallback: extract from first line or use generic title
        const firstLine = aiResponse.split('\n')[0]?.replace(/^["`\s]+|["`\s]+$/g, '') || 'New Reminder';
        const title = firstLine.length > 50 ? 'New Reminder' : firstLine;

        return {
          title: title,
          description: `AI-generated reminder: ${prompt}`,
          type: 'browser',
          frequency: 'once',
          enabled: true,
        };
      }
    } catch (error) {
      console.error('Error generating reminder from prompt:', error);
      return null;
    }
  }

  static generateReminderFromPromptFallback(prompt: string): Partial<Reminder> {
    console.log('Using intelligent fallback for prompt:', prompt);

    // Intelligent parsing of common reminder patterns
    const lowerPrompt = prompt.toLowerCase();

    // Extract title
    let title = 'New Reminder';
    if (prompt.length <= 50) {
      title = prompt.charAt(0).toUpperCase() + prompt.slice(1);
    } else {
      // Try to find a good title
      const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 0);
      if (sentences.length > 0) {
        const firstSentence = sentences[0].trim();
        title = firstSentence.length <= 40 ? firstSentence : firstSentence.substring(0, 37) + '...';
        title = title.charAt(0).toUpperCase() + title.slice(1);
      }
    }

    // Determine frequency
    let frequency: 'once' | 'daily' | 'weekly' | 'monthly' = 'once';
    if (lowerPrompt.includes('daily') || lowerPrompt.includes('every day') || lowerPrompt.includes('each day')) {
      frequency = 'daily';
    } else if (lowerPrompt.includes('weekly') || lowerPrompt.includes('every week') || lowerPrompt.includes('each week')) {
      frequency = 'weekly';
    } else if (lowerPrompt.includes('monthly') || lowerPrompt.includes('every month') || lowerPrompt.includes('each month')) {
      frequency = 'monthly';
    }

    // Determine type
    let type: 'browser' | 'email' | 'sms' = 'browser';
    if (lowerPrompt.includes('email') || lowerPrompt.includes('send') || lowerPrompt.includes('mail')) {
      type = 'email';
    } else if (lowerPrompt.includes('text') || lowerPrompt.includes('sms') || lowerPrompt.includes('message')) {
      type = 'sms';
    }

    // Generate description based on the prompt
    let description = `Reminder: ${prompt}`;
    if (lowerPrompt.includes('study') || lowerPrompt.includes('exam') || lowerPrompt.includes('test')) {
      description = `Academic reminder: ${prompt}. Focus on key topics and review materials thoroughly.`;
    } else if (lowerPrompt.includes('meeting') || lowerPrompt.includes('call')) {
      description = `Meeting reminder: ${prompt}. Prepare agenda items and review relevant materials beforehand.`;
    } else if (lowerPrompt.includes('deadline') || lowerPrompt.includes('due')) {
      description = `Deadline reminder: ${prompt}. Ensure all requirements are met and submit on time.`;
    } else if (lowerPrompt.includes('water') || lowerPrompt.includes('drink') || lowerPrompt.includes('hydrate')) {
      description = `Health reminder: ${prompt}. Staying hydrated is essential for optimal health and productivity.`;
    }

    return {
      title,
      description,
      type,
      frequency,
      enabled: true,
    };
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