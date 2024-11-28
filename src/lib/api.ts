import { supabase } from './supabase';
import { Message, Chat, Item, Bid, Profile } from '../types';
import toast from 'react-hot-toast';

export async function fetchMessages(chatId: string): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
}

export async function sendMessage(message: Partial<Message>): Promise<void> {
  try {
    const { error } = await supabase
      .from('messages')
      .insert([message]);

    if (error) throw error;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

export async function uploadImage(file: File, path: string): Promise<string> {
  try {
    const { error: uploadError } = await supabase.storage
      .from('chat-images')
      .upload(path, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('chat-images')
      .getPublicUrl(path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function fetchChats(userId: string): Promise<Chat[]> {
  try {
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        participant:profiles!inner(
          id,
          name,
          avatar_url
        )
      `)
      .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
      .order('last_message_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
}

export async function markMessagesAsRead(chatId: string, userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('chat_id', chatId)
      .eq('recipient_id', userId)
      .eq('read', false);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
}