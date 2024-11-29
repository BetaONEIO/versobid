```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Message, Chat } from '../../types';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

interface UseChat {
  messages: Message[];
  chats: Chat[];
  loading: boolean;
  sending: boolean;
  sendMessage: (content: string, recipientId: string, imageUrl?: string) => Promise<void>;
  markMessagesAsRead: () => Promise<void>;
}

export function useChat(chatId: string): UseChat {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (chatId) {
      fetchMessages();
      const unsubscribe = subscribeToMessages();
      markMessagesAsRead();
      return () => {
        unsubscribe();
      };
    } else {
      fetchChats();
    }
  }, [chatId, user?.id]);

  const fetchMessages = async () => {
    if (!chatId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchChats = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          participant:profiles(*)
        `)
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setChats(data || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`chat:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload: { new: Message }) => {
          setMessages(prev => [...prev, payload.new]);
          if (payload.new.recipient_id === user?.id) {
            markMessagesAsRead();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markMessagesAsRead = async () => {
    if (!user?.id || !chatId) return;
    
    try {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('chat_id', chatId)
        .eq('recipient_id', user.id)
        .eq('read', false);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async (content: string, recipientId: string, imageUrl?: string) => {
    if (!user?.id || !chatId || !content.trim()) return;

    try {
      setSending(true);
      const { error } = await supabase
        .from('messages')
        .insert([{
          chat_id: chatId,
          sender_id: user.id,
          recipient_id: recipientId,
          content,
          image_url: imageUrl,
          created_at: new Date().toISOString(),
          read: false
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      throw error;
    } finally {
      setSending(false);
    }
  };

  return {
    messages,
    chats,
    loading,
    sending,
    sendMessage,
    markMessagesAsRead,
  };
}
```