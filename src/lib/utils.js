"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCamelToSnake = exports.mapSnakeToCamel = exports.formatCurrency = exports.formatDate = exports.formatTimestamp = void 0;
var date_fns_1 = require("date-fns");
var formatTimestamp = function (date) {
    if (!date)
        return '';
    var d = typeof date === 'string' ? new Date(date) : date;
    return (0, date_fns_1.formatDistanceToNow)(d, { addSuffix: true });
};
exports.formatTimestamp = formatTimestamp;
var formatDate = function (date) {
    if (!date)
        return '';
    var d = typeof date === 'string' ? new Date(date) : date;
    return (0, date_fns_1.format)(d, 'PPP');
};
exports.formatDate = formatDate;
var formatCurrency = function (amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(amount);
};
exports.formatCurrency = formatCurrency;
var mapSnakeToCamel = function (obj) {
    var newObj = {};
    Object.keys(obj).forEach(function (key) {
        var camelKey = key.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
        newObj[camelKey] = obj[key];
    });
    return newObj;
};
exports.mapSnakeToCamel = mapSnakeToCamel;
var mapCamelToSnake = function (obj) {
    var newObj = {};
    Object.keys(obj).forEach(function (key) {
        var snakeKey = key.replace(/[A-Z]/g, function (letter) { return "_".concat(letter.toLowerCase()); });
        newObj[snakeKey] = obj[key];
    });
    return newObj;
};
exports.mapCamelToSnake = mapCamelToSnake;
