"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_ROLES = exports.BID_STATUS = exports.ITEM_STATUS = exports.CONDITIONS = exports.CATEGORIES = void 0;
exports.CATEGORIES = [
    'Electronics',
    'Furniture',
    'Clothing',
    'Books',
    'Sports',
    'Other',
];
exports.CONDITIONS = [
    'New',
    'Like New',
    'Good',
    'Fair',
    'Any',
];
exports.ITEM_STATUS = {
    OPEN: 'open',
    CLOSED: 'closed',
};
exports.BID_STATUS = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
};
exports.USER_ROLES = {
    BUYER: 'buyer',
    SELLER: 'seller',
    ADMIN: 'admin',
};
