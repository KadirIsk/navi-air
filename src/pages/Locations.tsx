import React, { useEffect, useState } from 'react';
import { getLocations, deleteLocation, type Location } from '../services/locationService';

const Locations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  
  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await getLocations(page, 10);
      setLocations(response.data);
    } catch (error) {
      console.error("Failed to fetch locations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [page]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      await deleteLocation(id);
      // Gerçek senaryoda silme sonrası listeyi yenileriz:
      fetchLocations();
      alert('Deleted (Mock)');
    }
  };

  const handleEdit = (id: number) => {
    console.log('Edit location', id);
    // İleride edit sayfasına yönlendirme yapılacak
  };

  return (
    <div className="page-container">
      <h2>Locations</h2>
      <div className="table-container">
        {loading ? (
          <p>Loading...</p>
        ) : (
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
              {locations.map((loc) => (
                <tr key={loc.id}>
                  <td>{loc.name}</td>
                  <td>{loc.country}</td>
                  <td>{loc.city}</td>
                  <td>{loc.locationCode}</td>
                  <td>
                    <button onClick={() => handleEdit(loc.id)} className="btn-action btn-edit">Edit</button>
                    <button onClick={() => handleDelete(loc.id)} className="btn-action btn-delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
};

export default Locations;
