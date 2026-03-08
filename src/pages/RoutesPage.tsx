import React, { useEffect, useState, useRef } from 'react';
import { getLocations, type Location } from '../services/locationService';
import { getRoutes, type RouteResponseItem, type RouteDetail } from '../services/routeService';
import RouteDetailModal from '../components/RouteDetailModal';
import { useTranslation } from 'react-i18next';

const RoutesPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [originId, setOriginId] = useState<string>('');
  const [destinationId, setDestinationId] = useState<string>('');
  
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [routes, setRoutes] = useState<RouteResponseItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRoute, setSelectedRoute] = useState<RouteDetail | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await getLocations(1, 1000, {});
        if (response && response.data && Array.isArray(response.data.content)) {
          setLocations(response.data.content);
        }
      } catch (error) {
        console.error("Failed to fetch locations", error);
      }
    };
    fetchLocations();
  }, []);

  const getDayOfWeek = (dateString: string): string => {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const date = new Date(dateString);
    return days[date.getUTCDay()];
  };

  const handleSearch = async () => {
    if (!originId || !destinationId || !selectedDate) {
      return;
    }
    setLoading(true);
    setHasSearched(true);
    try {
      const dayOfWeek = getDayOfWeek(selectedDate);
      const response = await getRoutes(Number(originId), Number(destinationId), dayOfWeek);
      if (response && response.data) {
        setRoutes(response.data);
      } else {
        setRoutes([]);
      }
    } catch (error) {
      console.error("Failed to fetch routes", error);
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearOrigin = () => {
    setOriginId('');
    setRoutes([]);
    setHasSearched(false);
  };

  const handleClearDestination = () => {
    setDestinationId('');
    setRoutes([]);
    setHasSearched(false);
  };

  const handleClearDate = () => {
    setSelectedDate('');
    setRoutes([]);
    setHasSearched(false);
  };

  const handleOpenDetail = (route: RouteDetail) => {
    setSelectedRoute(route);
    setIsModalOpen(true);
  };

  const locationOptions = locations.map(loc => ({ value: loc.id.toString(), label: `${loc.name} (${loc.locationCode})` }));

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>{t('routes.title')}</h2>
      </div>

      <div className="search-container">
        <div className="search-input-wrapper">
          <select
            value={originId}
            onChange={(e) => setOriginId(e.target.value)}
            className="search-input"
            style={{ width: '100%' }}
          >
            <option value="">{t('routes.select_origin')}</option>
            {locationOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {originId && (
            <button 
              className="search-input-clear-btn" 
              onClick={handleClearOrigin}
              title={t('common.close')}
              style={{ right: '25px' }}
            >
              &times;
            </button>
          )}
        </div>
        <div className="search-input-wrapper">
          <select
            value={destinationId}
            onChange={(e) => setDestinationId(e.target.value)}
            className="search-input"
            style={{ width: '100%' }}
          >
            <option value="">{t('routes.select_destination')}</option>
            {locationOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {destinationId && (
            <button 
              className="search-input-clear-btn" 
              onClick={handleClearDestination}
              title={t('common.close')}
              style={{ right: '25px' }}
            >
              &times;
            </button>
          )}
        </div>
        <div className="search-input-wrapper">
          <input
            type="date"
            ref={dateInputRef}
            min={today}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: '100%', height: '100%', left: 0, top: 0 }}
          />
          <div 
            className={`search-input ${selectedDate ? 'has-value' : ''}`}
            onClick={() => dateInputRef.current?.showPicker()}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              color: selectedDate ? 'white' : 'rgba(255, 255, 255, 0.5)'
            }}
          >
            {selectedDate || t('routes.choose_date')}
          </div>
          {selectedDate && (
            <button 
              className="search-input-clear-btn" 
              onClick={handleClearDate}
              title={t('common.close')}
              style={{ right: '35px' }}
            >
              &times;
            </button>
          )}
        </div>
        <button onClick={handleSearch} className="btn-action btn-edit" disabled={loading}>
          {loading ? t('routes.searching') : t('common.search')}
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('locations.name')}</th>
              <th style={{ width: '150px', textAlign: 'center' }}>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
               Array.from({ length: 3 }).map((_, index) => (
                <tr key={`skeleton-${index}`}>
                  <td><div className="skeleton-box" style={{ width: '60%' }}></div></td>
                  <td><div className="skeleton-box" style={{ width: '100px' }}></div></td>
                </tr>
              ))
            ) : routes.length > 0 ? (
              routes.map((item, index) => (
                <tr key={index}>
                  <td>{item.route.title}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button onClick={() => handleOpenDetail(item.route)} className="btn-action btn-edit">{t('common.detail')}</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} style={{ textAlign: 'center', padding: '20px', color: '#aaa' }}>
                  {hasSearched ? t('routes.no_routes') : t('routes.please_search')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <RouteDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        route={selectedRoute} 
      />
    </div>
  );
};

export default RoutesPage;
