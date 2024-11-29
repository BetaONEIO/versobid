"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatList;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var useChat_1 = require("../../lib/hooks/useChat");
var authStore_1 = require("../../stores/authStore");
var utils_1 = require("../../lib/utils");
function ChatList() {
    var navigate = (0, react_router_dom_1.useNavigate)();
    var user = (0, authStore_1.useAuthStore)().user;
    var _a = (0, useChat_1.useChat)(''), chats = _a.chats, loading = _a.loading;
    if (loading) {
        return (<div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>);
    }
    if (chats.length === 0) {
        return (<div className="text-center py-8">
        <lucide_react_1.MessageSquare className="mx-auto h-12 w-12 text-gray-400"/>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No messages</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Start a conversation about an item you're interested in.
        </p>
      </div>);
    }
    return (<div className="divide-y divide-gray-200 dark:divide-gray-700">
      {chats.map(function (chat) {
            var _a, _b;
            return (<button key={chat.id} onClick={function () { return navigate("/messages/".concat(chat.id)); }} className="w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-start space-x-4">
          {((_a = chat.participant) === null || _a === void 0 ? void 0 : _a.avatar_url) ? (<img src={chat.participant.avatar_url} alt={chat.participant.name} className="h-10 w-10 rounded-full"/>) : (<div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <lucide_react_1.User className="h-5 w-5 text-gray-500 dark:text-gray-400"/>
            </div>)}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {(_b = chat.participant) === null || _b === void 0 ? void 0 : _b.name}
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {chat.last_message_at && (0, utils_1.formatTimestamp)(chat.last_message_at)}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {chat.last_message}
            </p>
          </div>

          {chat.unread_count > 0 && (<div className="ml-2 bg-indigo-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
              {chat.unread_count}
            </div>)}
        </button>);
        })}
    </div>);
}
