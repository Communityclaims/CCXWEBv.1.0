import React, { useState, useEffect } from 'react';
import { SCN_REGIONS } from '../data/regions';
import { Region } from '../types';

interface NysMapProps {
  selectedRegion: string | null;
  onSelectRegion: (regionKey: string | null) => void;
}

export default function NysMap({ selectedRegion, onSelectRegion }: NysMapProps) {
  const [hoveredRegionKey, setHoveredRegionKey] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Map SVG path IDs to SCN region keys
  const svgPathToRegionKeyMap: Record<string, string> = {
    wnyicc: 'wnyicc',
    forward: 'fingerlakes',
    carecompass: 'southerntier',
    healthyalliance: 'capital', // Path represents the CDHA group; defaults to Capital
    hudson: 'midhudson',
    somos: 'bronx',
    statenisland: 'statenisland',
    heali: 'longisland',
    phs: 'brooklyn' // NYC Core path; defaults to Brooklyn
  };

  const regionsPaths = [
    {
      id: 'wnyicc',
      name: 'Western NY',
      fill: '#1B3352',
      d: 'M 106.5,173.3 L 95.0,175.5 L 82.0,180.2 L 68.5,181.8 L 54.0,185.0 L 48.0,192.5 L 45.0,205.0 L 40.0,212.0 L 32.5,218.0 L 26.0,225.0 L 22.0,235.0 L 24.5,246.0 L 32.0,252.0 L 36.0,258.0 L 34.0,265.5 L 28.0,274.0 L 21.5,285.5 L 14.0,306.3 L 53.8,306.3 L 106.5,306.3 L 106.5,275.0 L 105.0,250.0 L 108.0,220.0 Z'
    },
    {
      id: 'forward',
      name: 'Finger Lakes',
      fill: '#2D4A6B',
      d: 'M 106.5,173.3 L 108.0,220.0 L 105.0,250.0 L 106.5,275.0 L 106.5,306.3 L 150.0,306.3 L 195.0,306.3 L 235.0,306.3 L 253.0,306.3 L 248.0,285.0 L 252.0,260.0 L 244.0,235.0 L 238.8,210.0 L 231.7,179.1 L 213.9,179.1 L 185.0,174.5 L 155.0,172.0 L 125.0,171.3 Z'
    },
    {
      id: 'carecompass',
      name: 'Southern Tier',
      fill: '#44607F',
      d: 'M 253.0,306.3 L 242.4,306.3 L 239.5,280.0 L 238.8,252.9 L 255.0,253.0 L 270.0,250.0 L 285.0,252.9 L 305.0,245.0 L 322.0,238.5 L 338.4,238.3 L 352.0,248.0 L 366.9,257.8 L 373.0,280.0 L 379.7,301.5 L 364.0,310.0 L 348.4,318.9 L 335.0,311.0 L 327.0,306.3 L 253.0,306.3 Z'
    },
    {
      id: 'healthyalliance',
      name: 'Capital · Central · North Country',
      fill: '#0B1F33',
      d: 'M 231.7,179.1 L 235.0,200.0 L 238.8,225.0 L 238.8,252.9 L 255.0,253.0 L 270.0,250.0 L 285.0,252.9 L 305.0,245.0 L 322.0,238.5 L 338.4,238.3 L 352.0,248.0 L 366.9,257.8 L 373.0,280.0 L 379.7,301.5 L 400.0,301.5 L 425.0,301.5 L 460.0,301.5 L 459.3,277.2 L 475.7,234.4 L 473.6,189.8 L 465.0,155.8 L 466.4,131.5 L 467.9,68.4 L 470.7,14.0 L 422.3,15.0 L 372.5,15.0 L 331.3,42.2 L 295.7,73.2 L 251.6,92.7 L 267.3,129.6 L 245.2,163.6 Z'
    },
    {
      id: 'hudson',
      name: 'Mid-Hudson',
      fill: '#64758A',
      d: 'M 379.7,301.5 L 405.0,301.5 L 432.0,301.5 L 460.0,301.5 L 459.0,325.0 L 457.0,345.0 L 455.8,364.6 L 457.5,375.0 L 460.8,383.0 L 454.0,392.0 L 447.9,403.4 L 443.0,407.0 L 438.0,411.2 L 433.0,408.0 L 428.0,402.0 L 418.0,395.0 L 405.0,385.0 L 388.0,375.0 L 374.7,368.5 L 360.0,340.0 L 348.4,318.9 L 364.0,310.0 Z'
    },
    {
      id: 'somos',
      name: 'The Bronx',
      fill: '#44607F',
      d: 'M 438.0,411.2 L 441.5,414.5 L 443.0,418.0 L 439.5,421.5 L 435.9,422.8 L 432.5,421.5 L 428.7,420.9 L 429.5,417.0 L 428.7,415.1 Z'
    },
    {
      id: 'phs',
      name: 'NYC Core',
      fill: '#1B3352',
      d: 'M 428.7,415.1 L 428.7,420.9 L 432.5,421.5 L 435.9,422.8 L 439.5,421.5 L 443.0,421.0 L 445.5,423.5 L 443.7,426.7 L 442.3,441.3 L 434.4,445.2 L 423.1,445.2 L 421.6,432.6 L 425.9,428.7 Z'
    },
    {
      id: 'statenisland',
      name: 'Staten Island',
      fill: '#8593A5',
      d: 'M 404.6,438.4 L 406.5,445.0 L 409.5,452.0 L 415.0,451.0 L 420.9,449.1 L 419.5,442.0 L 417.5,437.4 L 411.0,436.5 Z'
    },
    {
      id: 'heali',
      name: 'Long Island',
      fill: '#2D4A6B',
      d: 'M 443.7,426.7 L 450.8,441.3 L 466.4,438.4 L 510.6,423.8 L 537.6,403.4 L 565.0,398.0 L 576.0,395.7 L 570.0,398.0 L 555.0,401.0 L 545.0,405.0 L 550.0,408.0 L 558.0,412.0 L 568.0,415.0 L 582.0,416.0 L 550.0,418.0 L 526.9,419.0 L 487.8,421.0 L 465.0,422.0 L 443.0,422.8 Z'
    }
  ];

  const handleRegionClick = (key: string) => {
    if (selectedRegion === key) {
      onSelectRegion(null);
    } else {
      onSelectRegion(key);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left + 15,
      y: e.clientY - rect.top + 15
    });
  };

  const activeHoveredDetails = null; // Removed tooltip to adhere to specifications

  // Helper check if a region id belongs to a selected key
  const isRegionActiveInSvg = (pathId: string): boolean => {
    if (!selectedRegion) return false;
    if (pathId === 'healthyalliance') {
      return ['capital', 'centralny', 'northcountry'].includes(selectedRegion);
    }
    if (pathId === 'phs') {
      return ['brooklyn', 'queens', 'manhattan'].includes(selectedRegion);
    }
    return svgPathToRegionKeyMap[pathId] === selectedRegion;
  };

  const isRegionHoveredInSvg = (pathId: string): boolean => {
    if (!hoveredRegionKey) return false;
    if (hoveredRegionKey === pathId) return true;
    if (pathId === 'healthyalliance') {
      return ['capital', 'centralny', 'northcountry'].includes(hoveredRegionKey);
    }
    if (pathId === 'phs') {
      return ['brooklyn', 'queens', 'manhattan'].includes(hoveredRegionKey);
    }
    return svgPathToRegionKeyMap[pathId] === hoveredRegionKey;
  };

  return (
    <div 
      className="relative w-full h-auto bg-[#F7F8F9] rounded-xl border border-navy/10 p-5  overflow-visible"
      onMouseMove={handleMouseMove}
      id="ny-map-container"
    >
      {/* Mobile-Only Dropdown Selector (Touch target >= 44px, extremely accessible & responsive) */}
      <div className="md:hidden mb-4 text-left">
        <label htmlFor="mobile-region-select" className="block text-[11px] font-bold text-[#0B1F3A] uppercase mb-1.5 tracking-wider">
          Select NYS SCN Footprint / Region
        </label>
        <select
          id="mobile-region-select"
          value={selectedRegion || ''}
          onChange={(e) => onSelectRegion(e.target.value || null)}
          className="w-full px-3 py-3 bg-white border border-[#E2E8F0] rounded-lg text-xs outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 text-[#0B1F3A] h-11 cursor-pointer font-medium"
        >
          <option value="">-- Choose a SCN Footprint --</option>
          {Object.entries(SCN_REGIONS).map(([key, reg]) => (
            <option key={key} value={key}>
              {reg.name} ({reg.counties.length} Counties)
            </option>
          ))}
        </select>
        <p className="text-[10px] text-slate-400 mt-1.5 leading-normal">
          Select a regional footprint from the list to evaluate demographics, local lead entities, and audit complexity.
        </p>
      </div>

      <svg
        id="ny-map"
        viewBox="0 0 786 466"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto block select-none focus:outline-none"
        aria-label="Interactive Map of New York State Social Care Network regions"
      >
        {/* Region Paths */}
        {regionsPaths.map((pathItem) => {
          const isSelected = isRegionActiveInSvg(pathItem.id);
          const isHovered = isRegionHoveredInSvg(pathItem.id);
          const hasSelection = selectedRegion !== null;
          const mappedKey = svgPathToRegionKeyMap[pathItem.id];
          
          let fillOpacity = '1';
          let stroke = '#FAF9F6';
          let strokeWidth = '1.2';
          let filter = 'none';

          if (hasSelection) {
            fillOpacity = isSelected ? '1' : '0.22';
            stroke = isSelected ? '#B8860B' : '#FAF9F6';
            strokeWidth = isSelected ? '2.2' : '1.2';
            filter = 'none';
          } else if (isHovered) {
            stroke = '#B8860B';
            strokeWidth = '2';
            filter = 'none';
          }

          return (
            <path
              key={pathItem.id}
              className={`cursor-pointer ${prefersReducedMotion ? '' : 'transition-all duration-150'}`}
              d={pathItem.d}
              fill={pathItem.fill}
              style={{
                fillOpacity,
                stroke,
                strokeWidth,
                filter,
              }}
              onClick={() => handleRegionClick(mappedKey)}
              onMouseEnter={() => setHoveredRegionKey(pathItem.id)}
              onMouseLeave={() => setHoveredRegionKey(null)}
              tabIndex={0}
              role="button"
              aria-label={`${pathItem.name} SCN region`}
              aria-pressed={isSelected}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleRegionClick(mappedKey);
                }
              }}
            />
          );
        })}

        {/* Region Text Labels */}
        <text className="fill-white font-sans font-semibold pointer-events-none stroke-[#0B1F33]/40" style={{ paintOrder: 'stroke', strokeWidth: '2.5px', strokeLinejoin: 'round' }} x="65" y="245" textAnchor="middle" fontSize="11">
          Western NY
        </text>
        <text className="fill-white font-sans font-semibold pointer-events-none stroke-[#0B1F33]/40" style={{ paintOrder: 'stroke', strokeWidth: '2.5px', strokeLinejoin: 'round' }} x="175" y="235" textAnchor="middle" fontSize="11">
          Finger Lakes
        </text>
        <text className="fill-white font-sans font-semibold pointer-events-none stroke-[#0B1F33]/40" style={{ paintOrder: 'stroke', strokeWidth: '2.5px', strokeLinejoin: 'round' }} x="295" y="285" textAnchor="middle" fontSize="10.5">
          Southern Tier
        </text>
        <text className="fill-white font-sans font-semibold pointer-events-none stroke-[#0B1F33]/40" style={{ paintOrder: 'stroke', strokeWidth: '2.5px', strokeLinejoin: 'round' }} x="360" y="145" textAnchor="middle" fontSize="11">
          <tspan x="360" dy="0">Capital · Central</tspan>
          <tspan x="360" dy="13">North Country</tspan>
        </text>
        <text className="fill-white font-sans font-semibold pointer-events-none stroke-[#0B1F33]/40" style={{ paintOrder: 'stroke', strokeWidth: '2.5px', strokeLinejoin: 'round' }} x="420" y="340" textAnchor="middle" fontSize="10.5">
          <tspan x="420" dy="0">Mid-Hudson</tspan>
        </text>

        {/* HUD/Indicators Column for detailed selection */}
        <text x="608" y="42" fontSize="9" fill="#55617A" fontFamily="ui-monospace,SFMono-Regular,monospace" fontWeight="600" letterSpacing="1.2">CAPITAL · CENTRAL · NORTH</text>

        {/* Region 1: Capital */}
        <g 
          className="cursor-pointer group focus:outline-none" 
          onClick={() => handleRegionClick('capital')}
          onMouseEnter={() => setHoveredRegionKey('capital')}
          onMouseLeave={() => setHoveredRegionKey(null)}
          tabIndex={0}
          role="button"
          aria-label="Select Capital Region"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleRegionClick('capital');
            }
          }}
        >
          <rect x="608" y="52" width="10" height="10" rx="2" fill={selectedRegion === 'capital' ? '#B8860B' : '#0B1F33'} className="transition-colors duration-150" />
          <text x="626" y="61" fontSize="11" fontFamily="inherit" fill={selectedRegion === 'capital' ? '#B8860B' : '#0B1F33'} className="font-semibold group-hover:fill-[#B8860B] transition-colors">Capital Region</text>
          <text x="626" y="72" fontSize="8.5" fontFamily="ui-monospace,SFMono-Regular,monospace" fill="#6B7280">SCN Region · Highly Complex</text>
        </g>

        {/* Region 7: Central NY */}
        <g 
          className="cursor-pointer group focus:outline-none" 
          onClick={() => handleRegionClick('centralny')}
          onMouseEnter={() => setHoveredRegionKey('centralny')}
          onMouseLeave={() => setHoveredRegionKey(null)}
          tabIndex={0}
          role="button"
          aria-label="Select Central NY Region"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleRegionClick('centralny');
            }
          }}
        >
          <rect x="608" y="82" width="10" height="10" rx="2" fill={selectedRegion === 'centralny' ? '#B8860B' : '#0B1F33'} className="transition-colors duration-150" />
          <text x="626" y="91" fontSize="11" fontFamily="inherit" fill={selectedRegion === 'centralny' ? '#B8860B' : '#0B1F33'} className="font-semibold group-hover:fill-[#B8860B] transition-colors">Central NY</text>
          <text x="626" y="102" fontSize="8.5" fontFamily="ui-monospace,SFMono-Regular,monospace" fill="#6B7280">SCN Region · Highly Complex</text>
        </g>

        {/* Region 9: North Country */}
        <g 
          className="cursor-pointer group focus:outline-none" 
          onClick={() => handleRegionClick('northcountry')}
          onMouseEnter={() => setHoveredRegionKey('northcountry')}
          onMouseLeave={() => setHoveredRegionKey(null)}
          tabIndex={0}
          role="button"
          aria-label="Select North Country Region"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleRegionClick('northcountry');
            }
          }}
        >
          <rect x="608" y="112" width="10" height="10" rx="2" fill={selectedRegion === 'northcountry' ? '#B8860B' : '#0B1F33'} className="transition-colors duration-150" />
          <text x="626" y="121" fontSize="11" fontFamily="inherit" fill={selectedRegion === 'northcountry' ? '#B8860B' : '#0B1F33'} className="font-semibold group-hover:fill-[#B8860B] transition-colors">North Country</text>
          <text x="626" y="132" fontSize="8.5" fontFamily="ui-monospace,SFMono-Regular,monospace" fill="#6B7280">SCN Region · Standard Env</text>
        </g>

        {/* HUD/Indicators for NYC (lines for clarity) */}
        <text x="608" y="158" fontSize="9" fill="#55617A" fontFamily="ui-monospace,SFMono-Regular,monospace" fontWeight="600" letterSpacing="1.2">NEW YORK CITY BOROUGHS</text>

        {/* Bronx */}
        <g 
          className="cursor-pointer group focus:outline-none" 
          onClick={() => handleRegionClick('bronx')}
          onMouseEnter={() => setHoveredRegionKey('bronx')}
          onMouseLeave={() => setHoveredRegionKey(null)}
          tabIndex={0}
          role="button"
          aria-label="Select Bronx region"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleRegionClick('bronx');
            }
          }}
        >
          <line x1="436.0" y1="416.0" x2="600.0" y2="182.0" stroke="#CBD5E1" strokeWidth="1" />
          <circle cx="436.0" cy="416.0" r="2.5" fill="#0B1F33" />
          <rect x="608" y="168" width="10" height="10" rx="2" fill={selectedRegion === 'bronx' ? '#B8860B' : '#44607F'} className="transition-colors" />
          <text x="626" y="177" fontSize="11" fontFamily="inherit" fill={selectedRegion === 'bronx' ? '#B8860B' : '#0B1F33'} className="font-semibold group-hover:fill-[#B8860B] transition-colors">The Bronx (4A)</text>
          <text x="626" y="188" fontSize="8.5" fontFamily="ui-monospace,SFMono-Regular,monospace" fill="#6B7280">SCN Region · Highly Complex</text>
        </g>

        {/* Brooklyn */}
        <g 
          className="cursor-pointer group focus:outline-none" 
          onClick={() => handleRegionClick('brooklyn')}
          onMouseEnter={() => setHoveredRegionKey('brooklyn')}
          onMouseLeave={() => setHoveredRegionKey(null)}
          tabIndex={0}
          role="button"
          aria-label="Select Brooklyn region"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleRegionClick('brooklyn');
            }
          }}
        >
          <line x1="432.0" y1="430.0" x2="600.0" y2="212.0" stroke="#CBD5E1" strokeWidth="1" />
          <circle cx="432.0" cy="430.0" r="2.5" fill="#0B1F33" />
          <rect x="608" y="198" width="10" height="10" rx="2" fill={selectedRegion === 'brooklyn' ? '#B8860B' : '#1B3352'} className="transition-colors" />
          <text x="626" y="207" fontSize="11" fontFamily="inherit" fill={selectedRegion === 'brooklyn' ? '#B8860B' : '#0B1F33'} className="font-semibold group-hover:fill-[#B8860B] transition-colors">Brooklyn (4B)</text>
          <text x="626" y="218" fontSize="8.5" fontFamily="ui-monospace,SFMono-Regular,monospace" fill="#6B7280">SCN Region · Highly Complex</text>
        </g>

        {/* Queens */}
        <g 
          className="cursor-pointer group focus:outline-none" 
          onClick={() => handleRegionClick('queens')}
          onMouseEnter={() => setHoveredRegionKey('queens')}
          onMouseLeave={() => setHoveredRegionKey(null)}
          tabIndex={0}
          role="button"
          aria-label="Select Queens region"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleRegionClick('queens');
            }
          }}
        >
          <line x1="440.0" y1="434.0" x2="600.0" y2="242.0" stroke="#CBD5E1" strokeWidth="1" />
          <circle cx="440.0" cy="434.0" r="2.5" fill="#0B1F33" />
          <rect x="608" y="228" width="10" height="10" rx="2" fill={selectedRegion === 'queens' ? '#B8860B' : '#1B3352'} className="transition-colors" />
          <text x="626" y="237" fontSize="11" fontFamily="inherit" fill={selectedRegion === 'queens' ? '#B8860B' : '#0B1F33'} className="font-semibold group-hover:fill-[#B8860B] transition-colors">Queens (4C)</text>
          <text x="626" y="248" fontSize="8.5" fontFamily="ui-monospace,SFMono-Regular,monospace" fill="#6B7280">SCN Region · Standard Env</text>
        </g>

        {/* Manhattan */}
        <g 
          className="cursor-pointer group focus:outline-none" 
          onClick={() => handleRegionClick('manhattan')}
          onMouseEnter={() => setHoveredRegionKey('manhattan')}
          onMouseLeave={() => setHoveredRegionKey(null)}
          tabIndex={0}
          role="button"
          aria-label="Select Manhattan region"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleRegionClick('manhattan');
            }
          }}
        >
          <line x1="428.0" y1="425.0" x2="600.0" y2="272.0" stroke="#CBD5E1" strokeWidth="1" />
          <circle cx="428.0" cy="425.0" r="2.5" fill="#0B1F33" />
          <rect x="608" y="258" width="10" height="10" rx="2" fill={selectedRegion === 'manhattan' ? '#B8860B' : '#1B3352'} className="transition-colors" />
          <text x="626" y="267" fontSize="11" fontFamily="inherit" fill={selectedRegion === 'manhattan' ? '#B8860B' : '#0B1F33'} className="font-semibold group-hover:fill-[#B8860B] transition-colors">Manhattan (4D)</text>
          <text x="626" y="278" fontSize="8.5" fontFamily="ui-monospace,SFMono-Regular,monospace" fill="#6B7280">SCN Region · Standard Env</text>
        </g>

        {/* Staten Island */}
        <g 
          className="cursor-pointer group focus:outline-none" 
          onClick={() => handleRegionClick('statenisland')}
          onMouseEnter={() => setHoveredRegionKey('statenisland')}
          onMouseLeave={() => setHoveredRegionKey(null)}
          tabIndex={0}
          role="button"
          aria-label="Select Staten Island region"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleRegionClick('statenisland');
            }
          }}
        >
          <line x1="412.0" y1="444.0" x2="600.0" y2="302.0" stroke="#CBD5E1" strokeWidth="1" />
          <circle cx="412.0" cy="444.0" r="2.5" fill="#0B1F33" />
          <rect x="608" y="288" width="10" height="10" rx="2" fill={selectedRegion === 'statenisland' ? '#B8860B' : '#8593A5'} className="transition-colors" />
          <text x="626" y="297" fontSize="11" fontFamily="inherit" fill={selectedRegion === 'statenisland' ? '#B8860B' : '#0B1F33'} className="font-semibold group-hover:fill-[#B8860B] transition-colors">Staten Island (4E)</text>
          <text x="626" y="308" fontSize="8.5" fontFamily="ui-monospace,SFMono-Regular,monospace" fill="#6B7280">SCN Region · Standard Env</text>
        </g>

        {/* LONG ISLAND */}
        <text x="608" y="338" fontSize="9" fill="#55617A" fontFamily="ui-monospace,SFMono-Regular,monospace" fontWeight="600" letterSpacing="1.2">LONG ISLAND · 1 SCN</text>

        <g 
          className="cursor-pointer group focus:outline-none" 
          onClick={() => handleRegionClick('longisland')}
          onMouseEnter={() => setHoveredRegionKey('longisland')}
          onMouseLeave={() => setHoveredRegionKey(null)}
          tabIndex={0}
          role="button"
          aria-label="Select Long Island region"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleRegionClick('longisland');
            }
          }}
        >
          <line x1="495.0" y1="420.0" x2="600.0" y2="352.0" stroke="#CBD5E1" strokeWidth="1" />
          <circle cx="495.0" cy="420.0" r="2.5" fill="#0B1F33" />
          <rect x="608" y="348" width="10" height="10" rx="2" fill={selectedRegion === 'longisland' ? '#B8860B' : '#2D4A6B'} className="transition-colors" />
          <text x="626" y="357" fontSize="11" fontFamily="inherit" fill={selectedRegion === 'longisland' ? '#B8860B' : '#0B1F33'} className="font-semibold group-hover:fill-[#B8860B] transition-colors">Long Island (8)</text>
          <text x="626" y="368" fontSize="8.5" fontFamily="ui-monospace,SFMono-Regular,monospace" fill="#6B7280">SCN Region · Standard Env</text>
        </g>

        <text x="8" y="460" fontSize="8.5" fill="#6B7280" fontFamily="ui-monospace,SFMono-Regular,monospace" fontWeight="500">
          * Use Tab to navigate regions · Enter/Space to select · Hover to inspect details
        </text>
      </svg>

      {/* Tooltip removed */}
    </div>
  );
}
