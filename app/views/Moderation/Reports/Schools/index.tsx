import React from 'react';
import { Container, SelectInput, InformationCard } from '@the-deep/deep-ui';
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Label,
} from 'recharts';
import styles from './styles.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Dummy data for Schools Bar chart
const district = [
    {
        district: 'Kathmandu',
        numberOfSchools: 10,
    },
    {
        district: 'Bhaktapur',
        numberOfSchools: 5,
    },
    {
        district: 'Lalitpur',
        numberOfSchools: 19,
    },
    {
        district: 'Kavrepalanchok',
        numberOfSchools: 4,
    },
];

const verifiedAndUnverified = [
    {
        id: 1,
        name: 'verified',
        number: 100,
    },
    {
        id: 2,
        name: 'Unverified',
        number: 200,
    },
];

function Schools() {
    return (
        <Container
            className={styles.reports}
            heading="Schools"
            headingSize="extraSmall"
            headerDescriptionClassName={styles.filters}
        >
            <div className={styles.informationCardWrapper}>
                <InformationCard
                    label="Number of schools reached"
                    value={10}
                    variant="accent"
                    className={styles.informationCard}
                />
                <InformationCard
                    label="Number of registered schools"
                    value={14}
                    variant="accent"
                />
            </div>
            <div className={styles.wrapper}>
                <div className={styles.dataVisualizations}>
                    <ResponsiveContainer>
                        <BarChart
                            data={district}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="district" />
                            <YAxis />
                            <Bar dataKey="numberOfSchools" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className={styles.dataVisualizations}>
                    <ResponsiveContainer>
                        <PieChart
                            width={150}
                            height={40}
                        >
                            <Pie
                                dataKey="number"
                                data={verifiedAndUnverified}
                                label
                                paddingAngle={5}
                                innerRadius={60}
                                outerRadius={80}
                            >
                                {verifiedAndUnverified.map((entry) => (
                                    <Cell key={`cell-${entry.id}`} fill={COLORS[entry.id % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </Container>
    );
}

export default Schools;
