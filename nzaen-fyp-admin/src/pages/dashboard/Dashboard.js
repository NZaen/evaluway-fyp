import { useCollection } from '../../hooks/useCollection';
import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { BeatLoader } from 'react-spinners';

// components
import SurveyList from '../../components/SurveyList';

// styles
import './Dashboard.css';

export default function Dashboard() {
    const { documents, error } = useCollection('surveys');
    const [filter, setFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    const handleFilterChange = (value) => {
        setFilter(value);
    };

    const filteredSurveys = () => {
        if (filter === 'open') {
            return documents.filter((survey) => !isSurveyClosed(survey.dueDate));
        } else if (filter === 'closed') {
            return documents.filter((survey) => isSurveyClosed(survey.dueDate));
        } else {
            return documents;
        }
    };

    const isSurveyClosed = (dueDate) => {
        const currentDate = new Date();
        return dueDate.toDate() < currentDate;
    };

    useEffect(() => {
        // Simulating an asynchronous API call
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);

    const override = css`
        display: block;
        margin: 0 auto;
        border-color: red;
    `;

    return (
        <div>
            <h2 className="page-title">Dashboard</h2>
            <div className="filter-buttons">
                <button
                    className={`filter-button ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('all')}
                >
                    All
                </button>
                <button
                    className={`filter-button ${filter === 'open' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('open')}
                >
                    Open
                </button>
                <button
                    className={`filter-button ${filter === 'closed' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('closed')}
                >
                    Closed
                </button>
            </div>
            {error && <p className="error">{error}</p>}
            {isLoading ? (
                <div className="loading-animation">
                    <BeatLoader color="#8d69f1" loading={isLoading} css={override} size={15} />
                    <p>Loading...</p>
                </div>
            ) : (
                documents && <SurveyList surveys={filteredSurveys()} />
            )}
        </div>
    );
}
