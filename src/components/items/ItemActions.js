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
exports.default = ItemActions;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var react_router_dom_1 = require("react-router-dom");
var supabase_1 = require("../../lib/supabase");
var authStore_1 = require("../../stores/authStore");
var react_hot_toast_1 = require("react-hot-toast");
function ItemActions(_a) {
    var _this = this;
    var itemId = _a.itemId, sellerId = _a.sellerId, buyerId = _a.buyerId;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var user = (0, authStore_1.useAuthStore)().user;
    var startChat = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, existingChat, fetchError, _b, newChat, insertError, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, supabase_1.supabase
                            .from('chats')
                            .select('id')
                            .or("and(participant1_id.eq.".concat(user === null || user === void 0 ? void 0 : user.id, ",participant2_id.eq.").concat(sellerId, "),and(participant1_id.eq.").concat(sellerId, ",participant2_id.eq.").concat(user === null || user === void 0 ? void 0 : user.id, ")"))
                            .eq('item_id', itemId)
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
                                participant1_id: user === null || user === void 0 ? void 0 : user.id,
                                participant2_id: sellerId,
                                item_id: itemId
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
                    error_1 = _c.sent();
                    console.error('Error starting chat:', error_1);
                    react_hot_toast_1.default.error('Failed to start conversation');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Don't show message button if user is the buyer
    if ((user === null || user === void 0 ? void 0 : user.id) === buyerId)
        return null;
    return (<button onClick={startChat} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      <lucide_react_1.MessageSquare className="h-5 w-5 mr-2"/>
      Message
    </button>);
}
