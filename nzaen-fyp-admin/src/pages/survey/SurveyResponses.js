import React from 'react';
import { useEffect, useState } from 'react';
import Avatar from '../../components/Avatar';
import { Quiz } from 'react-quizzes';

import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import { Link } from 'react-router-dom';
import './SurveyResponses.css';

export default function SurveyResponses({ survey }) {
    const [assignedUsersWithSurveyAnswers, setAssignedUsersWithSurveyAnswers] = useState([]);

    useEffect(() => {
        if (survey) {
            const assignedUsersList = survey.assignedUsersList || [];
            const usersWithSurveyAnswers = assignedUsersList.filter(user => user.surveyAnswers);
            setAssignedUsersWithSurveyAnswers(usersWithSurveyAnswers);
        }
    }, [survey]);

    const getElementFieldValue = (fieldName) => {
        const matchingElement = survey.formdata.find(element => element.id === fieldName);
        return matchingElement ? matchingElement.element : '';
    };

    const getElementFieldQuestionEn = (fieldName) => {
        const matchingElement = survey.formdata.find((element) => element.id === fieldName);
        const questionEn = matchingElement && matchingElement.questions ? matchingElement.questions['en'] : '';
        return questionEn ? questionEn.replace(/<\/?p>/g, '') : '';
    };

    return (
        <div className="survey-responses">
            {assignedUsersWithSurveyAnswers.length === 0 && <p>No assigned users with survey answers yet!</p>}
            {assignedUsersWithSurveyAnswers.map(user => (
                <div className='response' key={user.id}>
                    <h3>{user.displayName}</h3>
                    <Avatar src={user.photoURL} />
                    <div>
                        {Object.entries(user.surveyAnswers).map(([fieldName, fieldValue]) => (
                            <div key={fieldName}>
                                <h3>{getElementFieldQuestionEn(fieldName)} <span className='type'>{getElementFieldValue(fieldName)}</span></h3>
                                <p>Answer : {fieldValue.toString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
