const fs = require('fs');
let jsx = fs.readFileSync('src/pages/TourDetails.jsx', 'utf8');

// Fix 1: Dynamic Pricing Display
const priceOld = `            <div className="mb-6 mt-4">
              <span className="block text-sm text-[#888] uppercase tracking-wide mb-1">{isPOR ? 'Pricing' : 'Starting from'}</span>
              <div className="text-3xl font-serif text-[#1a1a1a]">
                USD {tour.price?.amount ?? tour.price ?? 'POR'}
              </div>
              {tour.localPrice && (
                <div className="text-sm text-[#888] mt-1">NPR {tour.localPrice}</div>
              )}
            </div>`;

const priceNew = `            <div className="mb-6 mt-4">
              {(tour.price?.displayType === 'price_on_request' || tour.price?.displayType === 'por') ? (
                <div className="text-3xl font-serif text-[#1a1a1a]">
                  Price on Request
                </div>
              ) : (
                <>
                  <span className="block text-sm text-[#888] uppercase tracking-wide mb-1">Starting from</span>
                  <div className="text-3xl font-serif text-[#1a1a1a]">
                    USD {tour.price?.amount ?? tour.price}
                  </div>
                  {tour.localPrice && (
                    <div className="text-sm text-[#888] mt-1">NPR {tour.localPrice}</div>
                  )}
                </>
              )}
            </div>`;

jsx = jsx.replace(priceOld, priceNew);

// Fix 2: Included Section
const goodToKnowOldRegex = /\{\/\* Travel Tips \/ Practical Info \*\/\}[\s\S]*?<\/section>\n          \)\}/;

const goodToKnowNew = `{/* Travel Tips / Practical Info */}
          {(tour.included?.length > 0 || tour.excluded?.length > 0) && (
            <section>
              <h2 className="font-serif text-3xl text-[#1a1a1a] mb-6 border-b border-[#e2d9cc] pb-4">Good to Know</h2>
              <div className="bg-[#f4efe6] p-6 sm:p-8 rounded-2xl border border-[#e2d9cc] grid grid-cols-1 sm:grid-cols-2 gap-8">
                {tour.included?.length > 0 && (
                  <div>
                    <h4 className="font-serif text-xl text-[#1a1a1a] mb-4">Included</h4>
                    <ul className="space-y-3">
                      {tour.included.map((item, i) => {
                        if (!item) return null;
                        return (
                          <li key={item._id || i} className="flex items-start gap-3">
                            <span className="text-[#84a98c] font-bold mt-0.5">?</span>
                            <span className="text-[#4a4238]">{item}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {tour.excluded?.length > 0 && (
                  <div>
                    <h4 className="font-serif text-xl text-[#1a1a1a] mb-4">Not Included</h4>
                    <ul className="space-y-3">
                      {tour.excluded.map((item, i) => {
                        if (!item) return null;
                        return (
                          <li key={item._id || i} className="flex items-start gap-3">
                            <span className="text-[#9c826b] font-bold mt-0.5">?</span>
                            <span className="text-[#4a4238]">{item}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}`;

jsx = jsx.replace(goodToKnowOldRegex, goodToKnowNew);

// Fix 3: Sticky Sidebar self-start
jsx = jsx.replace(
  /<div className="lg:col-span-4 space-y-6 sticky top-24">/g,
  '<div className="lg:col-span-4 space-y-6 sticky top-24 self-start">'
);

fs.writeFileSync('src/pages/TourDetails.jsx', jsx);
console.log('Fixed TourDetails.jsx');
