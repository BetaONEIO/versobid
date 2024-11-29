"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Profile;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var authStore_1 = require("../stores/authStore");
var PrivateProfile_1 = require("../components/profile/PrivateProfile");
var PublicProfile_1 = require("../components/profile/PublicProfile");
function Profile() {
    var _a;
    var username = (0, react_router_dom_1.useParams)().username;
    var user = (0, authStore_1.useAuthStore)().user;
    var isOwnProfile = !username || ((_a = user === null || user === void 0 ? void 0 : user.profile) === null || _a === void 0 ? void 0 : _a.username) === username;
    return isOwnProfile ? <PrivateProfile_1.default /> : <PublicProfile_1.default username={username}/>;
}
