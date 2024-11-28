import React, { useEffect, useState } from 'react';
import { MessageSquare, Star, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

interface PublicProfileProps {
  username: string;
}

export default function PublicProfile({ username }: PublicProfileProps) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          name,
          avatar_url,
          rating,
          successful_deals,
          reviews (
            id,
            rating,
            comment,
            created_at,
            reviewer:profiles!reviewer_id(name, avatar_url)
          )
        `)
        .eq('username', username)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Profile not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const startChat = async () => {
    try {
      if (!user) {
        navigate('/auth');
        return;
      }

      // Check if chat already exists
      const { data: existingChat, error: fetchError } = await supabase
        .from('chats')
        .select('id')
        .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${profile.id}),and(participant1_id.eq.${profile.id},participant2_id.eq.${user.id})`)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingChat) {
        navigate(`/messages/${existingChat.id}`);
        return;
      }

      // Create new chat
      const { data: newChat, error: insertError } = await supabase
        .from('chats')
        .insert([
          {
            participant1_id: user.id,
            participant2_id: profile.id
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      navigate(`/messages/${newChat.id}`);
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Failed to start conversation');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="px-6 py-8 sm:px-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center overflow-hidden">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.name}
                    className="h-20 w-20 object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                )}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile.name}
              </h1>
              <div className="mt-1 flex items-center space-x-4">
                <div className="flex items-center text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="ml-1 text-gray-900 dark:text-white font-medium">
                    {profile.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-500 dark:text-gray-400">
                  {profile.successful_deals} successful deals
                </span>
              </div>
            </div>
            {user?.id !== profile.id && (
              <button
                onClick={startChat}
                className="ml-auto flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Message
              </button>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="p-6 sm:p-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Reviews
          </h2>
          <div className="space-y-6">
            {profile.reviews.map((review: any) => (
              <div
                key={review.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
              >
                <div className="flex items-start space-x-4">
                  {review.reviewer.avatar_url ? (
                    <img
                      src={review.reviewer.avatar_url}
                      alt={review.reviewer.name}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                        {review.reviewer.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {review.reviewer.name}
                      </p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {review.comment}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {profile.reviews.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No reviews yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}