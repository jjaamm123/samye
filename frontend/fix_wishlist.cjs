const fs = require('fs');
let jsx = fs.readFileSync('src/pages/TourDetails.jsx', 'utf8');
jsx = jsx.replace(
  /className="w-14 h-14 flex items-center justify-center bg-white border border-\[#e2d9cc\] text-\[#9c826b\] hover:bg-\[#fbf9f5\] rounded-xl transition shadow-sm shrink-0 cursor-pointer"/g,
  'className="w-14 h-14 flex items-center justify-center bg-white border border-[#e2d9cc] text-[#1a5c9e] hover:bg-[#fbf9f5] rounded-xl transition shadow-sm shrink-0 cursor-pointer"'
);
fs.writeFileSync('src/pages/TourDetails.jsx', jsx);
console.log('Fixed wishlist button');
