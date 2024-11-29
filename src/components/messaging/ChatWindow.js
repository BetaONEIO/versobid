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
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var useChat_1 = require("../../lib/hooks/useChat");
var authStore_1 = require("../../stores/authStore");
var utils_1 = require("../../lib/utils");
var supabase_1 = require("../../lib/supabase");
var react_hot_toast_1 = require("react-hot-toast");
var ChatWindow = function (_a) {
    var chatId = _a.chatId, recipientId = _a.recipientId, itemId = _a.itemId;
    var _b = (0, react_1.useState)(''), newMessage = _b[0], setNewMessage = _b[1];
    var _c = (0, react_1.useState)(false), uploadingImage = _c[0], setUploadingImage = _c[1];
    var messagesEndRef = (0, react_1.useRef)(null);
    var fileInputRef = (0, react_1.useRef)(null);
    var user = (0, authStore_1.useAuthStore)().user;
    var _d = (0, useChat_1.useChat)(chatId), messages = _d.messages, loading = _d.loading, sending = _d.sending, sendMessage = _d.sendMessage;
    (0, react_1.useEffect)(function () {
        scrollToBottom();
    }, [messages]);
    var scrollToBottom = function () {
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!newMessage.trim() || !user) {
                        react_hot_toast_1.default.error('Message cannot be empty');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, sendMessage(newMessage, recipientId)];
                case 2:
                    _a.sent();
                    setNewMessage('');
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error sending message:', error_1);
                    react_hot_toast_1.default.error('Failed to send message');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleImageUpload = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var file, fileExt, fileName, filePath, uploadError, _a, publicUrlData, publicUrlError, error_2;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    file = (_b = e.target.files) === null || _b === void 0 ? void 0 : _b[0];
                    if (!file || !user) {
                        react_hot_toast_1.default.error('Invalid file or user not authenticated');
                        return [2 /*return*/];
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, 5, 6]);
                    setUploadingImage(true);
                    fileExt = file.name.split('.').pop();
                    fileName = "".concat(Date.now(), "_").concat(Math.random().toString(36).substring(2, 8), ".").concat(fileExt);
                    filePath = "chat-images/".concat(fileName);
                    return [4 /*yield*/, supabase_1.supabase.storage
                            .from('chat-images')
                            .upload(filePath, file)];
                case 2:
                    uploadError = (_c.sent()).error;
                    if (uploadError)
                        throw uploadError;
                    _a = supabase_1.supabase.storage
                        .from('chat-images')
                        .getPublicUrl(filePath), publicUrlData = _a.data, publicUrlError = _a.error;
                    if (publicUrlError || !publicUrlData.publicUrl) {
                        throw publicUrlError || new Error('Failed to retrieve public URL');
                    }
                    return [4 /*yield*/, sendMessage('Sent an image', recipientId, publicUrlData.publicUrl)];
                case 3:
                    _c.sent();
                    react_hot_toast_1.default.success('Image sent successfully');
                    return [3 /*break*/, 6];
                case 4:
                    error_2 = _c.sent();
                    console.error('Error uploading image:', error_2);
                    react_hot_toast_1.default.error('Failed to send image');
                    return [3 /*break*/, 6];
                case 5:
                    setUploadingImage(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    if (loading) {
        return (<div className="flex items-center justify-center h-full">
        <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-indigo-600"/>
      </div>);
    }
    return (<div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(function (message) { return (<div key={message.id} className={"flex ".concat(message.sender_id === (user === null || user === void 0 ? void 0 : user.id) ? 'justify-end' : 'justify-start')}>
            <div className={"max-w-[70%] rounded-lg px-4 py-2 ".concat(message.sender_id === (user === null || user === void 0 ? void 0 : user.id)
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white')}>
              {message.image_url && (<img src={message.image_url} alt="Shared content" className="rounded-lg max-w-full mb-2"/>)}
              <p>{message.content}</p>
              <span className="text-xs opacity-75">
                {(0, utils_1.formatTimestamp)(message.created_at)}
              </span>
            </div>
          </div>); })}
        <div ref={messagesEndRef}/>
      </div>

      <form onSubmit={handleSubmit} className="border-t p-4 dark:border-gray-700">
        <div className="flex space-x-2">
          <button type="button" onClick={function () { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }} disabled={uploadingImage} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50" aria-label="Upload image">
            {uploadingImage ? (<lucide_react_1.Loader2 className="h-5 w-5 animate-spin"/>) : (<lucide_react_1.Image className="h-5 w-5"/>)}
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" aria-label="Upload image"/>
          <input type="text" value={newMessage} onChange={function (e) { return setNewMessage(e.target.value); }} placeholder="Type your message..." className="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-indigo-500 focus:ring-indigo-500" disabled={sending || uploadingImage}/>
          <button type="submit" disabled={sending || uploadingImage || !newMessage.trim()} className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors" aria-label="Send message">
            {sending ? (<lucide_react_1.Loader2 className="h-5 w-5 animate-spin"/>) : (<lucide_react_1.Send className="h-5 w-5"/>)}
          </button>
        </div>
      </form>
    </div>);
};
exports.default = ChatWindow;
