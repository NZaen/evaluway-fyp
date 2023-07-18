import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import Masonry from "react-responsive-masonry"

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
        <Masonry columnsCount={3} gutter="20px" className="survey-list">
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
                            <div className="assigned-to">
                                <p>
                                    <strong>Assigned to:</strong>
                                </p>
                                <ul>
                                    {survey.assignedUsersList.slice(0, 3).map((user) => (
                                        <li key={user.id}>
                                            <div className="avatar-wrapper" title={user.displayName}>
                                                <img src={user.photoURL} alt="user avatar" />
                                            </div>
                                        </li>
                                    ))}
                                    {survey.assignedUsersList.length > 3 && (
                                        <li className="more-avatars">+{survey.assignedUsersList.length - 3}</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="survey-status">
                            <span className="open">Open</span>
                            <div className="assigned-to">
                                <p>
                                    <strong>Assigned to:</strong>
                                </p>
                                <ul>
                                    {survey.assignedUsersList.slice(0, 3).map((user) => (
                                        <li key={user.id}>
                                            <div className="avatar-wrapper" title={user.displayName}>
                                                <img src={user.photoURL} alt="user avatar" />
                                            </div>
                                        </li>
                                    ))}
                                    {survey.assignedUsersList.length > 3 && (
                                        <li className="more-avatars">+{survey.assignedUsersList.length - 3}</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}
                </Link>
            ))}
        </Masonry>
    );
}
