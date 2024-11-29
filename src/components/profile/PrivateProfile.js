"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PrivateProfile;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var authStore_1 = require("../../stores/authStore");
var useProfile_1 = require("../../lib/hooks/useProfile");
var ProfileForm_1 = require("./ProfileForm");
var ActivityFeed_1 = require("./ActivityFeed");
var ListedItems_1 = require("./ListedItems");
var BiddingHistory_1 = require("./BiddingHistory");
var Reviews_1 = require("./Reviews");
function PrivateProfile() {
    var user = (0, authStore_1.useAuthStore)().user;
    var profile = (0, useProfile_1.useProfile)(user === null || user === void 0 ? void 0 : user.id).profile;
    var _a = (0, react_1.useState)('profile'), activeTab = _a[0], setActiveTab = _a[1];
    var stats = [
        {
            label: 'Items Posted',
            value: (profile === null || profile === void 0 ? void 0 : profile.items_count) || 0,
            icon: lucide_react_1.Package,
            color: 'text-indigo-600 dark:text-indigo-400',
        },
        {
            label: 'Successful Deals',
            value: (profile === null || profile === void 0 ? void 0 : profile.successful_deals) || 0,
            icon: lucide_react_1.DollarSign,
            color: 'text-green-600 dark:text-green-400',
        },
        {
            label: 'Rating',
            value: "".concat((profile === null || profile === void 0 ? void 0 : profile.rating) || '5.0', " \u2605"),
            icon: lucide_react_1.Star,
            color: 'text-yellow-600 dark:text-yellow-400',
        },
    ];
    var tabs = [
        { id: 'profile', label: 'Profile Settings', icon: lucide_react_1.User },
        { id: 'items', label: 'Listed Items', icon: lucide_react_1.Package },
        { id: 'bids', label: 'Bidding History', icon: lucide_react_1.History },
        { id: 'reviews', label: 'Reviews', icon: lucide_react_1.Star },
    ];
    if (!profile)
        return null;
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="px-6 py-8 sm:px-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="h-20 w-20 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center overflow-hidden">
                {profile.avatar_url ? (<img src={profile.avatar_url} alt={profile.name} className="h-20 w-20 object-cover"/>) : (<lucide_react_1.User className="h-10 w-10 text-indigo-600 dark:text-indigo-400"/>)}
              </div>
              <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <lucide_react_1.Settings className="h-4 w-4 text-gray-600 dark:text-gray-300"/>
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile.name}
              </h1>
              <div className="mt-1 flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                {profile.company && (<div className="flex items-center">
                    <lucide_react_1.Building className="h-4 w-4 mr-1"/>
                    <span>{profile.company}</span>
                  </div>)}
                {profile.location && (<div className="flex items-center">
                    <lucide_react_1.MapPin className="h-4 w-4 mr-1"/>
                    <span>{profile.location}</span>
                  </div>)}
              </div>
              {profile.bio && (<p className="mt-2 text-gray-600 dark:text-gray-300">
                  {profile.bio}
                </p>)}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 dark:divide-gray-700">
          {stats.map(function (stat) { return (<div key={stat.label} className="px-6 py-4 sm:px-8">
              <div className="flex items-center">
                <stat.icon className={"h-5 w-5 ".concat(stat.color)}/>
                <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.label}
                </span>
              </div>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>); })}
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="px-6 sm:px-8">
            <nav className="flex space-x-4 overflow-x-auto py-4" aria-label="Tabs">
              {tabs.map(function (tab) { return (<button key={tab.id} onClick={function () { return setActiveTab(tab.id); }} className={"flex items-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ".concat(activeTab === tab.id
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300')}>
                  <tab.icon className="h-4 w-4 mr-2"/>
                  {tab.label}
                </button>); })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8">
          {activeTab === 'profile' && <ProfileForm_1.default />}
          {activeTab === 'items' && <ListedItems_1.default />}
          {activeTab === 'bids' && <BiddingHistory_1.default />}
          {activeTab === 'reviews' && <Reviews_1.default />}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="mt-8">
        <ActivityFeed_1.default />
      </div>
    </div>);
}
