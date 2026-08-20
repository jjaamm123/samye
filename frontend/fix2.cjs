const fs = require('fs');
const file = 'src/pages/TourDetails.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /          <\/div>\r?\n        <\/div>\r?\n      <\/div>\r?\n\r?\n      \{\/\* [^\n]*\n          LIGHTBOX PORTAL/g,
  '          </div>\n        </div>\n\n      {/* -------------------------------------------\n          LIGHTBOX PORTAL'
);

fs.writeFileSync(file, content);
