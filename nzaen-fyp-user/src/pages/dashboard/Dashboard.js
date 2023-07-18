import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext'
import React, { useState } from 'react';

// components
import SurveyList from '../../components/SurveyList';

// styles
import './Dashboard.css';

export default function Dashboard() {
  const { documents, error } = useCollection('surveys');
  const { user } = useAuthContext()
  const [filter, setFilter] = useState('open');

  const projects = documents ? documents.filter(document => {
    let assignedToMe = false
    document.assignedUsersList.forEach(u => {
      if (u.id === user.uid && !u.surveyAnswers) {
        assignedToMe = true;
      }
    })
    return assignedToMe
  }) : null

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  const filteredSurveys = () => {
    if (filter === 'open') {
      return projects.filter((survey) => !isSurveyClosed(survey.dueDate));
    } else if (filter === 'closed') {
      return projects.filter((survey) => isSurveyClosed(survey.dueDate));
    } else {
      return projects;
    }
  };

  const isSurveyClosed = (dueDate) => {
    const currentDate = new Date();
    return dueDate.toDate() < currentDate;
  };



  return (
    <div>
      <h2 className="page-title">Assigned Surveys</h2>
      <div className="filter-buttons">

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
      {documents && <SurveyList surveys={filteredSurveys()} />}
    </div>
  );
}
