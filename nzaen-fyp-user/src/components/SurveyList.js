import React from 'react';
import { Link } from 'react-router-dom';

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import './SurveyList.css';

export default function SurveyList({ surveys }) {
    const renderMediaPreview = (survey) => {
        const urlParts = survey.photoURL.split('?');
        const fileUrl = urlParts[0];
        const fileExtension = fileUrl.split('.').pop().toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
            return <img src={survey.photoURL} alt="Image Preview" />;
        } else if (['mp4', 'webm', 'ogg'].includes(fileExtension)) {
            return <video src={survey.photoURL} controls />;
        } else if (['mp3', 'wav', 'ogg'].includes(fileExtension)) {
            return <audio src={survey.photoURL} controls />;
        }
    };

    const isSurveyClosed = (dueDate) => {
        const currentDate = new Date();
        return dueDate.toDate() < currentDate;
    };

    return (
        <div>
            <ResponsiveMasonry
                columnsCountBreakPoints={{ 1000: 1, 1100: 2 }}
            >
                <Masonry gutter="20px" className="survey-list">
                    {surveys.length === 0 && <p>No projects yet!</p>}
                    {surveys.map((survey) => (
                        <Link to={`/surveys/${survey.id}`} key={survey.id}>
                            <div className="survey-main">
                                <p>{renderMediaPreview(survey)}</p>
                                <br />
                                <p>{survey.description}</p>
                            </div>

                            <p>Due by {survey.dueDate.toDate().toDateString()}</p>
                            {isSurveyClosed(survey.dueDate) ? (
                                <div className="survey-status">
                                    <span className="closed">Closed</span>

                                </div>
                            ) : (
                                <div className="survey-status">
                                    <span className="open">Open</span>

                                </div>
                            )}
                        </Link>
                    ))}
                </Masonry>
            </ResponsiveMasonry>
        </div>
    );
}
