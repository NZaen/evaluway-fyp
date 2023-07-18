import React from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useCollection } from '../../hooks/useCollection'

import usermanage1 from '../../assets/usermanage1.png'
// components
import SurveyList from '../../components/SurveyList'
import './SurveyHistory.css'

export default function SurveyHistory() {
    const { documents, error } = useCollection('surveys');
    const { user } = useAuthContext();

    const projects = documents
        ? documents.filter((document) => {
            const assignedUser = document.assignedUsersList.find(
                (u) => u.id === user.uid && u.surveyAnswers
            );
            return assignedUser !== undefined;
        })
        : null;

    return (
        <div>
            <h2 className="page-title">Completed Surveys</h2>
            {error && <p className="error">{error}</p>}
            {projects && <SurveyList surveys={projects} />}
        </div>
    );
}
