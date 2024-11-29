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
exports.default = PublicProfile;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var supabase_1 = require("../../lib/supabase");
var react_router_dom_1 = require("react-router-dom");
var authStore_1 = require("../../stores/authStore");
var react_hot_toast_1 = require("react-hot-toast");
function PublicProfile(_a) {
    var _this = this;
    var username = _a.username;
    var _b = (0, react_1.useState)(null), profile = _b[0], setProfile = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    var navigate = (0, react_router_dom_1.useNavigate)();
    var user = (0, authStore_1.useAuthStore)().user;
    (0, react_1.useEffect)(function () {
        fetchProfile();
    }, [username]);
    var fetchProfile = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, data, error, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, 3, 4]);
                    return [4 /*yield*/, supabase_1.supabase
                            .from('profiles')
                            .select("\n          id,\n          username,\n          name,\n          avatar_url,\n          rating,\n          successful_deals,\n          reviews (\n            id,\n            rating,\n            comment,\n            created_at,\n            reviewer:profiles!reviewer_id(name, avatar_url)\n          )\n        ")
                            .eq('username', username)
                            .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    setProfile(data);
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _b.sent();
                    console.error('Error fetching profile:', error_1);
                    react_hot_toast_1.default.error('Profile not found');
                    navigate('/');
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var startChat = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, existingChat, fetchError, _b, newChat, insertError, error_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    if (!user) {
                        navigate('/auth');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, supabase_1.supabase
                            .from('chats')
                            .select('id')
                            .or("and(participant1_id.eq.".concat(user.id, ",participant2_id.eq.").concat(profile.id, "),and(participant1_id.eq.").concat(profile.id, ",participant2_id.eq.").concat(user.id, ")"))
                            .single()];
                case 1:
                    _a = _c.sent(), existingChat = _a.data, fetchError = _a.error;
                    if (fetchError && fetchError.code !== 'PGRST116') {
                        throw fetchError;
                    }
                    if (existingChat) {
                        navigate("/messages/".concat(existingChat.id));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, supabase_1.supabase
                            .from('chats')
                            .insert([
                            {
                                participant1_id: user.id,
                                participant2_id: profile.id
                            }
                        ])
                            .select()
                            .single()];
                case 2:
                    _b = _c.sent(), newChat = _b.data, insertError = _b.error;
                    if (insertError)
                        throw insertError;
                    navigate("/messages/".concat(newChat.id));
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _c.sent();
                    console.error('Error starting chat:', error_2);
                    react_hot_toast_1.default.error('Failed to start conversation');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    if (loading) {
        return (<div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>);
    }
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="px-6 py-8 sm:px-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center overflow-hidden">
                {profile.avatar_url ? (<img src={profile.avatar_url} alt={profile.name} className="h-20 w-20 object-cover"/>) : (<lucide_react_1.User className="h-10 w-10 text-indigo-600 dark:text-indigo-400"/>)}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile.name}
              </h1>
              <div className="mt-1 flex items-center space-x-4">
                <div className="flex items-center text-yellow-400">
                  <lucide_react_1.Star className="h-5 w-5 fill-current"/>
                  <span className="ml-1 text-gray-900 dark:text-white font-medium">
                    {profile.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-500 dark:text-gray-400">
                  {profile.successful_deals} successful deals
                </span>
              </div>
            </div>
            {(user === null || user === void 0 ? void 0 : user.id) !== profile.id && (<button onClick={startChat} className="ml-auto flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                <lucide_react_1.MessageSquare className="h-5 w-5 mr-2"/>
                Message
              </button>)}
          </div>
        </div>

        {/* Reviews */}
        <div className="p-6 sm:p-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Reviews
          </h2>
          <div className="space-y-6">
            {profile.reviews.map(function (review) { return (<div key={review.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  {review.reviewer.avatar_url ? (<img src={review.reviewer.avatar_url} alt={review.reviewer.name} className="h-10 w-10 rounded-full"/>) : (<div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                        {review.reviewer.name.charAt(0)}
                      </span>
                    </div>)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {review.reviewer.name}
                      </p>
                      <div className="flex items-center">
                        {__spreadArray([], Array(5), true).map(function (_, i) { return (<lucide_react_1.Star key={i} className={"h-4 w-4 ".concat(i < review.rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300 dark:text-gray-600')}/>); })}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {review.comment}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>); })}
            {profile.reviews.length === 0 && (<p className="text-center text-gray-500 dark:text-gray-400">
                No reviews yet
              </p>)}
          </div>
        </div>
      </div>
    </div>);
}
