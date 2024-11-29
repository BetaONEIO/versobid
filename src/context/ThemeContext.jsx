"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeProvider = ThemeProvider;
exports.useTheme = useTheme;
var react_1 = require("react");
var ThemeContext = (0, react_1.createContext)(undefined);
function ThemeProvider(_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(function () {
        var saved = localStorage.getItem('theme');
        return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }), isDark = _b[0], setIsDark = _b[1];
    (0, react_1.useEffect)(function () {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);
    var toggleTheme = function () { return setIsDark(!isDark); };
    return (<ThemeContext.Provider value={{ isDark: isDark, toggleTheme: toggleTheme }}>
      {children}
    </ThemeContext.Provider>);
}
function useTheme() {
    var context = (0, react_1.useContext)(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
