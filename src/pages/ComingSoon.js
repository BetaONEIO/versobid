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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ComingSoon;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var react_hot_toast_1 = require("react-hot-toast");
function ComingSoon() {
    var _this = this;
    var _a = (0, react_1.useState)(''), email = _a[0], setEmail = _a[1];
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var trimmedEmail, emailRegex, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    trimmedEmail = email.trim();
                    if (!trimmedEmail) {
                        react_hot_toast_1.default.error('Please enter your email address');
                        return [2 /*return*/];
                    }
                    emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(trimmedEmail)) {
                        react_hot_toast_1.default.error('Please enter a valid email address');
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch('/.netlify/functions/subscribe', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email: trimmedEmail }),
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (data.success) {
                        react_hot_toast_1.default.success(data.message);
                        setEmail('');
                    }
                    else {
                        throw new Error(data.error || 'Failed to subscribe');
                    }
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    console.error('Subscription error:', error_1);
                    react_hot_toast_1.default.error(error_1 instanceof Error ? error_1.message : 'Failed to subscribe. Please try again.');
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-2xl">
        <div className="text-center space-y-6">
          <div className="text-5xl md:text-6xl font-bold text-white">
            <span className="text-white">Verso</span>
            <span className="text-red-300">Bid</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-semibold text-white/90">
            The Future of Reverse Auctions
          </h2>
          
          <p className="text-lg text-white/80 max-w-xl mx-auto">
            Where buyers set the price and sellers make it happen. A revolutionary platform connecting buyers with the perfect sellers.
          </p>

          <div className="flex items-center justify-center space-x-4">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-white">Coming Soon</div>
              <div className="text-white/70">Join the waitlist</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <div className="relative">
              <input type="email" required value={email} onChange={function (e) { return setEmail(e.target.value); }} placeholder="Enter your email" className="w-full px-6 py-3 rounded-full bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50" disabled={loading}/>
              <button type="submit" disabled={loading} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-indigo-600 rounded-full p-2 hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (<lucide_react_1.Loader2 className="w-5 h-5 animate-spin"/>) : (<lucide_react_1.Send className="w-5 h-5"/>)}
              </button>
            </div>
            <p className="text-sm text-white/60">
              Be the first to know when we launch and receive exclusive early access.
            </p>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-2">For Buyers</h3>
              <p className="text-white/70">Post your desired items and let sellers compete for your business</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-2">For Sellers</h3>
              <p className="text-white/70">Find customers actively looking for your products and services</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Smart Matching</h3>
              <p className="text-white/70">Our platform intelligently connects buyers with the perfect sellers</p>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
