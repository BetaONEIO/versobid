"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BidHistory;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var utils_1 = require("../../lib/utils");
function BidHistory(_a) {
    var bids = _a.bids;
    var sortedBids = __spreadArray([], bids, true).sort(function (a, b) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    var getStatusIcon = function (status) {
        switch (status) {
            case 'accepted':
                return <lucide_react_1.CheckCircle className="h-5 w-5 text-green-500"/>;
            case 'rejected':
                return <lucide_react_1.XCircle className="h-5 w-5 text-red-500"/>;
            default:
                return <lucide_react_1.Clock className="h-5 w-5 text-yellow-500"/>;
        }
    };
    return (<div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Bid History ({bids.length})
      </h3>

      <div className="space-y-4">
        {sortedBids.map(function (bid) {
            var _a, _b, _c, _d;
            return (<div key={bid.id} className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                {((_a = bid.seller) === null || _a === void 0 ? void 0 : _a.avatar_url) ? (<img src={bid.seller.avatar_url} alt={bid.seller.name} className="h-10 w-10 rounded-full"/>) : (<div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                      {(_c = (_b = bid.seller) === null || _b === void 0 ? void 0 : _b.name) === null || _c === void 0 ? void 0 : _c.charAt(0)}
                    </span>
                  </div>)}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {(_d = bid.seller) === null || _d === void 0 ? void 0 : _d.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {(0, utils_1.formatTimestamp)(bid.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {(0, utils_1.formatCurrency)(bid.amount)}
                </span>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(bid.status)}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {bid.status}
                  </span>
                </div>
              </div>
            </div>
            {bid.notes && (<p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {bid.notes}
              </p>)}
          </div>);
        })}

        {bids.length === 0 && (<p className="text-center text-gray-500 dark:text-gray-400 py-4">
            No bids yet. Be the first to make an offer!
          </p>)}
      </div>
    </div>);
}
