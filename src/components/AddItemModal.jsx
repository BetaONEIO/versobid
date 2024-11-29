"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AddItemModal;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
function AddItemModal(_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, onSubmit = _a.onSubmit;
    var _b = (0, react_1.useState)({
        title: '',
        description: '',
        targetPrice: '',
        category: '',
        imageUrl: '',
    }), formData = _b[0], setFormData = _b[1];
    if (!isOpen)
        return null;
    var handleSubmit = function (e) {
        e.preventDefault();
        onSubmit(__assign(__assign({}, formData), { targetPrice: parseFloat(formData.targetPrice), createdAt: new Date(), status: 'open', bids: [] }));
        onClose();
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Wanted Item</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <lucide_react_1.X className="h-6 w-6"/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" value={formData.title} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { title: e.target.value })); }}/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" rows={3} value={formData.description} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { description: e.target.value })); }}/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Target Price</label>
            <input type="number" required min="0" step="0.01" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" value={formData.targetPrice} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { targetPrice: e.target.value })); }}/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" value={formData.category} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { category: e.target.value })); }}>
              <option value="">Select a category</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input type="url" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" value={formData.imageUrl} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { imageUrl: e.target.value })); }}/>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>);
}
