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
exports.useStore = void 0;
var zustand_1 = require("zustand");
exports.useStore = (0, zustand_1.create)(function (set) { return ({
    items: [],
    users: [
        { id: '1', role: 'buyer', name: 'John Buyer', email: 'john@example.com' },
        { id: '2', role: 'seller', name: 'Jane Seller', email: 'jane@example.com' },
        { id: '3', role: 'admin', name: 'Admin User', email: 'admin@example.com' },
    ],
    bids: [],
    currentUser: null,
    addItem: function (item) { return set(function (state) { return ({ items: __spreadArray(__spreadArray([], state.items, true), [item], false) }); }); },
    addBid: function (bid) { return set(function (state) { return ({ bids: __spreadArray(__spreadArray([], state.bids, true), [bid], false) }); }); },
    setCurrentUser: function (user) { return set({ currentUser: user }); },
}); });
