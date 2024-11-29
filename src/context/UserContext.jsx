"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProvider = UserProvider;
exports.useUserContext = useUserContext;
var react_1 = require("react");
var UserContext = (0, react_1.createContext)(undefined);
function UserProvider(_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)('buyer'), userRole = _b[0], setUserRole = _b[1];
    return (<UserContext.Provider value={{ userRole: userRole, setUserRole: setUserRole }}>
      {children}
    </UserContext.Provider>);
}
function useUserContext() {
    var context = (0, react_1.useContext)(UserContext);
    if (context === undefined) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
}
