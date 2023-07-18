import React from 'react';
import { useState } from 'react';
import moment from 'moment';


import { useAuthContext } from '../../hooks/useAuthContext';
import { useHistory } from 'react-router';
import { useFirestore } from '../../hooks/useFirestore';
import { projectFirestore } from '../../firebase/config';
import { Quiz } from 'react-quizzes';
import './SurveySummary.css';

export default function SurveySummary({ survey }) {
    const [answerData, setAnswerData] = useState([]);
    const history = useHistory();
    const { user } = useAuthContext();
    const { updateDocument, response } = useFirestore('surveys');
    const [error, setError] = useState('');

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

    const handleSubmit = async (values) => {
        // Check for null or undefined values in surveyAnswers
        if (Object.values(values).some((value) => value === null || value === undefined)) {
            setError('Please answer all the questions before submitting.');
            return;
        }

        const documentRef = projectFirestore.collection('surveys').doc(survey.id);

        // Get the current assignedUsersList array
        const documentSnapshot = await documentRef.get();
        const assignedUsersList = documentSnapshot.get('assignedUsersList');

        // Find the element with the specified ID and add the "surveyAnswers" and "answered" fields
        const updatedAssignedUsersList = assignedUsersList.map((item) => {
            if (item.id === user.uid) {
                const updatedSurveyAnswers = { ...item.surveyAnswers };
                Object.keys(values).forEach((key) => {
                    const value = values[key];
                    if (moment.isMoment(value)) {
                        updatedSurveyAnswers[key] = value.format(); // Convert Moment to string
                    } else {
                        updatedSurveyAnswers[key] = value;
                    }
                });
                return { ...item, surveyAnswers: updatedSurveyAnswers, answered: true };
            }
            return item;
        });


        // Update the "assignedUsersList" field with the updated array
        await documentRef.update({ assignedUsersList: updatedAssignedUsersList });

        if (!response.error) {
            history.push('/');
        }
    };
    const currentDate = new Date();
    const dueDate = survey.dueDate.toDate();

    return (
        <div>
            <p className="due-date">Survey due by {dueDate.toDateString()}</p>
            <p className="due-date">
                Creator : {survey.createdBy.displayName}
            </p>
            <p className="due-date">
                Survey ID : {survey.id}
            </p>
            <br></br>
            <div>
                <p>Media</p>
                <div className="survey-details">{renderMediaPreview(survey)}</div>
                <div className="survey-details">
                    {dueDate < currentDate ? (
                        <Quiz data={survey.formdata} submitButton={false} />
                    ) : (
                        <Quiz
                            data={survey.formdata}
                            onChange={setAnswerData}
                            onSubmit={handleSubmit}
                        />
                    )}
                </div>
            </div>
            {error && <p className="error">{error}</p>}
        </div>
    );
}
