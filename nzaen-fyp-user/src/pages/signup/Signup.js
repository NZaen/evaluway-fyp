import { useState } from 'react';
import { useSignup } from '../../hooks/useSignup';
import React from 'react';
// styles
import './Signup.css';
import jobOptions from '../../components/jobOptions';
import countryOptions from '../../components/countryOptions';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [location, setLocation] = useState('');
    const [age, setAge] = useState('');
    const [occupation, setOccupation] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailError, setThumbnailError] = useState(null);
    const { signup, isPending, error } = useSignup();



    const handleSubmit = (e) => {
        e.preventDefault();
        signup(email, password, displayName, location, age, occupation, thumbnail);
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

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <h2>Sign up</h2>
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
            {!isPending && <button className="btn">Sign up</button>}
            {isPending && <button className="btn" disabled>Loading</button>}
            {error && <div className="error">{error}</div>}
        </form>
    );

}