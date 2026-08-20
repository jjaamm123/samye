const fs = require('fs');
const file = 'src/pages/TourDetails.jsx';
const content = fs.readFileSync(file, 'utf8');

const splitMarker = "{/* -------------------------------------------\n          3 · TWO-COLUMN CONTENT\n      ------------------------------------------- */}";
const parts = content.split(splitMarker);

if (parts.length < 2) {
  console.log("Could not find split marker!");
  process.exit(1);
}

const beforeContent = parts[0] + splitMarker;

// Find the lightbox portal start to keep it
const lightboxMarker = "{/* -------------------------------------------\n          LIGHTBOX PORTAL\n      ------------------------------------------- */}";
const parts2 = parts[1].split(lightboxMarker);

if (parts2.length < 2) {
  console.log("Could not find lightbox marker!");
  process.exit(1);
}

const afterContent = "\n\n      " + lightboxMarker + parts2[1];

const newLayout = `
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* ========================================== */}
        {/* LEFT COLUMN */}
        {/* ========================================== */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Overview & Highlights */}
          <section id="section-overview">
            <h2 className="font-serif text-3xl text-[#1a1a1a] mb-6 border-b border-[#e2d9cc] pb-4">Overview</h2>
            <p className="text-[#4a4238] leading-relaxed text-lg mb-8">{tour.description}</p>
            
            {tour.included?.length > 0 && (
              <div>
                <h3 className="font-serif text-2xl text-[#1a1a1a] mb-6">Journey Highlights</h3>
                <ul className="space-y-4">
                  {tour.included.map((item, i) => {
                    if (!item) return null;
                    return (
                      <li key={item._id || i} className="flex items-start gap-4">
                        <span className="text-[#d4af37] mt-1">?</span>
                        <span className="text-[#4a4238] leading-relaxed">{item}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </section>

          {/* Itinerary Accordion */}
          {tour.itinerary?.length > 0 && (
            <section id="section-itinerary">
              <h2 className="font-serif text-3xl text-[#1a1a1a] mb-6 border-b border-[#e2d9cc] pb-4">
                Itinerary <span className="text-xl text-[#888] ml-3 font-sans font-normal">{tour.itinerary.length} Days</span>
              </h2>
              <div className="space-y-4">
                {tour.itinerary.map((day, idx) => {
                  if (!day) return null;
                  const isOpen = openDay === idx;
                  return (
                    <div key={day._id || idx} className="bg-[#f4efe6] border border-[#e2d9cc] rounded-xl overflow-hidden transition-all duration-300">
                      <button
                        className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                        onClick={() => setOpenDay(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-[#9c826b] font-semibold text-sm tracking-widest uppercase">Day {day.day || idx + 1}</span>
                          <span className="font-serif text-xl text-[#1a1a1a]">{day.title}</span>
                        </div>
                        <span className="text-[#9c826b] transform transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"/>
                          </svg>
                        </span>
                      </button>
                      <div className={\`transition-all duration-300 ease-in-out \${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}\`} style={{ overflow: 'hidden' }}>
                        <div className="px-6 pb-6 pt-2">
                          <p className="text-[#4a4238] leading-relaxed">
                            {day.description || 'No additional detail for this day.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Embedded Google Map */}
          {(tour.location || tour.destination) && (
            <section id="section-map">
              <h2 className="font-serif text-3xl text-[#1a1a1a] mb-6 border-b border-[#e2d9cc] pb-4">Route Map</h2>
              <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden shadow-sm border border-[#e2d9cc]">
                <iframe
                  title="Tour Location Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={\`https://maps.google.com/maps?q=\${encodeURIComponent(tour.location || tour.destination || 'Nepal')}&t=&z=10&ie=UTF8&iwloc=&output=embed\`}
                />
              </div>
            </section>
          )}

          {/* Travel Tips / Practical Info */}
          {tour.excluded?.length > 0 && (
            <section>
              <h2 className="font-serif text-3xl text-[#1a1a1a] mb-6 border-b border-[#e2d9cc] pb-4">Good to Know</h2>
              <div className="bg-[#f4efe6] p-6 rounded-2xl border border-[#e2d9cc]">
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
            </section>
          )}

        </div>

        {/* ========================================== */}
        {/* RIGHT COLUMN (STICKY CARDS) */}
        {/* ========================================== */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          
          {/* Card 1: Pricing & Action Card */}
          <div className="bg-[#f4efe6] p-6 sm:p-8 rounded-2xl border border-[#e2d9cc] shadow-sm">
            <h3 className="font-serif italic text-2xl text-[#1a1a1a] mb-2">{tour.title}</h3>
            
            <div className="mb-6 mt-4">
              <span className="block text-sm text-[#888] uppercase tracking-wide mb-1">{isPOR ? 'Pricing' : 'Starting from'}</span>
              <div className="text-3xl font-serif text-[#1a1a1a]">
                USD {tour.price?.amount ?? tour.price ?? 'POR'}
              </div>
              {tour.localPrice && (
                <div className="text-sm text-[#888] mt-1">NPR {tour.localPrice}</div>
              )}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={scrollToEnquire}
                className="flex-1 bg-[#9c826b] hover:bg-[#856d57] text-white font-medium py-3.5 rounded-xl transition text-center shadow-sm"
              >
                Enquire Now
              </button>
              <button 
                className="w-14 h-14 flex items-center justify-center bg-white border border-[#e2d9cc] text-[#9c826b] hover:bg-[#fbf9f5] rounded-xl transition shadow-sm shrink-0"
                onClick={() => {
                  const saved = JSON.parse(localStorage.getItem('samye_wishlist') || '[]');
                  if (saved.includes(tour._id)) {
                    localStorage.setItem('samye_wishlist', JSON.stringify(saved.filter(id => id !== tour._id)));
                    alert('Removed from wishlist');
                  } else {
                    localStorage.setItem('samye_wishlist', JSON.stringify([...saved, tour._id]));
                    alert('Added to wishlist');
                  }
                }}
                aria-label="Save to Wishlist"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Card 2: Categorization & Tags Card */}
          <div className="bg-[#f4efe6] p-6 rounded-2xl border border-[#e2d9cc] shadow-sm">
            <h4 className="font-serif text-xl text-[#1a1a1a] mb-5 border-b border-[#e2d9cc] pb-3">Experience Style</h4>
            <div className="flex flex-wrap gap-2">
              {[...(tour.experienceTheme || []), ...(tour.subTheme || []), ...(tour.travelStyle || [])].filter(Boolean).map((tag, i) => (
                <span key={i} className="bg-[#eae3d5] text-[#4a4238] px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide">
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ========================================== */}
      {/* BELOW-THE-GRID SECTIONS */}
      {/* ========================================== */}
      
      {/* Full-Width Visual Story / Gallery */}
      <div id="section-gallery" className="max-w-7xl mx-auto px-4 py-16 border-t border-[#e2d9cc]">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold tracking-widest text-[#9c826b] uppercase">Visual Story</span>
          <h2 className="font-serif text-4xl text-[#1a1a1a] mt-3">Tour Gallery</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(tour.galleryImages?.length > 0 ? tour.galleryImages : [tour.cardImage, tour.heroImage]).filter(Boolean).map((img, i) => (
            <div 
              key={i} 
              className="relative aspect-square overflow-hidden rounded-2xl cursor-pointer group"
              onClick={() => setLightboxIndex(i)}
            >
              <img src={img} alt={`Gallery ${i+1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-white/90 text-[#1a1a1a] px-4 py-2 rounded-full text-sm font-medium shadow-sm backdrop-blur-sm">
                  View Image
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Centered Enquiry Section */}
      <div id="enquiry-section" className="bg-[#f7f4ee] border-t border-[#e2d9cc]">
        <div className="max-w-3xl mx-auto px-4 py-20">
          <div className="text-center mb-10">
            <span className="text-sm font-semibold tracking-widest text-[#9c826b] uppercase">Start Planning</span>
            <h2 className="font-serif text-4xl text-[#1a1a1a] mt-3">Enquire About This Tour</h2>
            <p className="text-[#64748b] mt-4">Our travel experts respond within 24 hours with a personalised proposal.</p>
          </div>
          
          <div className="bg-[#f4efe6] p-8 sm:p-10 rounded-2xl border border-[#e2d9cc] shadow-sm">
            {inquiryStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 mb-6">
                ? Enquiry sent! We'll get back to you within 24 hours.
              </div>
            )}
            {inquiryStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 mb-6">
                ? Something went wrong. Please try the Contact page.
              </div>
            )}

            <form onSubmit={handleInquirySubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#4a4238] mb-2">Your Name</label>
                  <input name="name" value={inquiryData.name} onChange={handleInquiryChange} required className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9c826b]/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4a4238] mb-2">Your Email</label>
                  <input type="email" name="email" value={inquiryData.email} onChange={handleInquiryChange} required className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9c826b]/50" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#4a4238] mb-2">Travel Month</label>
                  <select name="travelMonth" value={inquiryData.travelMonth} onChange={handleInquiryChange} className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9c826b]/50">
                    {MONTHS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4a4238] mb-2">Group Size</label>
                  <select name="groupSize" value={inquiryData.groupSize} onChange={handleInquiryChange} className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9c826b]/50">
                    <option value="1">Solo (1)</option>
                    <option value="2">Couple (2)</option>
                    <option value="3-5">Small Group (3–5)</option>
                    <option value="6+">Large Group (6+)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4a4238] mb-2">Budget Range</label>
                  <select name="budgetRange" value={inquiryData.budgetRange} onChange={handleInquiryChange} className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9c826b]/50">
                    <option>Standard</option>
                    <option>Premium</option>
                    <option>Luxury</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4a4238] mb-2">Message</label>
                <textarea
                  name="message"
                  value={inquiryData.message}
                  onChange={handleInquiryChange}
                  placeholder={`Hi Samye Travels, I'm interested in the ${tour.title}. I'd love to know more about dates, group sizes, and possible customisations...`}
                  rows="5"
                  className="w-full bg-white border border-[#e2d9cc] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9c826b]/50 resize-y"
                />
              </div>

              <button type="submit" className="w-full bg-[#9c826b] hover:bg-[#856d57] text-white font-medium py-4 rounded-xl transition shadow-sm text-lg mt-2">
                Send Enquiry ?
              </button>
            </form>
          </div>
        </div>
      </div>
`;

fs.writeFileSync(file, beforeContent + newLayout + afterContent);
console.log("Replacement complete.");
