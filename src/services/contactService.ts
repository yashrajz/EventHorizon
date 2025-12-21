export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessageWithId extends ContactMessage {
  id: string;
  created_at: string;
}

// Mock contact service - replace with actual implementation
export const contactService = {
  async sendMessage(message: ContactMessage): Promise<{ success: boolean; error?: string }> {
    try {
      // Mock implementation - replace with actual API call
      console.log('Sending contact message:', message);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true };
    } catch (error) {
      console.error('Error sending contact message:', error);
      return { 
        success: false, 
        error: 'Failed to send message. Please try again later.' 
      };
    }
  },

  async getMessages(): Promise<ContactMessageWithId[]> {
    try {
      // Mock implementation - replace with actual database query
      return [];
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      return [];
    }
  }
};