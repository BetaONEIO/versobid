"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthProvider;
var react_1 = require("react");
var authStore_1 = require("../../stores/authStore");
function AuthProvider(_a) {
    var children = _a.children;
    var _b = (0, authStore_1.useAuthStore)(), initialize = _b.initialize, initialized = _b.initialized;
    (0, react_1.useEffect)(function () {
        if (!initialized) {
            initialize();
        }
    }, [initialize, initialized]);
    if (!initialized) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>);
    }
    return <>{children}</>;
}
