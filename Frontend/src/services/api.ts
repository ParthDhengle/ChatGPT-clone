// src/services/api.ts
const API_BASE_URL = 'http://localhost:8000'; // Update with your backend URL

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
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('firebase_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Auth operations
  async syncUserWithBackend(firebaseUser: any): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/sync`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          display_name: firebaseUser.displayName || firebaseUser.email,
        }),
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
      const response = await fetch(`${API_BASE_URL}/chats`, {
        headers: this.getAuthHeaders(),
      });
      
      const result = await this.handleResponse<ApiResponse<Chat[]>>(response);
      return result.data || [];
    } catch (error) {
      console.error('Error fetching chats:', error);
      return [];
    }
  }

  async createChat(title: string): Promise<string | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/chats`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ title }),
      });
      
      const result = await this.handleResponse<ApiResponse<{ chat_id: string }>>(response);
      return result.data?.chat_id || null;
    } catch (error) {
      console.error('Error creating chat:', error);
      return null;
    }
  }

  async deleteChat(chatId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      
      const result = await this.handleResponse<ApiResponse<any>>(response);
      return result.success;
    } catch (error) {
      console.error('Error deleting chat:', error);
      return false;
    }
  }

  async updateChatTitle(chatId: string, title: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ title }),
      });
      
      const result = await this.handleResponse<ApiResponse<any>>(response);
      return result.success;
    } catch (error) {
      console.error('Error updating chat title:', error);
      return false;
    }
  }

  // Message operations
  async getChatMessages(chatId: string): Promise<Message[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
        headers: this.getAuthHeaders(),
      });
      
      const result = await this.handleResponse<ApiResponse<Message[]>>(response);
      return result.data || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async sendMessage(chatId: string, content: string): Promise<{ userMessage: Message; aiResponse: Message } | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ 
          content,
          role: 'user' 
        }),
      });
      
      const result = await this.handleResponse<ApiResponse<{ userMessage: Message; aiResponse: Message }>>(response);
      return result.data || null;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }
}

export const apiService = new ApiService();
export type { Chat, Message };