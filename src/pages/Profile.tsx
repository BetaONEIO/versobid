import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import PrivateProfile from '../components/profile/PrivateProfile';
import PublicProfile from '../components/profile/PublicProfile';

export default function Profile() {
  const { username } = useParams();
  const { user } = useAuthStore();
  const isOwnProfile = !username || user?.profile?.username === username;

  return isOwnProfile ? <PrivateProfile /> : <PublicProfile username={username!} />;
}