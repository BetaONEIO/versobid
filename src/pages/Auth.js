"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Auth;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var authStore_1 = require("../stores/authStore");
var lucide_react_1 = require("lucide-react");
var react_hot_toast_1 = require("react-hot-toast");
var ThemeContext_1 = require("../context/ThemeContext");
function Auth() {
    var _this = this;
    var _a = (0, react_1.useState)(true), isLogin = _a[0], setIsLogin = _a[1];
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)({
        email: '',
        password: '',
        name: '',
        username: '',
        roles: {
            buyer: false,
            seller: false
        },
        acceptedTerms: false
    }), formData = _c[0], setFormData = _c[1];
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _d = (0, authStore_1.useAuthStore)(), signIn = _d.signIn, signUp = _d.signUp;
    var _e = (0, ThemeContext_1.useTheme)(), isDark = _e.isDark, toggleTheme = _e.toggleTheme;
    var validateUsername = function (username) {
        // Username should be 3-20 characters, alphanumeric, and can contain underscores
        var usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    };
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var selectedRoles, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!isLogin) {
                        if (!formData.roles.buyer && !formData.roles.seller) {
                            react_hot_toast_1.default.error('Please select at least one role');
                            return [2 /*return*/];
                        }
                        if (!formData.acceptedTerms) {
                            react_hot_toast_1.default.error('Please accept the terms and conditions');
                            return [2 /*return*/];
                        }
                        if (!validateUsername(formData.username)) {
                            react_hot_toast_1.default.error('Username must be 3-20 characters long and can only contain letters, numbers, and underscores');
                            return [2 /*return*/];
                        }
                    }
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    if (!isLogin) return [3 /*break*/, 3];
                    return [4 /*yield*/, signIn(formData.email, formData.password)];
                case 2:
                    _a.sent();
                    react_hot_toast_1.default.success('Welcome back!');
                    return [3 /*break*/, 5];
                case 3:
                    selectedRoles = Object.entries(formData.roles)
                        .filter(function (_a) {
                        var _ = _a[0], isSelected = _a[1];
                        return isSelected;
                    })
                        .map(function (_a) {
                        var role = _a[0];
                        return role;
                    });
                    return [4 /*yield*/, signUp(formData.email, formData.password, {
                            name: formData.name,
                            username: formData.username.toLowerCase(),
                            roles: selectedRoles
                        })];
                case 4:
                    _a.sent();
                    react_hot_toast_1.default.success('Account created successfully!');
                    _a.label = 5;
                case 5:
                    navigate('/');
                    return [3 /*break*/, 8];
                case 6:
                    error_1 = _a.sent();
                    if (error_1.message.includes('username')) {
                        react_hot_toast_1.default.error('Username already taken');
                    }
                    else {
                        react_hot_toast_1.default.error(isLogin ? 'Invalid credentials' : 'Registration failed');
                    }
                    return [3 /*break*/, 8];
                case 7:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var handleRoleChange = function (role) {
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), { roles: __assign(__assign({}, prev.roles), (_a = {}, _a[role] = !prev.roles[role], _a)) }));
        });
    };
    return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full">
        {/* Theme Toggle Button */}
        <div className="absolute top-4 right-4">
          <button onClick={toggleTheme} className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Toggle theme">
            {isDark ? (<lucide_react_1.Sun className="h-5 w-5"/>) : (<lucide_react_1.Moon className="h-5 w-5"/>)}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-8 transition-colors">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold">
              <span className="text-blue-900 dark:text-blue-400">Verso</span>
              <span className="text-red-600 dark:text-red-400">Bid</span>
            </div>
            <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
              Where buyers set the price and sellers make it happen
            </p>
            <h2 className="mt-6 text-2xl font-bold text-center text-gray-900 dark:text-white">
              {isLogin ? 'Sign in to your account' : 'Create a new account'}
            </h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              {!isLogin && (<>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <input id="name" name="name" type="text" required className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 sm:text-sm" placeholder="John Doe" value={formData.name} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { name: e.target.value })); }}/>
                  </div>

                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Username
                    </label>
                    <input id="username" name="username" type="text" required className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 sm:text-sm" placeholder="johndoe123" value={formData.username} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { username: e.target.value })); }}/>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      3-20 characters, letters, numbers, and underscores only
                    </p>
                  </div>
                </>)}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <input id="email" name="email" type="email" autoComplete="email" required className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 sm:text-sm" placeholder="you@example.com" value={formData.email} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { email: e.target.value })); }}/>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input id="password" name="password" type="password" autoComplete="current-password" required className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 sm:text-sm" placeholder="••••••••" value={formData.password} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { password: e.target.value })); }}/>
              </div>

              {!isLogin && (<>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      I want to...
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input id="buyer-role" name="buyer-role" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={formData.roles.buyer} onChange={function () { return handleRoleChange('buyer'); }}/>
                        <label htmlFor="buyer-role" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Buy Items
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input id="seller-role" name="seller-role" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={formData.roles.seller} onChange={function () { return handleRoleChange('seller'); }}/>
                        <label htmlFor="seller-role" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Sell Items
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="terms" name="terms" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={formData.acceptedTerms} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { acceptedTerms: e.target.checked })); }}/>
                      </div>
                      <div className="ml-2">
                        <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
                          I agree to the{' '}
                          <react_router_dom_1.Link to="/terms" className="text-indigo-600 hover:text-indigo-500" target="_blank">
                            Terms and Conditions
                          </react_router_dom_1.Link>{' '}
                          and{' '}
                          <react_router_dom_1.Link to="/privacy" className="text-indigo-600 hover:text-indigo-500" target="_blank">
                            Privacy Policy
                          </react_router_dom_1.Link>
                        </label>
                      </div>
                    </div>
                  </div>
                </>)}
            </div>

            <div>
              <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors">
                {loading ? (<lucide_react_1.Loader2 className="animate-spin h-5 w-5"/>) : (isLogin ? 'Sign in' : 'Sign up')}
              </button>
            </div>

            <div className="text-center">
              <button type="button" onClick={function () { return setIsLogin(!isLogin); }} className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>);
}
