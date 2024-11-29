"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ActivityFeed;
var react_1 = require("react");
var date_fns_1 = require("date-fns");
var lucide_react_1 = require("lucide-react");
var activities = [
    {
        id: 1,
        type: 'item_posted',
        title: 'Posted a new item',
        description: 'MacBook Pro M1',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        icon: lucide_react_1.Package,
        iconBackground: 'bg-indigo-500',
    },
    {
        id: 2,
        type: 'bid_placed',
        title: 'Placed a bid',
        description: 'iPhone 13 Pro',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        icon: lucide_react_1.DollarSign,
        iconBackground: 'bg-green-500',
    },
    {
        id: 3,
        type: 'message_sent',
        title: 'Sent a message',
        description: 'Regarding: Gaming Laptop',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        icon: lucide_react_1.MessageSquare,
        iconBackground: 'bg-blue-500',
    },
    {
        id: 4,
        type: 'review_received',
        title: 'Received a review',
        description: '★★★★★ Great buyer!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        icon: lucide_react_1.Star,
        iconBackground: 'bg-yellow-500',
    },
];
function ActivityFeed() {
    return (<div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
        <div className="mt-6 flow-root">
          <ul className="-mb-8">
            {activities.map(function (activity, activityIdx) { return (<li key={activity.id}>
                <div className="relative pb-8">
                  {activityIdx !== activities.length - 1 ? (<span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"/>) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={"".concat(activity.iconBackground, " h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800")}>
                        <activity.icon className="h-4 w-4 text-white" aria-hidden="true"/>
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {activity.title}
                        </p>
                        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                          {activity.description}
                        </p>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                        {(0, date_fns_1.formatDistanceToNow)(activity.timestamp, { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                </div>
              </li>); })}
          </ul>
        </div>
      </div>
    </div>);
}
