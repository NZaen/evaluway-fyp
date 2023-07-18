import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useCollection } from '../../hooks/useCollection';
import './UserManage.css';
import jobOptions from '../../components/jobOptions';
import { useAddUser } from '../../hooks/useAddUser';
import { projectAuth, projectFirestore } from '../../firebase/config';
import countryOptions from '../../components/countryOptions';

const UserManage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [occupationFilter, setOccupationFilter] = useState(null);
    const [locationFilter, setLocationFilter] = useState(null);
    const [minAgeFilter, setMinAgeFilter] = useState(null);
    const [maxAgeFilter, setMaxAgeFilter] = useState(null);
    const [occupations, setOccupations] = useState([]);
    const [locations, setLocations] = useState([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');

    const [age, setAge] = useState('');
    const [occupation, setOccupation] = useState('');
    const [location, setLocation] = useState('');

    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailError, setThumbnailError] = useState(null);
    const { addUser, isPendingSignup, errorSignup } = useAddUser();

    const handleSubmit = (e) => {
        e.preventDefault();
        addUser(email, password, displayName, location, age, occupation, thumbnail);
    };

    const handleFileChange = (e) => {
        setThumbnail(null);
        let selected = e.target.files[0];
        console.log(selected);

        if (!selected) {
            setThumbnailError('Please select a file');
            return;
        }
        if (!selected.type.includes('image')) {
            setThumbnailError('Selected file must be an image');
            return;
        }

        setThumbnailError(null);
        setThumbnail(selected);
        console.log('thumbnail updated');
    };

    const { documents: users, error, isPending } = useCollection('users');

    useEffect(() => {
        if (users) {
            const uniqueOccupations = [...new Set(users.map((user) => user.occupation))];
            const occupationOptions = [
                { value: '', label: 'All Occupations' },
                ...uniqueOccupations.map((occupation) => ({
                    value: occupation,
                    label: occupation,
                })),
            ];
            setOccupations(occupationOptions);
        }
    }, [users]);

    useEffect(() => {
        if (users) {
            const uniqueLocations = [...new Set(users.map((user) => user.location))];
            const locationOptions = [
                { value: '', label: 'All Locations' },
                ...uniqueLocations.map((location) => ({
                    value: location,
                    label: location,
                })),
            ];
            setLocations(locationOptions);
        }
    }, [users]);

    const filteredUsers = users && users.filter((user) => {
        let match = true;

        // Apply search query filter
        if (searchQuery) {
            match = user.displayName.toLowerCase().includes(searchQuery.toLowerCase());
        }

        // Apply occupation filter
        if (occupationFilter && occupationFilter.value !== '') {
            const selectedOccupation = occupationFilter.value;
            match = match && user.occupation === selectedOccupation;
        }

        // Apply location filter
        if (locationFilter && locationFilter.value !== '') {
            const selectedLocation = locationFilter.value;
            match = match && user.location === selectedLocation;
        }

        // Apply age filter
        if (minAgeFilter && minAgeFilter.value !== '') {
            const minAge = parseInt(minAgeFilter.value);
            const userAge = parseInt(user.age);
            match = match && userAge >= minAge;
        }

        if (maxAgeFilter && maxAgeFilter.value !== '') {
            const maxAge = parseInt(maxAgeFilter.value);
            const userAge = parseInt(user.age);
            match = match && userAge <= maxAge;
        }

        return match;
    });

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleOccupationChange = (selectedOption) => {
        setOccupationFilter(selectedOption);
    };

    const handleLocationChange = (selectedOption) => {
        setLocationFilter(selectedOption);
    };

    const handleMinAgeChange = (selectedOption) => {
        setMinAgeFilter(selectedOption);
    };

    const handleMaxAgeChange = (selectedOption) => {
        setMaxAgeFilter(selectedOption);
    };

    const ages = [
        { value: '', label: 'All Ages' },
        ...Array.from({ length: 200 }, (_, index) => ({
            value: index + 1,
            label: (index + 1).toString(),
        })),
    ];

    return (
        <div className="manageForm">
            <h2 className="page-title">User Management</h2>

            <div className="filterContainer">
                <div className="filterItem">
                    <label>
                        <span>Search:</span>
                        <input type="text" value={searchQuery} onChange={handleSearchChange} />
                    </label>
                </div>

                <div className="filterItem">
                    <label>
                        <span>Occupation:</span>
                        <Select
                            value={occupationFilter}
                            onChange={handleOccupationChange}
                            options={occupations}
                        />
                    </label>
                </div>

                <div className="filterItem">
                    <label>
                        <span>Location:</span>
                        <Select
                            value={locationFilter}
                            onChange={handleLocationChange}
                            options={locations}
                        />
                    </label>
                </div>

                <div className="filterItem">
                    <label>
                        <span>Minimum Age:</span>
                        <Select
                            value={minAgeFilter}
                            onChange={handleMinAgeChange}
                            options={ages}
                        />
                    </label>
                </div>

                <div className="filterItem">
                    <label>
                        <span>Maximum Age:</span>
                        <Select
                            value={maxAgeFilter}
                            onChange={handleMaxAgeChange}
                            options={ages}
                        />
                    </label>
                </div>
            </div>

            <div className="section-title">
                <span>Filtered Users</span>
            </div>

            <div className="user-table-container">
                {filteredUsers && filteredUsers.length > 0 ? (
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Occupation</th>
                                <th>Age</th>
                                <th>Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.displayName}</td>
                                    <td>{user.occupation}</td>
                                    <td>{user.age}</td>
                                    <td>{user.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No users found.</p>
                )}
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Add New User</h2>
                <label>
                    <span>Email</span>
                    <input
                        required
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </label>
                <label>
                    <span>Password</span>
                    <input
                        required
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </label>
                <label>
                    <span>Display Name</span>
                    <input
                        required
                        type="text"
                        onChange={(e) => setDisplayName(e.target.value)}
                        value={displayName}
                    />
                </label>
                <label>
                    <span>Location</span>
                    <select
                        required
                        onChange={(e) => setLocation(e.target.value)}
                        value={location}
                    >
                        <option value="">Select location</option>
                        {countryOptions.map((country) => (
                            <option key={country} value={country}>
                                {country}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    <span>Age</span>
                    <select
                        required
                        onChange={(e) => setAge(e.target.value)}
                        value={age}
                    >
                        <option value="">Select age</option>
                        {Array.from({ length: 200 }, (_, index) => (
                            <option key={index} value={index + 1}>
                                {index + 1}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    <span>Occupation</span>
                    <select
                        required
                        onChange={(e) => setOccupation(e.target.value)}
                        value={occupation}
                    >
                        <option value="">Select occupation</option>
                        {jobOptions.map((job) => (
                            <option key={job} value={job}>
                                {job}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    <span>Profile Thumbnail:</span>
                    <input required type="file" onChange={handleFileChange} />
                    {thumbnailError && <div className="error">{thumbnailError}</div>}
                </label>
                {!isPending && <button className="btn">Submit</button>}
                {isPending && <button className="btn" disabled>loading</button>}
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    );
};

export default UserManage;
