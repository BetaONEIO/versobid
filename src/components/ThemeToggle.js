"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ThemeToggle;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var ThemeContext_1 = require("../context/ThemeContext");
function ThemeToggle() {
    var _a = (0, ThemeContext_1.useTheme)(), isDark = _a.isDark, toggleTheme = _a.toggleTheme;
    return (<button onClick={toggleTheme} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Toggle theme">
      {isDark ? (<lucide_react_1.Sun className="h-5 w-5 text-gray-100"/>) : (<lucide_react_1.Moon className="h-5 w-5 text-gray-600"/>)}
    </button>);
}
