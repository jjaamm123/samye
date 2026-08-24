import { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, Map, Activity, AlertCircle, Filter } from 'lucide-react';
import TourCard from '../components/TourCard';
import AdventureCard from '../components/AdventureCard';
import { CurrencyContext } from '../context/CurrencyContext'; 
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import '../App.css';

function Packages() {
  const { currency, toggleCurrency } = useContext(CurrencyContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [tours, setTours] = useState([]);
  const [adventures, setAdventures] = useState([]);
  const [loadingTours, setLoadingTours] = useState(true);
  const [loadingAdv, setLoadingAdv] = useState(true);
  const [errorTours, setErrorTours] = useState(null);
  const [errorAdv, setErrorAdv] = useState(null);

  const [activeCategory, setActiveCategory] = useState('tours');
  const [search, setSearch] = useState('');
  
  // Adventures still use simple state filters as taxonomy wasn't overhauled for them
  const [adventureFilter, setAdventureFilter] = useState('All');

  useEffect(() => {
    const queryStr = searchParams.toString();
    const endpoint = queryStr ? `/api/tours?${queryStr}` : `/api/tours`;

    setLoadingTours(true);
    axios.get(`${import.meta.env.VITE_API_URL}${endpoint}`)
      .then(r => {
        const data = r.data;
        const arr = Array.isArray(data) ? data : Array.isArray(data?.tours) ? data.tours : Array.isArray(data?.data) ? data.data : [];
        setTours(arr);
      })
      .catch(() => setErrorTours('Could not load tour packages.'))
      .finally(() => setLoadingTours(false));
  }, [searchParams]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/adventures`)
      .then(r => {
        const data = r.data;
        const arr = Array.isArray(data) ? data : Array.isArray(data?.adventures) ? data.adventures : Array.isArray(data?.data) ? data.data : [];
        setAdventures(arr);
      })
      .catch(() => setErrorAdv('Could not load adventure packages.'))
      .finally(() => setLoadingAdv(false));
  }, []);

  const handleCategorySwitch = (cat) => {
    setActiveCategory(cat);
    setSearch('');
  };

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearch('');
    setAdventureFilter('All');
  };

  const safeTours = Array.isArray(tours) ? tours : [];
  const safeAdventures = Array.isArray(adventures) ? adventures : [];

  const filteredTours = safeTours.filter(t => {
    const matchSearch = !search || t.title?.toLowerCase().includes(search.toLowerCase()) || t.destination?.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const adventureFilterOptions = ['All', ...new Set(safeAdventures.map(a => a.intensity).filter(Boolean))];
  const filteredAdventures = safeAdventures.filter(a => {
    const matchFilter = adventureFilter === 'All' || a.intensity === adventureFilter;
    const matchSearch = !search || a.title?.toLowerCase().includes(search.toLowerCase()) || a.sportType?.toLowerCase().includes(search.toLowerCase()) || a.location?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const isTours = activeCategory === 'tours';
  const loading = isTours ? loadingTours : loadingAdv;
  const error   = isTours ? errorTours   : errorAdv;
  const count   = isTours ? filteredTours.length : filteredAdventures.length;

  const heroImage = isTours
    ? 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80'
    : 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1920&q=80';

  return (
    <div className="app-wrapper">
      <Navbar />

      <div className="packages-hero" style={{ backgroundImage: `url('${heroImage}')` }}>
        <div className="packages-hero-overlay"></div>
        <motion.div
          className="packages-hero-content"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="packages-hero-eyebrow" style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem' }}>
            {isTours ? 'Cultural Heritage' : 'Adventure Expeditions'}
          </span>
          <h1 className="packages-hero-title text-3xl md:text-4xl lg:text-5xl" style={{ fontWeight: '700', letterSpacing: '-1px' }}>Our Curated Packages</h1>
          <p className="packages-hero-sub" style={{ fontSize: '1.2rem', fontWeight: '300' }}>
            {isTours
              ? 'Guided treks, luxury monastery stays, and premium heritage circuits.'
              : 'White-water rafting, paragliding, and high-altitude Himalayan climbing.'}
          </p>
        </motion.div>

        <div className="packages-toggle-wrapper">
          <div className="packages-toggle" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div
              className="packages-toggle-slider"
              style={{ transform: isTours ? 'translateX(-5%)' : 'translateX(100%)', background: '#f1f5f9', border: '1px solid #e2e8f0' }}
            ></div>
            <button
              className={`packages-toggle-btn ${isTours ? 'active' : ''}`}
              onClick={() => handleCategorySwitch('tours')}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', 
                color: isTours ? '#0f172a' : '#94a3b8',
                zIndex: 2, fontWeight: '600', transition: 'color 0.2s' 
              }}
            >
              <Map size={18} /> Tours & Treks
            </button>
            <button
              className={`packages-toggle-btn ${!isTours ? 'active' : ''}`}
              onClick={() => handleCategorySwitch('adventures')}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', 
                color: !isTours ? '#0f172a' : '#94a3b8',
                zIndex: 2, fontWeight: '600', transition: 'color 0.2s' 
              }}
            >
              <Activity size={18} /> Adventure Sports
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center md:justify-end pt-16 md:pt-10 px-4 md:px-8 max-w-7xl mx-auto w-full mb-4 md:mb-0">
        <div className="bg-white rounded-lg p-1 flex gap-1 border border-slate-200 shadow-sm">
          <button 
            onClick={() => currency !== 'USD' && toggleCurrency()} 
            className={`px-4 py-1.5 rounded-md border-none cursor-pointer font-semibold text-sm transition-all ${currency === 'USD' ? 'bg-slate-100 text-slate-900' : 'bg-transparent text-slate-500 hover:text-slate-700'}`}
          >USD</button>
          <button 
            onClick={() => currency !== 'NPR' && toggleCurrency()} 
            className={`px-4 py-1.5 rounded-md border-none cursor-pointer font-semibold text-sm transition-all ${currency === 'NPR' ? 'bg-slate-100 text-slate-900' : 'bg-transparent text-slate-500 hover:text-slate-700'}`}
          >NPR</button>
        </div>
      </div>

      <div className="packages-controls flex flex-col md:flex-row gap-4 md:gap-5 items-center px-4 md:px-8 max-w-7xl mx-auto pb-6 border-b border-slate-200 bg-transparent shadow-none w-full">
        <div className="relative w-full md:flex-grow md:max-w-md">
          <Search size={18} color="#94a3b8" className="absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            className="packages-search w-full pl-11 pr-4 py-2 border border-slate-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={isTours ? 'Search destinations or titles...' : 'Search activities...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {!isTours && (
          <div className="packages-filters flex flex-wrap gap-2 w-full md:w-auto">
            {adventureFilterOptions.map(opt => (
              <button key={opt} className={`packages-filter-pill px-4 py-2 rounded-full text-sm transition-colors ${adventureFilter === opt ? 'bg-blue-600 text-white border border-blue-700' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`} onClick={() => setAdventureFilter(opt)}>
                {opt}
              </button>
            ))}
          </div>
        )}
        
        {!loading && (
          <span className="packages-result-count text-slate-500 font-medium md:ml-auto w-full md:w-auto text-center md:text-right">
            {count} {isTours ? 'itinerary' : 'activity'}{count !== 1 ? 'ies' : ''} found
          </span>
        )}
      </div>

      <div className="max-w-7xl mx-auto my-10 px-4 md:px-8 w-full">
        {/* FACETED TOUR FILTERS */}
        {isTours && (
          <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white border border-slate-200 rounded-lg p-4 md:p-6 items-start md:items-center w-full shadow-sm">
            <div className="flex items-center gap-2 md:mr-4 w-full md:w-auto justify-between md:justify-start">
              <div className="flex items-center gap-2">
                <Filter size={18} color="#0f172a" />
                <h3 className="m-0 text-lg text-slate-900 font-semibold">Filters</h3>
              </div>
              {(searchParams.toString() !== '') && (
                <button onClick={clearFilters} className="text-red-500 text-sm cursor-pointer hover:underline">Clear All</button>
              )}
            </div>

            <div className="w-full md:w-auto flex-1">
              <select 
                value={searchParams.get('destination') || ''} 
                onChange={e => updateFilter('destination', e.target.value)}
                className="w-full p-2.5 rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Destinations</option>
                <option value="Nepal">Nepal</option>
                <option value="Tibet">Tibet</option>
                <option value="India">India</option>
              </select>
            </div>

            <div className="w-full md:w-auto flex-1">
              <select 
                value={searchParams.get('experienceTheme') || ''} 
                onChange={e => updateFilter('experienceTheme', e.target.value)}
                className="w-full p-2.5 rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Themes</option>
                <option value="Adventure & Active">Adventure & Active</option>
                <option value="Nature & Discovery">Nature & Discovery</option>
                <option value="Culture & Lifestyle">Culture & Lifestyle</option>
                <option value="Leisure & Scenic">Leisure & Scenic</option>
              </select>
            </div>

            <div className="w-full md:w-auto flex-1">
              <select 
                value={searchParams.get('travelStyle') || ''} 
                onChange={e => updateFilter('travelStyle', e.target.value)}
                className="w-full p-2.5 rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Styles</option>
                <option value="Family">Family</option>
                <option value="Group">Group</option>
                <option value="Solo">Solo</option>
                <option value="Couples">Couples</option>
                <option value="Honeymoon">Honeymoon</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Tailor-Made">Tailor-Made</option>
              </select>
            </div>

            <div className="w-full md:w-auto flex-1">
              <select 
                value={searchParams.get('season') || ''} 
                onChange={e => updateFilter('season', e.target.value)}
                className="w-full p-2.5 rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Seasons</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Fall">Fall</option>
                <option value="Winter">Winter</option>
              </select>
            </div>
          </div>
        )}

        {/* PACKAGE GRID */}
        <div className="flex-grow min-w-0 w-full">
          {loading && <Loader message={isTours ? 'Curating available journeys...' : 'Loading adventures...'} />}
          {error && (
            <div className="flex items-center justify-center gap-2 text-red-500 p-10">
              <AlertCircle size={20} /> {error}
            </div>
          )}

          {!loading && !error && count === 0 && (
            <div className="packages-empty-state bg-slate-50 border border-dashed border-slate-300 rounded-xl p-16 text-center">
              <Search size={48} color="#cbd5e1" strokeWidth={1.5} className="mx-auto mb-4" />
              <p className="text-slate-600 text-lg mb-4">No {isTours ? 'tours' : 'adventures'} match your current filters.</p>
              <button className="bg-[#9c826b] hover:bg-[#856d57] text-white border-none py-2 px-5 rounded-md cursor-pointer transition-colors" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}

          {!loading && !error && count > 0 && (
            isTours ? (() => {
              // ── Group tours by destination/country ──────────────────────
              const grouped = filteredTours.reduce((acc, tour) => {
                const country = tour.destination || tour.country || 'Other Destinations';
                if (!acc[country]) acc[country] = [];
                acc[country].push(tour);
                return acc;
              }, {});

              // Preferred display order — known destinations first
              const ORDER = ['Nepal', 'Tibet', 'India'];
              const sortedEntries = Object.entries(grouped).sort(([a], [b]) => {
                const ai = ORDER.indexOf(a), bi = ORDER.indexOf(b);
                if (ai !== -1 && bi !== -1) return ai - bi;
                if (ai !== -1) return -1;
                if (bi !== -1) return 1;
                return a.localeCompare(b);
              });

              return sortedEntries.map(([country, tours]) => (
                <section key={country} className="mb-16">
                  {/* ── Country Section Header ── */}
                  <div className="flex items-center gap-4 mb-8 pb-3 border-b border-[#e2d9cc]/60">
                    {/* Country code pill */}
                    <span className="font-mono text-xs uppercase tracking-widest text-[#9c826b] bg-[#9c826b]/10 px-2.5 py-1 rounded-md font-semibold">
                      {country.slice(0, 2).toUpperCase()}
                    </span>
                    {/* Title + count */}
                    <div>
                      <h2 className="text-3xl font-serif text-[#1a1a1a] leading-tight">{country}</h2>
                      <p className="text-xs text-gray-500 tracking-wider uppercase mt-0.5">
                        {tours.length} {tours.length === 1 ? 'Journey' : 'Journeys'} Available
                      </p>
                    </div>
                  </div>

                  {/* ── Cards Grid ── */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {tours.map(tour => <TourCard key={tour._id || tour.id} tour={tour} />)}
                  </div>
                </section>
              ));
            })()
            : (
              // ── Adventures stay as a flat grid (no destination grouping) ──
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {filteredAdventures.map(adv => <AdventureCard key={adv._id} adventure={adv} />)}
              </div>
            )
          )}
        </div>
      </div>

    </div>
  );
}

export default Packages;
