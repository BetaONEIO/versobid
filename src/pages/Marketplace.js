"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Marketplace;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var react_router_dom_1 = require("react-router-dom");
var store_1 = require("../stores/store");
var ItemCard_1 = require("../components/ItemCard");
var RecentAuctions_1 = require("../components/RecentAuctions");
var UserContext_1 = require("../context/UserContext");
function Marketplace() {
    var navigate = (0, react_router_dom_1.useNavigate)();
    var items = (0, store_1.useStore)().items;
    var userRole = (0, UserContext_1.useUserContext)().userRole;
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marketplace</h1>
        {userRole === 'buyer' && (<button onClick={function () { return navigate('/create-item'); }} className="flex items-center px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600">
            <lucide_react_1.Plus className="h-5 w-5 mr-2"/>
            Add Wanted Item
          </button>)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.filter(function (item) { return item.status === 'open'; }).map(function (item) { return (<ItemCard_1.default key={item.id} item={item} userRole={userRole} onBid={function () {
                // Handle bid
            }}/>); })}
          </div>
        </div>
        <div className="lg:col-span-1">
          <RecentAuctions_1.default />
        </div>
      </div>
    </div>);
}
