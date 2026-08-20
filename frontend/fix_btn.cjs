const fs = require('fs');
let jsx = fs.readFileSync('src/pages/TourDetails.jsx', 'utf8');
jsx = jsx.replace(/bg-\[#9c826b\] hover:bg-\[#856d57\]/g, 'bg-[#1a5c9e] hover:bg-[#246ab5]');
fs.writeFileSync('src/pages/TourDetails.jsx', jsx);
console.log('Fixed buttons');
