import React from 'react'
import { useState, useEffect } from 'react'

import { timestamp } from '../../firebase/config'
import { useFirestore } from '../../hooks/useFirestore'
import { useHistory } from 'react-router'
import { useDocument } from '../../hooks/useDocument'
import { projectAuth, projectStorage, projectFirestore } from '../../firebase/config'
import { Quiz } from "react-quizzes";
import { useAuthContext } from '../../hooks/useAuthContext'
import { useCollection } from '../../hooks/useCollection'

import usermanage1 from '../../assets/usermanage1.png'
// components
import SurveyList from '../../components/SurveyList'
import './Feedback.css'

export default function Feedback() {

    const { user } = useAuthContext()
    const { addDocument, response } = useFirestore('feedbacks')


    const [isLoading, setIsLoading] = useState(false); // New state variable
    const [desc, setDesc] = useState([])
    const createdBy = {
        displayName: user.displayName,
        photoURL: user.photoURL,
        id: user.uid
    }
    const history = useHistory()


    const feedback = {
        feedback: desc,
        createdBy
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        await addDocument(feedback)

        if (!response.error) {
            history.push('/surveyhistory')
        }

        setIsLoading(true); // Start loading

    }

    return (
        <div>
            <h2 className="page-title">Feedback Form</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Leave Feedback</span>
                    <input
                        required
                        type="text"
                        onChange={(e) => setDesc(e.target.value)}
                        value={desc}
                    />
                </label>


                <button disabled={isLoading}>{isLoading ? 'Creating...' : 'Submit'}</button>



            </form>

        </div>

    );
}
