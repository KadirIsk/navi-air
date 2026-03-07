import React, { useEffect, useState } from 'react';
import { getLocations, deleteLocation, createLocation, updateLocation, type Location, type LocationFilter } from '../services/locationService';
import Modal, { type ModalButton } from '../components/Modal';

const Locations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [filters, setFilters] = useState<LocationFilter>({
    name: '',
    country: '',
    city: '',
    locationCode: ''
  });
  
  const [isAddRowPinned, setIsAddRowPinned] = useState<boolean>(false);
  const [isAddRowHovered, setIsAddRowHovered] = useState<boolean>(false);
  const [newLocation, setNewLocation] = useState<Partial<Location>>({
    name: '',
    country: '',
    city: '',
    locationCode: ''
  });
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editCountry, setEditCountry] = useState<string>('');
  const [editCity, setEditCity] = useState<string>('');

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    buttons?: ModalButton[];
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const fetchLocations = async (currentFilters = filters) => {
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(currentFilters).filter(([_, v]) => v !== '')
      );
      
      const response = await getLocations(page, pageSize, activeFilters);
      if (response && response.data && Array.isArray(response.data.content)) {
        setLocations(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        setLocations([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Failed to fetch locations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [page, pageSize]);

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const handleDelete = (id: number) => {
    setModalConfig({
      isOpen: true,
      title: 'Delete Location',
      message: 'Are you sure you want to delete this location? This action cannot be undone.',
      type: 'warning',
      buttons: [
        { label: 'Cancel', onClick: closeModal, style: { backgroundColor: '#6c757d' } },
        { label: 'Delete', onClick: async () => {
            await deleteLocation(id);
            fetchLocations();
            closeModal();
          }, className: 'btn-delete', style: { backgroundColor: '#dc3545' } }
      ]
    });
  };

  const handleEdit = (location: Location) => {
    setEditingId(location.id);
    setEditName(location.name);
    setEditCountry(location.country);
    setEditCity(location.city);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditCountry('');
    setEditCity('');
  };

  const handleSaveEdit = async (id: number) => {
    try {
      await updateLocation(id, { name: editName, country: editCountry, city: editCity });
      setEditingId(null);
      setEditName('');
      setEditCountry('');
      setEditCity('');
      fetchLocations();
    } catch (error) {
      console.error("Failed to update location", error);
    }
  };

  const handleNewLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLocation(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveNewLocation = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!newLocation.name || newLocation.name.length > 150) {
      setModalConfig({ isOpen: true, title: 'Validation Error', message: 'Name is required and cannot exceed 150 characters.', type: 'error' });
      return;
    }
    if (!newLocation.country || newLocation.country.length > 100) {
      setModalConfig({ isOpen: true, title: 'Validation Error', message: 'Country is required and cannot exceed 100 characters.', type: 'error' });
      return;
    }
    if (!newLocation.city || newLocation.city.length > 100) {
      setModalConfig({ isOpen: true, title: 'Validation Error', message: 'City is required and cannot exceed 100 characters.', type: 'error' });
      return;
    }
    if (!newLocation.locationCode || newLocation.locationCode.length > 10) {
      setModalConfig({ isOpen: true, title: 'Validation Error', message: 'Location Code is required and cannot exceed 10 characters.', type: 'error' });
      return;
    }

    try {
      await createLocation(newLocation as Location);
      setNewLocation({ name: '', country: '', city: '', locationCode: '' });
      setIsAddRowPinned(false);
      fetchLocations();
    } catch (error) {
      console.error("Failed to create location", error);
    }
  };

  const handleCancelNewLocation = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddRowPinned(false);
    setNewLocation({ name: '', country: '', city: '', locationCode: '' });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const handleSearch = () => {
    if (page === 1) {
      fetchLocations();
    } else {
      setPage(1);
    }
  };

  const handleClearFilter = (name: keyof LocationFilter) => {
    const newFilters = { ...filters, [name]: '' };
    setFilters(newFilters);
    
    if (page === 1) {
      fetchLocations(newFilters);
    } else {
      setPage(1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const renderSearchInput = (name: keyof LocationFilter, placeholder: string) => (
    <div className="search-input-wrapper">
      <input
        name={name}
        placeholder={placeholder}
        value={filters[name]}
        onChange={handleFilterChange}
        onKeyDown={handleKeyDown}
        className="search-input"
      />
      {filters[name] && (
        <button 
          className="search-input-clear-btn" 
          onClick={() => handleClearFilter(name)}
          title="Clear"
        >
          &times;
        </button>
      )}
    </div>
  );

  const isAddActive = isAddRowPinned || isAddRowHovered;

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Locations</h2>
      </div>
      
      <div className="search-container">
        {renderSearchInput('name', 'Name')}
        {renderSearchInput('country', 'Country')}
        {renderSearchInput('city', 'City')}
        {renderSearchInput('locationCode', 'Code')}
        <button onClick={handleSearch} className="btn-action btn-edit">Search</button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Country</th>
              <th>City</th>
              <th>Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              onMouseEnter={() => setIsAddRowHovered(true)}
              onMouseLeave={() => setIsAddRowHovered(false)}
              onClick={() => !isAddRowPinned && setIsAddRowPinned(true)}
              style={{ cursor: isAddRowPinned ? 'default' : 'pointer', backgroundColor: isAddActive ? 'rgba(255,255,255,0.05)' : 'transparent' }}
            >
              {isAddActive ? (
                <>
                  <td><input name="name" value={newLocation.name} onChange={handleNewLocationChange} placeholder="Name" className="search-input" style={{width: '100%', boxSizing: 'border-box'}} autoFocus /></td>
                  <td><input name="country" value={newLocation.country} onChange={handleNewLocationChange} placeholder="Country" className="search-input" style={{width: '100%', boxSizing: 'border-box'}} /></td>
                  <td><input name="city" value={newLocation.city} onChange={handleNewLocationChange} placeholder="City" className="search-input" style={{width: '100%', boxSizing: 'border-box'}} /></td>
                  <td><input name="locationCode" value={newLocation.locationCode} onChange={handleNewLocationChange} placeholder="Code" className="search-input" style={{width: '100%', boxSizing: 'border-box'}} /></td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button onClick={handleSaveNewLocation} className="btn-action" style={{ backgroundColor: '#28a745', marginRight: '5px' }}>Save</button>
                    <button onClick={handleCancelNewLocation} className="btn-action" style={{ backgroundColor: '#dc3545' }}>Cancel</button>
                  </td>
                </>
              ) : (
                <td colSpan={5} style={{ textAlign: 'center', color: '#aaa', fontStyle: 'italic', padding: '15px' }}>
                  + Click to add new location
                </td>
              )}
            </tr>
            {loading ? (
              // Skeleton Loading Rows (5 adet sahte satır)
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`skeleton-${index}`}>
                  <td><div className="skeleton-box" style={{ width: '80%' }}></div></td>
                  <td><div className="skeleton-box" style={{ width: '60%' }}></div></td>
                  <td><div className="skeleton-box" style={{ width: '50%' }}></div></td>
                  <td><div className="skeleton-box" style={{ width: '40px' }}></div></td>
                  <td><div className="skeleton-box" style={{ width: '100px' }}></div></td>
                </tr>
              ))
            ) : (
              locations.map((loc) => (
                <tr key={loc.id}>
                  <td>
                    {editingId === loc.id ? (
                      <input 
                        value={editName} 
                        onChange={(e) => setEditName(e.target.value)} 
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveEdit(loc.id);
                          }
                        }}
                        className="search-input" 
                        style={{width: '100%', boxSizing: 'border-box'}} 
                        autoFocus 
                      />
                    ) : (
                      loc.name
                    )}
                  </td>
                  <td>
                    {editingId === loc.id ? (
                      <input 
                        value={editCountry} 
                        onChange={(e) => setEditCountry(e.target.value)} 
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveEdit(loc.id);
                          }
                        }}
                        className="search-input" 
                        style={{width: '100%', boxSizing: 'border-box'}} 
                        autoFocus 
                      />
                    ) : (
                      loc.country
                    )}
                    </td>
                  <td>
                    {editingId === loc.id ? (
                      <input 
                        value={editCity} 
                        onChange={(e) => setEditCity(e.target.value)} 
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveEdit(loc.id);
                          }
                        }}
                        className="search-input" 
                        style={{width: '100%', boxSizing: 'border-box'}} 
                        autoFocus 
                      />
                    ) : (
                      loc.city
                    )}
                  </td>
                  <td>{loc.locationCode}</td>
                  <td>
                    {editingId === loc.id ? (
                      <>
                        <button onClick={() => handleSaveEdit(loc.id)} className="btn-action" style={{ backgroundColor: '#28a745', marginRight: '5px' }}>Save</button>
                        <button onClick={handleCancelEdit} className="btn-action" style={{ backgroundColor: '#dc3545' }}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(loc)} className="btn-action btn-edit">Edit</button>
                        <button onClick={() => handleDelete(loc.id)} className="btn-action btn-delete">Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5}>
                <div className="pagination-container">
                  <select 
                    value={pageSize} 
                    onChange={handlePageSizeChange}
                    style={{ 
                      padding: '5px', 
                      borderRadius: '4px', 
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                    }}
                  >
                    <option value={5} style={{ color: 'black' }}>5</option>
                    <option value={10} style={{ color: 'black' }}>10</option>
                    <option value={20} style={{ color: 'black' }}>20</option>
                  </select>
                  <button 
                    className="icon-btn" 
                    disabled={page === 1 || loading} 
                    onClick={() => setPage(p => p - 1)}
                    title="Previous Page"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                    </svg>
                  </button>
                  <span>Page {page}</span>
                  <button 
                    className="icon-btn" 
                    disabled={loading || page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    title="Next Page"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <Modal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={closeModal}
        buttons={modalConfig.buttons}
      />
    </div>
  );
};

export default Locations;
