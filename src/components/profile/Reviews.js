"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
exports.default = Reviews;
var react_1 = require("react");
var supabase_1 = require("../../lib/supabase");
var authStore_1 = require("../../stores/authStore");
var lucide_react_1 = require("lucide-react");
var utils_1 = require("../../lib/utils");
var react_hot_toast_1 = require("react-hot-toast");
function Reviews() {
    var _this = this;
    var _a = (0, react_1.useState)([]), reviews = _a[0], setReviews = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var user = (0, authStore_1.useAuthStore)().user;
    (0, react_1.useEffect)(function () {
        if (user) {
            fetchReviews();
        }
    }, [user]);
    var fetchReviews = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, data, error, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, 3, 4]);
                    return [4 /*yield*/, supabase_1.supabase
                            .from('reviews')
                            .select("\n          *,\n          reviewer:profiles(*)\n        ")
                            .eq('user_id', user === null || user === void 0 ? void 0 : user.id)
                            .order('created_at', { ascending: false })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    setReviews(data);
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _b.sent();
                    console.error('Error fetching reviews:', error_1);
                    react_hot_toast_1.default.error('Failed to load reviews');
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    if (loading) {
        return (<div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>);
    }
    if (reviews.length === 0) {
        return (<div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No reviews yet</p>
      </div>);
    }
    return (<div className="space-y-6">
      {reviews.map(function (review) {
            var _a, _b, _c;
            return (<div key={review.id} className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden p-4">
          <div className="flex items-start space-x-4">
            {((_a = review.reviewer) === null || _a === void 0 ? void 0 : _a.avatar_url) ? (<img src={review.reviewer.avatar_url} alt={review.reviewer.name} className="h-12 w-12 rounded-full"/>) : (<div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                  {(_b = review.reviewer) === null || _b === void 0 ? void 0 : _b.name.charAt(0)}
                </span>
              </div>)}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {(_c = review.reviewer) === null || _c === void 0 ? void 0 : _c.name}
                </h3>
                <div className="flex items-center">
                  {__spreadArray([], Array(5), true).map(function (_, i) { return (<lucide_react_1.Star key={i} className={"h-5 w-5 ".concat(i < review.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600')}/>); })}
                </div>
              </div>
              <p className="mt-1 text-gray-600 dark:text-gray-300">{review.comment}</p>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {(0, utils_1.formatTimestamp)(review.created_at)}
              </div>
            </div>
          </div>
        </div>);
        })}
    </div>);
}
