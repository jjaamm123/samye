const fs = require('fs');
let jsx = fs.readFileSync('src/pages/TourDetails.jsx', 'utf8');
jsx = jsx.replace(
  /focus:ring-\[#9c826b\]/g,
  'focus:ring-[#1a5c9e]'
);
fs.writeFileSync('src/pages/TourDetails.jsx', jsx);
console.log('Fixed focus ring');
