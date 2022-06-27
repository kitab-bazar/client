import React from 'react';
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
} from 'recharts';
import { Container, SelectInput } from '@the-deep/deep-ui';
import styles from './styles.css';

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

const orderedAndIncentive: any = [
    {
        name: 'Gulmi',
        noOfBooksOrdered: 100,
        noOfIncentiveBooks: 400,
    },
    {
        name: 'Bagmati',
        noOfBooksOrdered: 75,
        noOfIncentiveBooks: 300,
    },
    {
        name: 'Kailali',
        noOfBooksOrdered: 175,
        noOfIncentiveBooks: 700,
    },
];

const usersPerDistrict: any = [{
    name: 'Gulmi',
    number: 70,
},
{
    name: 'kathmandu',
    number: 50,
},
];

const deliveryDistrict: any = [{
    name: 'Gulmi',
    number: 25,
},
{
    name: 'kailali',
    number: 30,
},
{
    name: 'Bajhang',
    number: 41,
},
];

function District() {
    return (
        <>
            <Container
                className={styles.reports}
                heading="District"
                headingSize="extraSmall"
                headerDescriptionClassName={styles.filters}
            >
                <div className={styles.wrapper}>
                    <div className={styles.dataVisualizations}>
                        <ResponsiveContainer>
                            <BarChart
                                data={district}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="district" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="numberOfSchools" fill="#8884d8" name="Number of Schools" />
                            </BarChart>
                        </ResponsiveContainer>
                        <div>Number of verified users per district</div>
                    </div>
                    <div className={styles.dataVisualizations}>
                        <ResponsiveContainer>
                            <BarChart
                                data={orderedAndIncentive}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <Legend />
                                <YAxis />
                                <Tooltip />
                                <Bar
                                    dataKey="noOfBooksOrdered"
                                    fill="#82ca9d"
                                    label={{ position: 'top' }}
                                    name="Number of Books Ordered"
                                    stackId="a"
                                />
                                <Bar
                                    dataKey="noOfIncentiveBooks"
                                    fill="#ffc658"
                                    label={{ position: 'top' }}
                                    stackId="a"
                                    name="Number of Incentive Books"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                        <div>Number of ordered and incentive books distributed per district</div>
                    </div>
                </div>
                <div className={styles.wrapper}>
                    <div className={styles.dataVisualizations}>
                        <ResponsiveContainer>
                            <BarChart
                                data={usersPerDistrict}
                            >
                                <Tooltip />
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Bar
                                    dataKey="number"
                                    fill="#F2BB05"
                                    name="Number of Users"
                                    label={{ position: 'top' }}
                                />
                                <Legend />
                            </BarChart>
                        </ResponsiveContainer>
                        <div>Number of users per district</div>
                    </div>
                    <div className={styles.dataVisualizations}>
                        <ResponsiveContainer>
                            <BarChart
                                data={deliveryDistrict}
                            >
                                <Tooltip />
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Bar
                                    dataKey="number"
                                    fill="#D74E09"
                                    name="Number of deliveries"
                                    label={{ position: 'top' }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                        <div>Number of deliveries by district</div>
                    </div>
                </div>
            </Container>
        </>
    );
}

export default District;
