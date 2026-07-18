'use client'
import GoalModeFeatures from '@/components/GoalModeFeatures'
import { useState, useEffect, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import PageEnhancements from '@/components/PageEnhancements'
import Footer from '@/components/Footer'
import PageHead from '@/components/PageHead'
import { materials, categories, origins, type MaterialItem } from '@/lib/interior-materials-data'


const originFlags: Record<string, string> = {
  India: '🇮🇳', China: '🇨🇳', Italy: '🇮🇹', USA: '🇺🇸', Germany: '🇩🇪',
  Turkey: '🇹🇷', Vietnam: '🇻🇳', Indonesia: '🇮🇩', Spain: '🇪🇸', Thailand: '🇹🇭',
}

const categoryIcons: Record<string, string> = {
  'Flooring': '🏠', 'Wall & Paint': '🎨', 'Lighting': '💡', 'Furniture': '🛋️',
  'Kitchen & Bath': '🚿', 'Fabric & Curtains': '🪟', 'Door & Window': '🚪',
  'Ceiling': '⬆️', 'Outdoor & Garden': '🌿', 'Decor & Art': '🖼️',
  'Hardware & Fittings': '🔧', 'Smart Home': '📱',
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating}</span>
    </div>
  )
}

function ProductCard({ item }: { item: MaterialItem }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
      {/* Category Icon Header */}
      <div className="relative h-32 bg-gradient-to-br from-[#1e3a5f] to-[#2c5282] flex items-center justify-center overflow-hidden">
        <span className="text-5xl opacity-80">{categoryIcons[item.category] || '🏠'}</span>
        {item.featured && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Featured
          </span>
        )}
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 shadow">
          {originFlags[item.origin] || '🌍'} {item.origin}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2">{item.name}</h3>
        </div>
        <p className="text-[11px] text-gray-400 mb-2">{item.supplier} · {item.location}</p>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description}</p>

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-extrabold text-[#1e3a5f]">{item.priceRange}</span>
            <span className="text-[10px] text-gray-400 ml-1">{item.priceUnit}</span>
          </div>
          <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">MOQ: {item.moq}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <StarRating rating={item.rating} />
          <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-medium">✓ Verified Supplier</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{item.supplierType}</span>
          <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium">{item.subcategory}</span>
        </div>

        <a
          href={item.wholesaleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] text-white text-sm font-semibold py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
        >
          View Wholesale →
        </a>
      </div>
    </div>
  )
}

export default function InteriorDesignPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeOrigin, setActiveOrigin] = useState('All')
  const [sortBy, setSortBy] = useState<'rating' | 'price-low' | 'price-high'>('rating')
  const [showFeatured, setShowFeatured] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  const filtered = useMemo(() => {
    let result = materials.filter(item => {
      const matchCat = activeCategory === 'All' || item.category === activeCategory
      const matchOrigin = activeOrigin === 'All' || item.origin === activeOrigin
      const matchFeatured = !showFeatured || item.featured
      const q = searchQuery.toLowerCase()
      const matchSearch = !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q)) ||
        item.supplier.toLowerCase().includes(q) ||
        item.subcategory.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      return matchCat && matchOrigin && matchFeatured && matchSearch
    })

    switch (sortBy) {
      case 'rating': result.sort((a, b) => b.rating - a.rating); break
      case 'price-low': result.sort((a, b) => parseFloat(a.priceRange.replace(/[^0-9.]/g, '')) - parseFloat(b.priceRange.replace(/[^0-9.]/g, ''))); break
      case 'price-high': result.sort((a, b) => parseFloat(b.priceRange.replace(/[^0-9.]/g, '')) - parseFloat(a.priceRange.replace(/[^0-9.]/g, ''))); break
    }
    return result
  }, [searchQuery, activeCategory, activeOrigin, sortBy, showFeatured])

  const featuredItems = materials.filter(m => m.featured)

  return (<>
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <PageEnhancements />

        {/* Cinematic Video Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        </div>


        {/* Cartoon Video Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        </div>

      <PageHead
        title="Interior Design Materials - Wholesale from India & Global Suppliers"
        description="Browse 40+ premium interior design materials from India, China, Italy, USA, Germany, Turkey, Vietnam, and Thailand. Wholesale prices with direct supplier links on IndiaMart, Alibaba, TradeIndia. Flooring, lighting, furniture, wallpaper, kitchen, bathroom, and home decor."
        keywords={['interior design materials wholesale', 'wholesale interior design India', 'flooring wholesale price', 'lighting wholesale India', 'furniture wholesale market', 'wallpaper wholesale India', 'kitchen materials wholesale', 'bathroom fittings wholesale', 'modular kitchen materials', 'home decor wholesale', 'IndiaMart interior materials', 'Alibaba interior design', 'TradeIndia wholesale', 'tiles wholesale India', 'plywood wholesale', 'sanitary ware wholesale', 'door wholesale India', 'window materials', 'false ceiling materials', 'paint wholesale', 'fabric wholesale upholstery', 'curtain materials wholesale', 'carpet flooring wholesale', 'LED lighting wholesale', 'modular furniture', 'office furniture wholesale', 'hotel interior materials', 'restaurant interior design', 'home interior design ideas']}
        ogImage="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=630&fit=crop"
        canonical="https://infinite-gundawar-webapp.vercel.app/interior-design"
      />

      {/* Cinematic Hero Image */}
      <div className="relative w-full h-[340px] md:h-[480px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&h=600&fit=crop" alt="Interior Design" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Hero */}
      <section className="relative pt-24 pb-12 bg-gradient-to-br from-[#1e3a5f] via-[#2c5282] to-[#1e3a5f] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#d4a843] rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-[#d4a843]/20 text-[#d4a843] text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            Wholesale Interior Materials
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Interior Design Materials<br />
            <span className="text-[#d4a843]">India & Global Wholesale</span>
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-sm md:text-base mb-8">
            Browse premium interior design materials from {new Set(materials.map(m => m.origin)).size} countries.
            Direct manufacturer and wholesale links for flooring, lighting, furniture, smart home, and more.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search materials, brands, categories, locations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/95 backdrop-blur-sm text-gray-800 placeholder-gray-400 shadow-xl focus:outline-none focus:ring-2 focus:ring-[#d4a843] text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className={`sticky top-16 z-30 transition-all duration-300 ${scrolled ? 'bg-white/95 shadow-md backdrop-blur-sm' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="font-semibold text-[#1e3a5f]">{filtered.length} products</span>
              <span>·</span>
              <span>{new Set(materials.map(m => m.origin)).size} countries</span>
              <span>·</span>
              <span>{categories.length - 1} categories</span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
              >
                <option value="rating">Top Rated</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
              <button
                onClick={() => setShowFeatured(!showFeatured)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${showFeatured ? 'bg-[#d4a843] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                ⭐ Featured
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-36">
              <h3 className="font-bold text-gray-800 mb-4 text-sm">Filters</h3>

              {/* Category */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Category</h4>
                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeCategory === cat ? 'bg-[#1e3a5f] text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {cat !== 'All' && <span>{categoryIcons[cat]}</span>}
                      {cat}
                      <span className="ml-auto text-[10px] opacity-60">
                        {cat === 'All' ? materials.length : materials.filter(m => m.category === cat).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Origin */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Origin Country</h4>
                <div className="space-y-1.5">
                  {origins.map(o => (
                    <button
                      key={o}
                      onClick={() => setActiveOrigin(o)}
                      className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeOrigin === o ? 'bg-[#1e3a5f] text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {o !== 'All' && <span>{originFlags[o] || '🌍'}</span>}
                      {o}
                      <span className="ml-auto text-[10px] opacity-60">
                        {o === 'All' ? materials.length : materials.filter(m => m.origin === o).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Links</h4>
                <div className="space-y-2">
                  <a href="https://www.indiamart.com" target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-600 hover:underline">IndiaMart — Indian Wholesale</a>
                  <a href="https://www.tradeindia.com" target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-600 hover:underline">TradeIndia — B2B Marketplace</a>
                  <a href="https://www.alibaba.com" target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-600 hover:underline">Alibaba — Global Wholesale</a>
                  <a href="https://www.made-in-china.com" target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-600 hover:underline">Made-in-China</a>
                  <a href="https://www.globalsources.com" target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-600 hover:underline">Global Sources</a>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Featured Section */}
            {!showFeatured && !searchQuery && activeCategory === 'All' && activeOrigin === 'All' && (
              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                  ⭐ Featured Materials
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {featuredItems.slice(0, 6).map(item => (
                    <ProductCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}

            {/* All / Filtered Results */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-5">
                {showFeatured ? '⭐ Featured Products' : activeCategory !== 'All' ? `${categoryIcons[activeCategory]} ${activeCategory}` : activeOrigin !== 'All' ? `${originFlags[activeOrigin]} ${activeOrigin} Products` : searchQuery ? `Results for "${searchQuery}"` : 'All Materials'}
                <span className="text-sm font-normal text-gray-400 ml-2">({filtered.length})</span>
              </h2>

              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-bold text-gray-600 mb-2">No materials found</h3>
                  <p className="text-sm text-gray-400 mb-4">Try adjusting your search or filters</p>
                  <button
                    onClick={() => { setSearchQuery(''); setActiveCategory('All'); setActiveOrigin('All'); setShowFeatured(false) }}
                    className="text-sm text-[#1e3a5f] font-semibold hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map(item => (
                    <ProductCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* House Design Guide */}
            <div className="mt-16 bg-gradient-to-br from-[#1e3a5f] to-[#2c5282] rounded-3xl p-8 md:p-12 text-white">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-4">🏠 Best Interior Materials for Your House</h2>
              <p className="text-blue-100 text-sm mb-8 max-w-2xl">
                A room-by-room guide to choosing the right materials for your dream home.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { room: 'Living Room', icon: '🛋️', items: ['Vitrified tiles or engineered wood flooring', 'Designer wallpaper or textured paint', 'Crystal or LED chandelier', 'Sheesham wood sofa set', 'Blackout + sheer curtains'] },
                  { room: 'Bedroom', icon: '🛏️', items: ['Engineered wood or SPC vinyl flooring', 'Royale luxury emulsion paint', 'LED cove lighting + panel lights', 'Upholstered bed with storage', 'Blackout curtains for sleep'] },
                  { room: 'Kitchen', icon: '🍳', items: ['Anti-skid vitrified tiles', 'Quartz or granite countertop', 'Modular cabinets with soft-close', 'Under-cabinet LED strip lights', 'Stainless steel sink & fittings'] },
                  { room: 'Bathroom', icon: '🚿', items: ['Anti-skid ceramic tiles', 'Moisture-resistant gypsum ceiling', 'Premium sanitaryware set', 'LED mirror light', 'Tempered glass partition'] },
                  { room: 'Dining Room', icon: '🍽️', items: ['Marble or large-format porcelain', 'Accent wall with Venetian plaster', 'Pendant lights over table', 'Solid wood dining set', 'Canvas art & photo frames'] },
                  { room: 'Home Office', icon: '💻', items: ['Laminate or vinyl flooring', 'Acoustic mineral fiber ceiling', 'Ergonomic mesh chair', 'LED track lighting', 'Smart switch panel'] },
                ].map(room => (
                  <div key={room.room} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
                    <h3 className="font-bold text-lg mb-3">{room.icon} {room.room}</h3>
                    <ul className="space-y-2">
                      {room.items.map((item, i) => (
                        <li key={i} className="text-xs text-blue-100 flex items-start gap-2">
                          <span className="text-[#d4a843] mt-0.5">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Wholesale Sources */}
            <div className="mt-12">
              <h2 className="text-xl font-bold text-gray-800 mb-6">🌍 Top Wholesale Sources</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'IndiaMart', country: '🇮🇳 India', url: 'https://www.indiamart.com', desc: 'Largest Indian B2B marketplace. 50M+ products.', color: 'from-orange-500 to-green-500' },
                  { name: 'Alibaba', country: '🇨🇳 China/Global', url: 'https://www.alibaba.com', desc: 'World\'s largest wholesale platform. Factory direct.', color: 'from-orange-400 to-red-500' },
                  { name: 'TradeIndia', country: '🇮🇳 India', url: 'https://www.tradeindia.com', desc: 'Verified Indian manufacturers and exporters.', color: 'from-blue-500 to-indigo-500' },
                  { name: 'Made-in-China', country: '🇨🇳 China', url: 'https://www.made-in-china.com', desc: 'Chinese factory direct. Best for bulk orders.', color: 'from-red-500 to-red-700' },
                  { name: 'Global Sources', country: '🌏 Asia', url: 'https://www.globalsources.com', desc: 'Verified Asian suppliers. Trade shows & online.', color: 'from-teal-500 to-cyan-500' },
                  { name: 'ExportersIndia', country: '🇮🇳 India', url: 'https://www.exportersindia.com', desc: 'Indian exporters directory. All categories.', color: 'from-purple-500 to-pink-500' },
                  { name: 'Wayfair', country: '🇺🇸 USA', url: 'https://www.wayfair.com', desc: 'Home furnishing wholesale. Modern designs.', color: 'from-emerald-500 to-green-600' },
                  { name: 'Home Depot Pro', country: '🇺🇸 USA', url: 'https://www.homedepot.com', desc: 'Bulk building materials. Contractor pricing.', color: 'from-orange-500 to-yellow-500' },
                ].map(src => (
                  <a
                    key={src.name}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${src.color} flex items-center justify-center text-white font-bold text-sm mb-3`}>
                      {src.name.charAt(0)}
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm group-hover:text-[#1e3a5f] transition-colors">{src.name}</h3>
                    <p className="text-[10px] text-gray-400 mb-1">{src.country}</p>
                    <p className="text-xs text-gray-500">{src.desc}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
    <GoalModeFeatures page="interior-design" />
  </>
  )
}