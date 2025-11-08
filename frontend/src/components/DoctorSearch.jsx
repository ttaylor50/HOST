import React, { useState } from 'react';
import './DoctorSearch.css';

const DoctorSearch = () => {
    const [searchParams, setSearchParams] = useState({
        location: '',
        specialty: '',
        name: ''
    });
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const queryParams = new URLSearchParams({
                ...Object.fromEntries(
                    Object.entries(searchParams).filter(([_, v]) => v !== '')
                )
            });

            const response = await fetch(`/api/doctors/search?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch doctors');
            }

            const data = await response.json();
            setDoctors(data);
        } catch (err) {
            setError('Error searching for doctors. Please try again.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="doctor-search">
            <h2>Find a Doctor</h2>
            <form onSubmit={handleSearch} className="search-form">
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Location"
                        value={searchParams.location}
                        onChange={(e) => setSearchParams({
                            ...searchParams,
                            location: e.target.value
                        })}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Specialty"
                        value={searchParams.specialty}
                        onChange={(e) => setSearchParams({
                            ...searchParams,
                            specialty: e.target.value
                        })}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Doctor Name"
                        value={searchParams.name}
                        onChange={(e) => setSearchParams({
                            ...searchParams,
                            name: e.target.value
                        })}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && <div className="error-message">{error}</div>}

            <div className="doctors-list">
                {doctors.map((doctor, index) => (
                    <div key={index} className="doctor-card">
                        <h3>{doctor.name}</h3>
                        <p><strong>Specialty:</strong> {doctor.specialty}</p>
                        <p><strong>Location:</strong> {doctor.location}</p>
                        <p><strong>Contact:</strong> {doctor.contact}</p>
                        {doctor.rating && (
                            <p><strong>Rating:</strong> {doctor.rating} ⭐</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoctorSearch;