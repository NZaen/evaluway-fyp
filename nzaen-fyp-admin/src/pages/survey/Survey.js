import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';
import { css } from '@emotion/react';
import { BeatLoader } from 'react-spinners';

// styles
import './Survey.css';
import SurveyDetails from './SurveyDetails';
import SurveyResponses from './SurveyResponses';
import SurveyStats from './SurveyStats';


export default function Survey() {

    const { id } = useParams();
    const { document, error } = useDocument('surveys', id);

    const isSurveyClosed = (dueDate) => {
        const currentDate = new Date();
        return dueDate.toDate() < currentDate;
    };

    const [isLoading, setIsLoading] = useState(true);

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

    if (error) {
        return <div className="error">{error}</div>;
    }
    if (!document) {
        return (
            <div className="loading-animation">
                <BeatLoader color="#8d69f1" loading={isLoading} css={override} size={15} />
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div>
            {isSurveyClosed(document.dueDate) ? (
                <div>
                    <h2 className="page-title">{document.description}</h2>
                    <span className="closedCopy">Closed</span>
                </div>
            ) : (
                <div>
                    <h2 className="page-title">{document.description}</h2>
                    <span className="openCopy">Open</span>
                </div>
            )}

            <SurveyDetails survey={document} />

            <h2 className="page-title">Responses</h2>
            <SurveyResponses survey={document} />

            <h2 className="page-title">Statistics and Analysis</h2>
            <SurveyStats survey={document} />
        </div>
    );
}
