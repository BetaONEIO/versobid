"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var client_1 = require("react-dom/client");
var react_hot_toast_1 = require("react-hot-toast");
var App_1 = require("./App");
require("./index.css");
var rootElement = document.getElementById('root');
if (!rootElement)
    throw new Error('Failed to find the root element');
(0, client_1.createRoot)(rootElement).render(<react_1.default.StrictMode>
    <App_1.default />
    <react_hot_toast_1.Toaster position="top-right"/>
  </react_1.default.StrictMode>);
