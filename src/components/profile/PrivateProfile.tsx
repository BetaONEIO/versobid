import React, { useState } from 'react';
import { Settings, Package, DollarSign, User, Building, MapPin, Star, History } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import ProfileForm from './ProfileForm';
import ActivityFeed from './ActivityFeed';
import ListedItems from './ListedItems';
import BiddingHistory from './BiddingHistory';
import Reviews from './Reviews';

export default function PrivateProfile() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  const stats = [
    {
      label: 'Items Posted',
      value: user?.profile?.items_count || 0,
      icon: Package,
      color: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      label: 'Successful Deals',
      value: user?.profile?.successful_deals || 0,
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Rating',
      value: `${user?.profile?.rating || '5.0'} ★`,
      icon: Star,
      color: 'text-yellow-600 dark:text-yellow-400',
    },
  ];

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'items', label: 'Listed Items', icon: Package },
    { id: 'bids', label: 'Bidding History', icon: History },
    { id: 'reviews', label: 'Reviews', icon: Star },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="px-6 py-8 sm:px-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="h-20 w-20 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center overflow-hidden">
                {user?.profile?.avatar_url ? (
                  <img
                    src={user.profile.avatar_url}
                    alt={user.profile.name}
                    className="h-20 w-20 object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Settings className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user?.profile?.name}
              </h1>
              <div className="mt-1 flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                {user?.profile?.company && (
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-1" />
                    <span>{user.profile.company}</span>
                  </div>
                )}
                {user?.profile?.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{user.profile.location}</span>
                  </div>
                )}
              </div>
              {user?.profile?.bio && (
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {user.profile.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 dark:divide-gray-700">
          {stats.map((stat) => (
            <div key={stat.label} className="px-6 py-4 sm:px-8">
              <div className="flex items-center">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.label}
                </span>
              </div>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="px-6 sm:px-8">
            <nav className="flex space-x-4 overflow-x-auto py-4" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8">
          {activeTab === 'profile' && <ProfileForm />}
          {activeTab === 'items' && <ListedItems />}
          {activeTab === 'bids' && <BiddingHistory />}
          {activeTab === 'reviews' && <Reviews />}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="mt-8">
        <ActivityFeed />
      </div>
    </div>
  );
}