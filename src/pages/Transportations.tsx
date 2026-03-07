import React, { useEffect, useState } from 'react';
import { 
  getTransportations, 
  createTransportation, 
  updateTransportation, 
  deleteTransportation, 
  type Transportation, 
  type TransportationFilter, 
  type TransportationRequest,
  TRANSPORTATION_TYPES,
  OPERATING_DAYS,
  type OperatingDay,
  type TransportationType
} from '../services/transportationService';
import { getLocations, type Location } from '../services/locationService';
import Modal, { type ModalButton } from '../components/Modal';

const Transportations: React.FC = () => {
  const [transportations, setTransportations] = useState<Transportation[]>([]);
  const [locations, setLocations] = useState<Location[]>([]); // Dropdownlar için
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  
  const [filters, setFilters] = useState<TransportationFilter>({
    originLocationId: '',
    destinationLocationId: '',
    transportationType: '',
    operatingDays: ''
  });
  
  const [isAddRowPinned, setIsAddRowPinned] = useState<boolean>(false);
  const [isAddRowHovered, setIsAddRowHovered] = useState<boolean>(false);
  const [newTransportation, setNewTransportation] = useState<{
    originLocationId: string;
    destinationLocationId: string;
    transportationType: string;
    operatingDays: string[];
  }>({
    originLocationId: '',
    destinationLocationId: '',
    transportationType: '',
    operatingDays: []
  });
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{
    originLocationId: string;
    destinationLocationId: string;
    transportationType: string;
    operatingDays: string[];
  }>({
    originLocationId: '',
    destinationLocationId: '',
    transportationType: '',
    operatingDays: []
  });

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

  const fetchAllLocations = async () => {
    try {
      const response = await getLocations(1, 1000, {});
      if (response && response.data && Array.isArray(response.data.content)) {
        setLocations(response.data.content);
      }
    } catch (error) {
      console.error("Failed to fetch locations list", error);
    }
  };

  const fetchTransportations = async (currentFilters = filters) => {
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(currentFilters).filter(([_, v]) => v !== '' && v !== undefined)
      );
      
      const response = await getTransportations(page, pageSize, activeFilters);
      if (response && response.data && Array.isArray(response.data.content)) {
        setTransportations(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        setTransportations([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Failed to fetch transportations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLocations();
  }, []);

  useEffect(() => {
    fetchTransportations();
  }, [page, pageSize]);

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const handleDelete = (id: number) => {
    setModalConfig({
      isOpen: true,
      title: 'Delete Transportation',
      message: 'Are you sure you want to delete this transportation? This action cannot be undone.',
      type: 'warning',
      buttons: [
        { label: 'Cancel', onClick: closeModal, style: { backgroundColor: '#6c757d' } },
        { label: 'Delete', onClick: async () => {
            await deleteTransportation(id);
            fetchTransportations();
            closeModal();
          }, className: 'btn-delete', style: { backgroundColor: '#dc3545' } }
      ]
    });
  };

  const handleEdit = (transportation: Transportation) => {
    setEditingId(transportation.id);
    setEditData({
      originLocationId: transportation.originLocation.id.toString(),
      destinationLocationId: transportation.destinationLocation.id.toString(),
      transportationType: transportation.transportationType,
      operatingDays: transportation.operatingDays
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({ originLocationId: '', destinationLocationId: '', transportationType: '', operatingDays: [] });
  };

  const handleSaveEdit = async (id: number) => {
    if (!editData.originLocationId || !editData.destinationLocationId || !editData.transportationType || editData.operatingDays.length === 0) {
      setModalConfig({ isOpen: true, title: 'Validation Error', message: 'All fields are required.', type: 'error' });
      return;
    }

    try {
      const requestData: TransportationRequest = {
        originLocationId: Number(editData.originLocationId),
        destinationLocationId: Number(editData.destinationLocationId),
        transportationType: editData.transportationType as TransportationType,
        operatingDays: editData.operatingDays as OperatingDay[]
      };
      await updateTransportation(id, requestData);
      setEditingId(null);
      fetchTransportations();
    } catch (error) {
      console.error("Failed to update transportation", error);
      setModalConfig({ isOpen: true, title: 'Error', message: 'Failed to update transportation.', type: 'error' });
    }
  };

  const handleNewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'operatingDays') {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setNewTransportation(prev => ({ ...prev, operatingDays: selectedOptions }));
    } else {
      setNewTransportation(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'operatingDays') {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setEditData(prev => ({ ...prev, operatingDays: selectedOptions }));
    } else {
      setEditData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveNew = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!newTransportation.originLocationId || !newTransportation.destinationLocationId || !newTransportation.transportationType || newTransportation.operatingDays.length === 0) {
      setModalConfig({ isOpen: true, title: 'Validation Error', message: 'All fields are required.', type: 'error' });
      return;
    }

    try {
      const requestData: TransportationRequest = {
        originLocationId: Number(newTransportation.originLocationId),
        destinationLocationId: Number(newTransportation.destinationLocationId),
        transportationType: newTransportation.transportationType as TransportationType,
        operatingDays: newTransportation.operatingDays as OperatingDay[]
      };
      await createTransportation(requestData);
      setNewTransportation({ originLocationId: '', destinationLocationId: '', transportationType: '', operatingDays: [] });
      setIsAddRowPinned(false);
      fetchTransportations();
    } catch (error) {
      console.error("Failed to create transportation", error);
      setModalConfig({ isOpen: true, title: 'Error', message: 'Failed to create transportation.', type: 'error' });
    }
  };

  const handleCancelNew = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddRowPinned(false);
    setNewTransportation({ originLocationId: '', destinationLocationId: '', transportationType: '', operatingDays: [] });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const handleSearch = () => {
    if (page === 1) {
      fetchTransportations();
    } else {
      setPage(1);
    }
  };

  const handleClearFilter = (name: keyof TransportationFilter) => {
    const newFilters = { ...filters, [name]: '' };
    setFilters(newFilters);
    if (page === 1) {
      fetchTransportations(newFilters);
    } else {
      setPage(1);
    }
  };

  const renderFilterSelect = (name: keyof TransportationFilter, placeholder: string, options: { value: string, label: string }[]) => (
    <div className="search-input-wrapper">
      <select
        name={name}
        value={filters[name] || ''}
        onChange={handleFilterChange}
        className="search-input"
        style={{ width: '100%' }}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {filters[name] && (
        <button 
          className="search-input-clear-btn" 
          onClick={() => handleClearFilter(name)}
          title="Clear"
          style={{ right: '25px' }}
        >
          &times;
        </button>
      )}
    </div>
  );

  const isAddActive = isAddRowPinned || isAddRowHovered;

  const locationOptions = locations.map(loc => ({ value: loc.id.toString(), label: `${loc.name} (${loc.locationCode})` }));
  const typeOptions = TRANSPORTATION_TYPES.map(t => ({ value: t, label: t }));
  const dayOptions = OPERATING_DAYS.map(d => ({ value: d, label: d }));

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Transportations</h2>
      </div>
      
      <div className="search-container">
        {renderFilterSelect('originLocationId', 'Filter Origin', locationOptions)}
        {renderFilterSelect('destinationLocationId', 'Filter Destination', locationOptions)}
        {renderFilterSelect('transportationType', 'Filter Type', typeOptions)}
        {renderFilterSelect('operatingDays', 'Filter Day', dayOptions)}
        <button onClick={handleSearch} className="btn-action btn-edit">Search</button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Origin</th>
              <th>Destination</th>
              <th>Type</th>
              <th>Operating Days</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Add Row */}
            <tr 
              onMouseEnter={() => setIsAddRowHovered(true)}
              onMouseLeave={() => setIsAddRowHovered(false)}
              onClick={() => !isAddRowPinned && setIsAddRowPinned(true)}
              style={{ cursor: isAddRowPinned ? 'default' : 'pointer', backgroundColor: isAddActive ? 'rgba(255,255,255,0.05)' : 'transparent' }}
            >
              {isAddActive ? (
                <>
                  <td>
                    <select name="originLocationId" value={newTransportation.originLocationId} onChange={handleNewChange} className="search-input" style={{width: '100%'}} autoFocus>
                      <option value="">Select Origin</option>
                      {locationOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </td>
                  <td>
                    <select name="destinationLocationId" value={newTransportation.destinationLocationId} onChange={handleNewChange} className="search-input" style={{width: '100%'}}>
                      <option value="">Select Destination</option>
                      {locationOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </td>
                  <td>
                    <select name="transportationType" value={newTransportation.transportationType} onChange={handleNewChange} className="search-input" style={{width: '100%'}}>
                      <option value="">Select Type</option>
                      {typeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </td>
                  <td>
                    <select name="operatingDays" value={newTransportation.operatingDays} onChange={handleNewChange} className="search-input" style={{width: '100%', height: '60px', backgroundColor: 'transparent'}} multiple>
                      {dayOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <div style={{fontSize: '0.7rem', color: '#aaa'}}>Hold Ctrl to select multiple</div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                    <button onClick={handleSaveNew} className="btn-action" style={{ backgroundColor: '#28a745', marginRight: '5px' }}>Save</button>
                    <button onClick={handleCancelNew} className="btn-action" style={{ backgroundColor: '#dc3545' }}>Cancel</button>
                  </td>
                </>
              ) : (
                <td colSpan={5} style={{ textAlign: 'center', color: '#aaa', fontStyle: 'italic', padding: '15px' }}>
                  + Click to add new transportation
                </td>
              )}
            </tr>

            {/* Data Rows */}
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`skeleton-${index}`}>
                  <td><div className="skeleton-box" style={{ width: '80%' }}></div></td>
                  <td><div className="skeleton-box" style={{ width: '80%' }}></div></td>
                  <td><div className="skeleton-box" style={{ width: '60%' }}></div></td>
                  <td><div className="skeleton-box" style={{ width: '90%' }}></div></td>
                  <td><div className="skeleton-box" style={{ width: '100px' }}></div></td>
                </tr>
              ))
            ) : (
              transportations.map((item) => (
                <tr key={item.id}>
                  <td>
                    {`${item.originLocation.name} (${item.originLocation.locationCode})`}
                  </td>
                  <td>
                    {`${item.destinationLocation.name} (${item.destinationLocation.locationCode})`}
                  </td>
                  <td>
                    {item.transportationType}
                  </td>
                  <td>
                    {editingId === item.id ? (
                      <>
                        <select name="operatingDays" value={editData.operatingDays} onChange={handleEditChange} className="search-input" style={{width: '100%', height: '60px'}} multiple>
                          {dayOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                        <div style={{fontSize: '0.7rem', color: '#aaa'}}>Hold Ctrl to select multiple</div>
                      </>
                    ) : (
                      item.operatingDays.join(', ')
                    )}
                  </td>
                  <td style={{ verticalAlign: editingId === item.id ? 'top' : 'middle' }}>
                    {editingId === item.id ? (
                      <>
                        <button onClick={() => handleSaveEdit(item.id)} className="btn-action" style={{ backgroundColor: '#28a745', marginRight: '5px' }}>Save</button>
                        <button onClick={handleCancelEdit} className="btn-action" style={{ backgroundColor: '#dc3545' }}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(item)} className="btn-action btn-edit">Edit</button>
                        <button onClick={() => handleDelete(item.id)} className="btn-action btn-delete">Delete</button>
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

export default Transportations;
