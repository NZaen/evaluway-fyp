import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Default from './Stats/Default';
import Rate from './Stats/Rate';
import Select from './Stats/Select';
import RadioButtons from './Stats/RadioButtons';
import Tags from './Stats/Tags';
import Checkboxes from './Stats/Checkboxes';
import { useCollection } from '../../hooks/useCollection';


export default function SurveyStats({ survey }) {


    return (<div>

        <Default survey={survey} />
        <Rate survey={survey} />
        <RadioButtons survey={survey} />
        <Select survey={survey} />
        <Checkboxes survey={survey} />
        <Tags survey={survey} />

    </div>
    );
}
