"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CreateItem;
var react_1 = require("react");
var CreateItemForm_1 = require("../components/items/CreateItemForm");
function CreateItem() {
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Item Request</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Describe the item you're looking to purchase and set your target price.
        </p>
      </div>
      
      <CreateItemForm_1.default />
    </div>);
}
