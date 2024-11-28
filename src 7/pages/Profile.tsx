import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import PrivateProfile from '../components/profile/PrivateProfile';
import PublicProfile from '../components/profile/PublicProfile';

export default function Profile() {
  const { username } = useParams();
  const { user } = useAuthStore();

  // If no username is provided, or the username matches the current user,
  // show private profile view
  const isOwnProfile = !username || (user?.profile?.username === username);

  if (isOwnProfile) {
    return <PrivateProfile />;
  }

  return <PublicProfile username={username} />;
}