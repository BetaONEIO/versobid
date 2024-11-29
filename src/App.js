"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var react_hot_toast_1 = require("react-hot-toast");
var Header_1 = require("./components/Header");
var pages_1 = require("./pages");
var UserContext_1 = require("./context/UserContext");
var ThemeContext_1 = require("./context/ThemeContext");
var AuthProvider_1 = require("./components/auth/AuthProvider");
var authStore_1 = require("./stores/authStore");
// Check if we're on the main domain or test subdomain
var isMainDomain = window.location.hostname === 'versobid.com';
function ProtectedRoute(_a) {
    var children = _a.children;
    var _b = (0, authStore_1.useAuthStore)(), user = _b.user, initialized = _b.initialized;
    if (!initialized)
        return null;
    return user ? <>{children}</> : <react_router_dom_1.Navigate to="/auth"/>;
}
function App() {
    // Show coming soon page on main domain
    if (isMainDomain) {
        return (<ThemeContext_1.ThemeProvider>
        <pages_1.ComingSoon />
        <react_hot_toast_1.Toaster position="top-right"/>
      </ThemeContext_1.ThemeProvider>);
    }
    // Show full application on test subdomain
    return (<react_router_dom_1.BrowserRouter>
      <ThemeContext_1.ThemeProvider>
        <AuthProvider_1.default>
          <UserContext_1.UserProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              <Header_1.default />
              <react_router_dom_1.Routes>
                <react_router_dom_1.Route path="/auth" element={<pages_1.Auth />}/>
                <react_router_dom_1.Route path="/" element={<ProtectedRoute>
                      <pages_1.Marketplace />
                    </ProtectedRoute>}/>
                <react_router_dom_1.Route path="/create-item" element={<ProtectedRoute>
                      <pages_1.CreateItem />
                    </ProtectedRoute>}/>
                <react_router_dom_1.Route path="/item/:id" element={<ProtectedRoute>
                      <pages_1.ItemDetails />
                    </ProtectedRoute>}/>
                <react_router_dom_1.Route path="/profile" element={<ProtectedRoute>
                      <pages_1.Profile />
                    </ProtectedRoute>}/>
                <react_router_dom_1.Route path="/profile/:username" element={<ProtectedRoute>
                      <pages_1.Profile />
                    </ProtectedRoute>}/>
                <react_router_dom_1.Route path="/messages" element={<ProtectedRoute>
                      <pages_1.Messages />
                    </ProtectedRoute>}/>
                <react_router_dom_1.Route path="/messages/:chatId" element={<ProtectedRoute>
                      <pages_1.Messages />
                    </ProtectedRoute>}/>
              </react_router_dom_1.Routes>
              <react_hot_toast_1.Toaster position="top-right"/>
            </div>
          </UserContext_1.UserProvider>
        </AuthProvider_1.default>
      </ThemeContext_1.ThemeProvider>
    </react_router_dom_1.BrowserRouter>);
}
