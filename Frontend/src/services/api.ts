const API_BASE_URL = 'http://localhost:8000';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

interface Chat {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  chat_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

class ApiService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    try {
      // Import Firebase auth dynamically to avoid SSR issues
      const { getAuth } = await import('firebase/auth');
      const auth = getAuth();
      
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }
      
      // Get fresh token from Firebase
      const token = await auth.currentUser.getIdToken();
      
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };
    } catch (error) {
      console.error('Error getting auth headers:', error);
      throw new Error('Authentication failed');
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        detail: `HTTP error! status: ${response.status}` 
      }));
      throw new Error(error.detail || error.message || 'Network error');
    }
    return response.json();
  }

  // Auth operations
  async syncUserWithBackend(): Promise<boolean> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/auth/sync`, {
        method: 'POST',
        headers,
      });
      
      const result = await this.handleResponse<ApiResponse<any>>(response);
      return result.success;
    } catch (error) {
      console.error('Error syncing user with backend:', error);
      return false;
    }
  }

  // Chat operations
  async getUserChats(): Promise<Chat[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/chats`, {
        headers,
      });
      
      const result = await this.handleResponse<ApiResponse<Chat[]>>(response);
      return result.data || [];
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  }

  async createChat(title: string = 'New Chat'): Promise<string | null> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/chats`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ title }),
      });
      
      const result = await this.handleResponse<ApiResponse<{ chat_id: string }>>(response);
      return result.data?.chat_id || null;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  }

  async deleteChat(chatId: string): Promise<boolean> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}`, {
        method: 'DELETE',
        headers,
      });
      
      const result = await this.handleResponse<ApiResponse<any>>(response);
      return result.success;
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw error;
    }
  }

  async updateChatTitle(chatId: string, title: string): Promise<boolean> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ title }),
      });
      
      const result = await this.handleResponse<ApiResponse<any>>(response);
      return result.success;
    } catch (error) {
      console.error('Error updating chat title:', error);
      throw error;
    }
  }

  // Message operations
  async getChatMessages(chatId: string): Promise<Message[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}/messages`, {
        headers,
      });
      
      const result = await this.handleResponse<ApiResponse<Message[]>>(response);
      return result.data || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  async sendMessage(chatId: string, content: string): Promise<{ userMessage: Message; aiResponse: Message } | null> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          content,
          role: 'user' 
        }),
      });
      
      const result = await this.handleResponse<ApiResponse<{ userMessage: Message; aiResponse: Message }>>(response);
      return result.data || null;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
export type { Chat, Message };