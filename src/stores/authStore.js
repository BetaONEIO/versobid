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
exports.useAuthStore = void 0;
var zustand_1 = require("zustand");
var supabase_1 = require("../lib/supabase");
var react_hot_toast_1 = require("react-hot-toast");
exports.useAuthStore = (0, zustand_1.create)(function (set, get) { return ({
    user: null,
    profile: null,
    session: null,
    loading: true,
    initialized: false,
    initialize: function () { return __awaiter(void 0, void 0, void 0, function () {
        var session, _a, profile, error, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, supabase_1.supabase.auth.getSession()];
                case 1:
                    session = (_b.sent()).data.session;
                    if (!(session === null || session === void 0 ? void 0 : session.user)) return [3 /*break*/, 3];
                    return [4 /*yield*/, supabase_1.supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', session.user.id)
                            .single()];
                case 2:
                    _a = _b.sent(), profile = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    set({
                        session: session,
                        user: session.user,
                        profile: profile,
                        initialized: true,
                        loading: false
                    });
                    return [3 /*break*/, 4];
                case 3:
                    set({
                        session: null,
                        user: null,
                        profile: null,
                        initialized: true,
                        loading: false
                    });
                    _b.label = 4;
                case 4:
                    supabase_1.supabase.auth.onAuthStateChange(function (event, session) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, profile, error;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!(event === 'SIGNED_IN' && (session === null || session === void 0 ? void 0 : session.user))) return [3 /*break*/, 2];
                                    return [4 /*yield*/, supabase_1.supabase
                                            .from('profiles')
                                            .select('*')
                                            .eq('id', session.user.id)
                                            .single()];
                                case 1:
                                    _a = _b.sent(), profile = _a.data, error = _a.error;
                                    if (error)
                                        throw error;
                                    set({
                                        session: session,
                                        user: session.user,
                                        profile: profile
                                    });
                                    return [3 /*break*/, 3];
                                case 2:
                                    if (event === 'SIGNED_OUT') {
                                        set({ session: null, user: null, profile: null });
                                    }
                                    _b.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _b.sent();
                    console.error('Error initializing auth:', error_1);
                    set({ initialized: true, loading: false });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); },
    signIn: function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, _b, profile, profileError, error_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, 4, 5]);
                    set({ loading: true });
                    return [4 /*yield*/, supabase_1.supabase.auth.signInWithPassword({
                            email: email,
                            password: password,
                        })];
                case 1:
                    _a = _c.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [4 /*yield*/, supabase_1.supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', data.user.id)
                            .single()];
                case 2:
                    _b = _c.sent(), profile = _b.data, profileError = _b.error;
                    if (profileError)
                        throw profileError;
                    set({
                        user: data.user,
                        session: data.session,
                        profile: profile
                    });
                    react_hot_toast_1.default.success('Welcome back!');
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _c.sent();
                    react_hot_toast_1.default.error(error_2.message);
                    throw error_2;
                case 4:
                    set({ loading: false });
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); },
    signUp: function (email_1, password_1) {
        var args_1 = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args_1[_i - 2] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([email_1, password_1], args_1, true), void 0, function (email, password, metadata) {
            var _a, data, error, profileError, profile, error_3;
            if (metadata === void 0) { metadata = {}; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, 6, 7]);
                        set({ loading: true });
                        return [4 /*yield*/, supabase_1.supabase.auth.signUp({
                                email: email,
                                password: password,
                                options: {
                                    data: metadata
                                }
                            })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        if (!data.user) return [3 /*break*/, 4];
                        return [4 /*yield*/, supabase_1.supabase
                                .from('profiles')
                                .insert([{
                                    id: data.user.id,
                                    email: data.user.email,
                                    name: metadata.name,
                                    username: metadata.username,
                                    roles: metadata.roles,
                                    items_count: 0,
                                    successful_deals: 0,
                                    rating: 5.0,
                                    created_at: new Date().toISOString(),
                                    updated_at: new Date().toISOString()
                                }])];
                    case 2:
                        profileError = (_b.sent()).error;
                        if (profileError)
                            throw profileError;
                        return [4 /*yield*/, supabase_1.supabase
                                .from('profiles')
                                .select('*')
                                .eq('id', data.user.id)
                                .single()];
                    case 3:
                        profile = (_b.sent()).data;
                        set({
                            user: data.user,
                            session: data.session,
                            profile: profile
                        });
                        _b.label = 4;
                    case 4:
                        react_hot_toast_1.default.success('Account created successfully!');
                        return [3 /*break*/, 7];
                    case 5:
                        error_3 = _b.sent();
                        react_hot_toast_1.default.error(error_3.message);
                        throw error_3;
                    case 6:
                        set({ loading: false });
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    },
    signOut: function () { return __awaiter(void 0, void 0, void 0, function () {
        var error, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    set({ loading: true });
                    return [4 /*yield*/, supabase_1.supabase.auth.signOut()];
                case 1:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    set({ user: null, session: null, profile: null });
                    return [3 /*break*/, 4];
                case 2:
                    error_4 = _a.sent();
                    react_hot_toast_1.default.error(error_4.message);
                    throw error_4;
                case 3:
                    set({ loading: false });
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    updateProfile: function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var user, error, updatedProfile, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = get().user;
                    if (!user)
                        throw new Error('No user logged in');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, supabase_1.supabase
                            .from('profiles')
                            .update(__assign(__assign({}, data), { updated_at: new Date().toISOString() }))
                            .eq('id', user.id)];
                case 2:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    return [4 /*yield*/, supabase_1.supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', user.id)
                            .single()];
                case 3:
                    updatedProfile = (_a.sent()).data;
                    set({ profile: updatedProfile });
                    react_hot_toast_1.default.success('Profile updated successfully');
                    return [3 /*break*/, 5];
                case 4:
                    error_5 = _a.sent();
                    react_hot_toast_1.default.error(error_5.message);
                    throw error_5;
                case 5: return [2 /*return*/];
            }
        });
    }); },
}); });
