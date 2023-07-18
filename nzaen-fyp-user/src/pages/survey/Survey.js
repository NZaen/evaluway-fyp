import React from 'react'
import { useParams } from "react-router-dom"
import { useDocument } from '../../hooks/useDocument'

// styles
import './Survey.css'
import SurveySummary from "./SurveySummary"

export default function Survey() {
    const { id } = useParams()
    const { document, error } = useDocument('surveys', id)

    if (error) {
        return <div className="error">{error}</div>
    }
    if (!document) {
        return <div className="loading">Loading...</div>
    }

    return (
        <div>
            <h2 className="page-title">{document.description} </h2>
            <div className="survey-summary">
                <SurveySummary survey={document} />
            </div>
        </div>
    )
}