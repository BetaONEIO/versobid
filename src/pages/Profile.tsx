import React from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useNotification } from '../contexts/NotificationContext';
import { profileService } from '../services/profileService';
import { ListingGrid } from '../components/listings/ListingGrid';
import { useListings } from '../hooks/useListings';
import { Profile as ProfileType } from '../types/profile';

export const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { auth } = useUser();
  const { addNotification } = useNotification();
  const { listings } = useListings();
  const [profile, setProfile] = React.useState<ProfileType | null>(null);
  const [loading, setLoading] = React.useState(true);

  const isOwnProfile = auth.user?.username === username;

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfileByUsername(username!);
        setProfile(data);
      } catch (error) {
        addNotification('error', 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, addNotification]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const avatarUrl = await profileService.uploadAvatar(file);
      await profileService.updateProfile(auth.user!.id, { avatar_url: avatarUrl });
      setProfile((prev: ProfileType | null) => prev ? { ...prev, avatar_url: avatarUrl } : null);
      addNotification('success', 'Profile picture updated');
    } catch (error) {
      addNotification('error', 'Failed to update profile picture');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-lg text-gray-600 dark:text-gray-300">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-lg text-red-600 dark:text-red-400">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-indigo-500 to-purple-600">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <img
                src={profile.avatar_url || '/default-avatar.png'}
                alt={profile.username}
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover bg-white"
              />
              {isOwnProfile && (
                <label className="absolute bottom-0 right-0 cursor-pointer bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="pt-20 px-8 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.username}</h1>
              <p className="text-gray-600 dark:text-gray-300">{profile.full_name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Member since {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {isOwnProfile ? 'Your Listings' : `${profile.username}'s Listings`}
            </h2>
            {listings.length > 0 ? (
              <ListingGrid listings={listings} />
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No items listed yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};