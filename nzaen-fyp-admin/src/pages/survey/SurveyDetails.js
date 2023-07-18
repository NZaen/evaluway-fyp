import React from 'react';
import Avatar from '../../components/Avatar';
import { Quiz } from 'react-quizzes';
import './SurveyDetails.css';
import { useCollection } from '../../hooks/useCollection';

export default function SurveyDetails({ survey }) {
    const { documents: users } = useCollection('users');

    if (!users) {
        // Handle the case when the users data is still loading
        return <p>Loading users...</p>;
    }

    const assignedUsers = survey.assignedUsersList.map((assignedUser) => {
        const user = users.find((user) => user.id === assignedUser.id);
        const occupation = user ? user.occupation : undefined;
        const age = user ? user.age : undefined;
        const location = user ? user.location : undefined; // Add location
        return {
            ...assignedUser,
            occupation,
            age,
            location, // Include location in the object
        };
    });



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



    return (
        <div>
            <h2 className="page-title">{survey.name}</h2>

            <h3 className="due-date">
                Survey due by  {survey.dueDate.toDate().toDateString()}
            </h3>
            <p>
                Creator : {survey.createdBy.displayName}
            </p>
            <p>
                Survey ID : {survey.id}
            </p>
            <br></br>


            <div className="survey-details">
                <div className="media-preview">
                    <h3>Media</h3>
                    <br></br>
                    <div>{renderMediaPreview(survey)}</div>
                    <div className='assigned-to'>
                        <h3>Assigned Users</h3>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Display Name</th>
                                        <th>Occupation</th>
                                        <th>Age</th>
                                        <th>Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignedUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.displayName}</td>
                                            <td>{user.occupation}</td>
                                            <td>{user.age}</td>
                                            <td>{user.location}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>


                <div className="quiz-container">
                    <h3>Questions</h3>
                    <div className="survey-details-quiz">
                        <Quiz data={survey.formdata} submitButton={false} />

                    </div>
                </div>
            </div>








        </div>
    );
}
