"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ItemImageGallery;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
function ItemImageGallery(_a) {
    var images = _a.images;
    var _b = (0, react_1.useState)(0), currentIndex = _b[0], setCurrentIndex = _b[1];
    var goToPrevious = function () {
        setCurrentIndex(function (prevIndex) {
            return prevIndex === 0 ? images.length - 1 : prevIndex - 1;
        });
    };
    var goToNext = function () {
        setCurrentIndex(function (prevIndex) {
            return prevIndex === images.length - 1 ? 0 : prevIndex + 1;
        });
    };
    if (!images || images.length === 0) {
        return (<div className="aspect-w-4 aspect-h-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 dark:text-gray-500">No image available</span>
      </div>);
    }
    return (<div className="relative group">
      <div className="aspect-w-4 aspect-h-3 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        <img src={images[currentIndex]} alt={"Item image ".concat(currentIndex + 1)} className="object-cover w-full h-full"/>
      </div>

      {images.length > 1 && (<>
          <button onClick={goToPrevious} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <lucide_react_1.ChevronLeft className="h-6 w-6"/>
          </button>
          <button onClick={goToNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <lucide_react_1.ChevronRight className="h-6 w-6"/>
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map(function (_, index) { return (<button key={index} onClick={function () { return setCurrentIndex(index); }} className={"w-2 h-2 rounded-full transition-colors ".concat(index === currentIndex
                    ? 'bg-white'
                    : 'bg-white/50 hover:bg-white/75')}/>); })}
          </div>
        </>)}
    </div>);
}
