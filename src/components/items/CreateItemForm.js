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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CreateItemForm;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var supabase_1 = require("../../lib/supabase");
var react_hot_toast_1 = require("react-hot-toast");
var react_router_dom_1 = require("react-router-dom");
function CreateItemForm(_a) {
    var _this = this;
    var onSuccess = _a.onSuccess;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(null), imagePreview = _c[0], setImagePreview = _c[1];
    var _d = (0, react_1.useState)({
        title: '',
        description: '',
        category: '',
        targetPrice: '',
        deadline: '',
        condition: 'new',
        location: '',
        image: null
    }), formData = _d[0], setFormData = _d[1];
    var handleImageChange = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var file;
        var _a;
        return __generator(this, function (_b) {
            file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
            if (!file)
                return [2 /*return*/];
            // Validate file type and size
            if (!file.type.startsWith('image/')) {
                react_hot_toast_1.default.error('Please upload an image file');
                return [2 /*return*/];
            }
            if (file.size > 5 * 1024 * 1024) {
                react_hot_toast_1.default.error('Image must be less than 5MB');
                return [2 /*return*/];
            }
            setFormData(function (prev) { return (__assign(__assign({}, prev), { image: file })); });
            setImagePreview(URL.createObjectURL(file));
            return [2 /*return*/];
        });
    }); };
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var imageUrl, fileExt, fileName, filePath, _a, uploadError, data, publicUrl, insertError, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    e.preventDefault();
                    setLoading(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, 6, 7]);
                    imageUrl = '';
                    if (!formData.image) return [3 /*break*/, 3];
                    fileExt = formData.image.name.split('.').pop();
                    fileName = "".concat(Math.random(), ".").concat(fileExt);
                    filePath = "items/".concat(fileName);
                    return [4 /*yield*/, supabase_1.supabase.storage
                            .from('items')
                            .upload(filePath, formData.image)];
                case 2:
                    _a = _b.sent(), uploadError = _a.error, data = _a.data;
                    if (uploadError)
                        throw uploadError;
                    publicUrl = supabase_1.supabase.storage
                        .from('items')
                        .getPublicUrl(filePath).data.publicUrl;
                    imageUrl = publicUrl;
                    _b.label = 3;
                case 3: return [4 /*yield*/, supabase_1.supabase
                        .from('items')
                        .insert([
                        {
                            title: formData.title,
                            description: formData.description,
                            category: formData.category,
                            target_price: parseFloat(formData.targetPrice),
                            deadline: formData.deadline,
                            condition: formData.condition,
                            location: formData.location,
                            image_url: imageUrl,
                            status: 'open'
                        }
                    ])];
                case 4:
                    insertError = (_b.sent()).error;
                    if (insertError)
                        throw insertError;
                    react_hot_toast_1.default.success('Item created successfully!');
                    onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
                    navigate('/marketplace');
                    return [3 /*break*/, 7];
                case 5:
                    error_1 = _b.sent();
                    console.error('Error creating item:', error_1);
                    react_hot_toast_1.default.error('Failed to create item');
                    return [3 /*break*/, 7];
                case 6:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    return (<form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.title} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { title: e.target.value })); }); }}/>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea required rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.description} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { description: e.target.value })); }); }}/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.category} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { category: e.target.value })); }); }}>
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="sports">Sports & Outdoors</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Target Price ($)
            </label>
            <input type="number" required min="0" step="0.01" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.targetPrice} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { targetPrice: e.target.value })); }); }}/>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Deadline
            </label>
            <input type="datetime-local" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.deadline} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { deadline: e.target.value })); }); }}/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Condition Preference
            </label>
            <select required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.condition} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { condition: e.target.value })); }); }}>
              <option value="new">New</option>
              <option value="like-new">Like New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="any">Any Condition</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Location
          </label>
          <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.location} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { location: e.target.value })); }); }} placeholder="City, State or Remote"/>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Image
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {imagePreview ? (<div className="relative">
                  <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-md"/>
                  <button type="button" onClick={function () {
                setImagePreview(null);
                setFormData(function (prev) { return (__assign(__assign({}, prev), { image: null })); });
            }} className="absolute top-0 right-0 -mr-2 -mt-2 bg-red-500 text-white rounded-full p-1">
                    ×
                  </button>
                </div>) : (<>
                  <lucide_react_1.Upload className="mx-auto h-12 w-12 text-gray-400"/>
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange}/>
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </>)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button type="button" onClick={function () { return navigate('/marketplace'); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
          {loading ? (<>
              <lucide_react_1.Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4"/>
              Creating...
            </>) : ('Create Item')}
        </button>
      </div>
    </form>);
}
