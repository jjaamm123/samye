const fs = require('fs');
const file = 'src/pages/TourDetails.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Grid wrapper
content = content.replace(
  /<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">/g,
  '<div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">'
);

// 2. Map fix
content = content.replace(
  /<div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden shadow-sm border border-\[#e2d9cc\]">/g,
  '<div className="w-full h-96 rounded-2xl overflow-hidden shadow-md border border-[#e2d9cc]">'
);
content = content.replace(
  /width="100%"\s+height="100%"\s+style={{ border: 0 }}/g,
  'className="w-full h-full" style={{ border: 0 }}'
);

// 3. Accordion item fix
content = content.replace(
  /<div key=\{day._id \|\| idx\} className="bg-\[#f4efe6\] border border-\[#e2d9cc\] rounded-xl overflow-hidden transition-all duration-300">/g,
  '<div key={day._id || idx} className="bg-[#f4efe6] p-6 rounded-2xl border border-[#e2d9cc] shadow-sm overflow-hidden transition-all duration-300">'
);
// Fix accordion header padding to not double up since we added p-6
content = content.replace(
  /className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none cursor-pointer"/g,
  'className="w-full text-left flex items-center justify-between focus:outline-none cursor-pointer"'
);
content = content.replace(
  /<div className="px-6 pb-6 pt-2">/g,
  '<div className="pt-4">'
);

// 3b. Sidebar Cards fix
content = content.replace(
  /<div className="bg-\[#f4efe6\] p-6 sm:p-8 rounded-2xl border border-\[#e2d9cc\] shadow-sm">/g,
  '<div className="bg-[#f4efe6] p-6 rounded-2xl border border-[#e2d9cc] shadow-sm">'
);
content = content.replace(
  /<div className="bg-\[#f4efe6\] p-6 rounded-2xl border border-\[#e2d9cc\] shadow-sm">/g,
  '<div className="bg-[#f4efe6] p-6 rounded-2xl border border-[#e2d9cc] shadow-sm">'
);


// 4. Form Section Fix
// Wrapper
content = content.replace(
  /<div id="enquiry-section" className="bg-\[#f7f4ee\] border-t border-\[#e2d9cc\]">\s*<div className="max-w-3xl mx-auto px-4 py-20">/g,
  '<div className="max-w-3xl mx-auto px-4 py-16" id="enquiry-section">'
);
content = content.replace(
  /<div className="max-w-3xl mx-auto px-4 py-20">/g,
  '<div className="max-w-3xl mx-auto px-4 py-16" id="enquiry-section">'
);
content = content.replace(
  /<div id="enquiry-section" className="bg-\[#f7f4ee\] border-t border-\[#e2d9cc\]">/g,
  ''
);

// Form Container
content = content.replace(
  /<div className="bg-\[#f4efe6\] p-8 sm:p-10 rounded-2xl border border-\[#e2d9cc\] shadow-sm">/g,
  '<div className="bg-[#f4efe6] p-8 rounded-2xl shadow-md border border-[#e2d9cc]">'
);

// Form Dropdowns layout (change 3 cols to 2 cols)
content = content.replace(
  /<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">/g,
  '<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">'
);

// Input classes
const oldInputClass = 'w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9c826b]/50';
const newInputClass = 'w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9c826b]';

content = content.replaceAll(oldInputClass, newInputClass);

content = content.replace(
  /className="w-full bg-white border border-\[#e2d9cc\] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-\[#9c826b\]\/50 resize-y"/g,
  'className="' + newInputClass + ' resize-y"'
);

fs.writeFileSync(file, content);
console.log('Fixed classes');
