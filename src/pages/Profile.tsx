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

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-start space-x-6">
          <div className="relative">
            <img
              src={profile.avatar_url || '/default-avatar.png'}
              alt={profile.username}
              className="w-32 h-32 rounded-full object-cover"
            />
            {isOwnProfile && (
              <div className="absolute bottom-0 right-0">
                <label className="cursor-pointer bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700">
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
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold">{profile.username}</h1>
            <p className="text-gray-600 dark:text-gray-300">{profile.full_name}</p>
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Member since {new Date(profile.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Items for Sale</h2>
          {listings.length > 0 ? (
            <ListingGrid listings={listings} />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No items listed yet</p>
          )}
        </div>
      </div>
    </div>
  );
};