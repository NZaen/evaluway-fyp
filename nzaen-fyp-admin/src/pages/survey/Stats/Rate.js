import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useEffect, useState } from 'react';
import { useCollection } from '../../../hooks/useCollection';


export default function Rate({ survey }) {



    const getElementFieldValue = (fieldName) => {
        const matchingElement = survey.formdata.find((element) => element.id === fieldName);
        return matchingElement ? matchingElement.element : '';
    };

    const getElementFieldQuestionEn = (fieldName) => {
        const matchingElement = survey.formdata.find((element) => element.id === fieldName);
        const questionEn = matchingElement && matchingElement.questions ? matchingElement.questions['en'] : '';
        return questionEn ? questionEn.replace(/<\/?p>/g, '') : '';
    };



    const ratingOptions = survey.formdata
        .filter((element) => getElementFieldValue(element.id) === 'Rate')
        .map((element) => element.id);



    if (ratingOptions.length === 0) {
        return null; // Render nothing if there are no rating options
    }


    const COLORS = ['#8884d8', '#CCCCCC'];

    return (
        <div>
            {ratingOptions.map((option) => {
                const data = survey.assignedUsersList.reduce((acc, user) => {
                    let rating = 0;
                    if (user.surveyAnswers && user.surveyAnswers[option]) {
                        rating = user.surveyAnswers[option];
                    }
                    if (rating > 0) {
                        const existingRating = acc.find((entry) => entry.rating === rating);
                        if (existingRating) {
                            existingRating.count += 1;
                        } else {
                            acc.push({ rating, count: 1 });
                        }
                    }
                    return acc;
                }, []);

                const ratingFrequencyData = data.map((entry) => ({ rating: entry.rating, count: entry.count }));

                if (data.length === 0) {
                    return null; // Render nothing if there are no ratings for this option
                }





                return (

                    <div key={`chart-${option}`} className='statSec'>
                        <h2>{String(getElementFieldQuestionEn(option))}<span className='type'>Rate</span></h2>



                        <PieChart width={600} height={300}>
                            <Pie
                                data={data}
                                dataKey="count"
                                nameKey="rating"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                    const RADIAN = Math.PI / 180;
                                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                    return (
                                        <text
                                            x={x}
                                            y={y}
                                            fill="#ffffff"
                                            textAnchor={x > cx ? 'start' : 'end'}
                                            dominantBaseline="central"
                                        >
                                            {`${(percent * 100).toFixed(0)}%`}
                                        </text>
                                    );
                                }}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>


                        <BarChart width={600} height={300} data={ratingFrequencyData}>
                            <XAxis dataKey="rating" label={{ value: 'Ratings', position: 'insideBottom', offset: -10 }} />
                            <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
                            <Bar dataKey="count" fill="#8884d8" />
                            <Tooltip />

                        </BarChart>

                    </div>
                );

            })}
        </div>
    );
}
