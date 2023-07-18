import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Rate from './Rate';
import RadioButtons from './RadioButtons';
import { useCollection } from '../../../hooks/useCollection';
import './Default.css';

export default function Default({ survey }) {
    const assignedUsersCount = survey.assignedUsersList.length;
    let surveyAnsweredUsersCount = 0;
    const surveyAnsweredUsers = [];

    survey.assignedUsersList.forEach((user) => {
        if (user.surveyAnswers) {
            surveyAnsweredUsersCount++;
            surveyAnsweredUsers.push(user);
        }
    });

    const getDistribution = (data) => {
        const distribution = {};
        data.forEach((value) => {
            distribution[value] = (distribution[value] || 0) + 1;
        });
        return Object.keys(distribution).map((key) => ({
            name: key,
            value: distribution[key],
        }));
    };

    const surveyStatsData = [
        { name: 'Survey Answered', value: surveyAnsweredUsersCount },
        { name: 'Not Answered', value: assignedUsersCount - surveyAnsweredUsersCount },
    ];

    const COLORS = ['#8884d8', '#CCCCCC'];

    const [responderAges, setResponderAges] = useState([]);
    const [responderOccupations, setResponderOccupations] = useState([]);
    const [responderLocations, setResponderLocations] = useState([]); // Update: Added responderLocations

    const { documents: users, error, isPending } = useCollection('users');

    useEffect(() => {
        if (users && surveyAnsweredUsers.length > 0) {
            const ages = surveyAnsweredUsers.map((user) => {
                const matchingUser = users.find((u) => u.id === user.id);
                return matchingUser ? matchingUser.age : null;
            });
            setResponderAges(ages);

            const occupations = surveyAnsweredUsers.map((user) => {
                const matchingUser = users.find((u) => u.id === user.id);
                return matchingUser ? matchingUser.occupation : null;
            });
            const occupationDistribution = getDistribution(occupations);
            setResponderOccupations(occupationDistribution);

            const locations = surveyAnsweredUsers.map((user) => {
                const matchingUser = users.find((u) => u.id === user.id);
                return matchingUser ? matchingUser.location : null;
            });
            const locationDistribution = getDistribution(locations);
            setResponderLocations(locationDistribution);
        } else {
            setResponderAges([]);
            setResponderOccupations(null);
            setResponderLocations([]); // Update: Set responderLocations to empty array
        }
    }, [users, surveyAnsweredUsers]);

    const histogramData = responderAges.reduce((acc, age) => {
        if (age) {
            const ageRange = `${Math.floor(age / 10) * 10}-${Math.floor(age / 10) * 10 + 9}`;
            acc[ageRange] = (acc[ageRange] || 0) + 1;
        }
        return acc;
    }, {});

    const histogramChartData = Object.keys(histogramData).map((ageRange) => ({
        ageRange,
        frequency: histogramData[ageRange],
    }));

    const responderOccupationsData = responderOccupations || [{ name: 'No data', value: 0 }];
    const responderLocationsData = responderLocations || []; // Update: Set responderLocationsData to responderLocations

    return (
        <div className="statSec">
            <h2>Default</h2>
            <PieChart width={600} height={300}>
                <Pie
                    data={surveyStatsData}
                    dataKey="value"
                    nameKey="name"
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
                                fill="#ffffff" // Set the fill color to white
                                textAnchor={x > cx ? 'start' : 'end'}
                                dominantBaseline="central"
                            >
                                {`${(percent * 100).toFixed(0)}%`}
                            </text>
                        );
                    }}
                >
                    {surveyStatsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Legend />
                <Tooltip />
            </PieChart>

            {isPending && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}

            {surveyAnsweredUsersCount > 0 && (
                <BarChart width={600} height={300} data={histogramChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="ageRange"
                        label={{
                            value: 'Age',
                            position: 'insideBottom',
                            offset: -5, // Adjust the offset to bring the label closer
                        }}
                    />
                    <YAxis
                        label={{
                            value: 'Frequency',
                            angle: -90,
                            position: 'insideLeft',
                        }}
                    />
                    <Tooltip />
                    <Bar dataKey="frequency" fill="#8884d8" />
                </BarChart>
            )}

            {surveyAnsweredUsersCount > 0 && (
                <PieChart width={600} height={300}>
                    <Pie
                        data={responderOccupationsData}
                        dataKey="value"
                        nameKey="name"
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
                        {responderOccupationsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                </PieChart>
            )}

            {surveyAnsweredUsersCount > 0 && (
                <PieChart width={600} height={300}>
                    <Pie
                        data={responderLocationsData}
                        dataKey="value"
                        nameKey="name"
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
                        {responderLocationsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                </PieChart>
            )}
        </div>
    );
}
