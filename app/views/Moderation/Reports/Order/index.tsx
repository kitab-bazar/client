import React from 'react';
import {
    Container,
    InformationCard,
} from '@the-deep/deep-ui';
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
    LineChart,
    Line,
    ScatterChart,
    Scatter,
    ZAxis,
} from 'recharts';
import styles from './styles.css';

const orderedAndIncentive: any = [
    {
        name: 'Gulmi',
        noOfBooksOrdered: 100,
        noOfIncentiveBooks: 200,
    },
    {
        name: 'Bagmati',
        noOfBooksOrdered: 100,
        noOfIncentiveBooks: 200,
    },
];

const orderedWindow: any = [{
    name: 'Poem',
    orderWindow1Books: 30,
    orderWindow2Books: 100,
},
{
    name: 'Story',
    orderWindow1Books: 25,
    orderWindow2Books: 75,
},
{
    name: 'Song',
    orderWindow1Books: 29,
    orderWindow2Books: 70,
},
{
    name: 'Picture',
    orderWindow1Books: 30,
    orderWindow2Books: 65,
},
];

const orderedAndCost: any = [{
    name: 'School A',
    noOfBooksOrdered: 55,
    totalCost: 2000,
},
{
    name: 'School B',
    noOfBooksOrdered: 78,
    totalCost: 3000,
},
{
    name: 'School C',
    noOfBooksOrdered: 78,
    totalCost: 2500,
},
{
    name: 'School D',
    noOfBooksOrdered: 78,
    totalCost: 2750,
},
];

function Order() {
    return (
        <>
            <Container
                className={styles.orderContainer}
                heading="Order"
                headingSize="extraSmall"
            >
                <div className={styles.orderWrapper}>
                    <div className={styles.dataVisualizations}>
                        <ResponsiveContainer>
                            <BarChart
                                width={150}
                                height={40}
                                data={orderedAndIncentive}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <Legend />
                                <YAxis />
                                <Bar
                                    dataKey="noOfBooksOrdered"
                                    fill="#82ca9d"
                                    label={{ position: 'top' }}
                                    stackId="a"
                                />
                                <Bar
                                    dataKey="noOfIncentiveBooks"
                                    fill="#ffc658"
                                    label={{ position: 'top' }}
                                    stackId="a"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className={styles.dataVisualizations}>
                        <ResponsiveContainer>
                            <LineChart
                                width={500}
                                height={300}
                                data={orderedWindow}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line dataKey="orderWindow2Books" stroke="#82ca9d" name="Window 2" />
                                <Line dataKey="orderWindow1Books" stroke="#8884d8" name="Window 1" />
                                <Legend />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className={styles.dataVisualizations}>
                        <ResponsiveContainer>
                            <ScatterChart>
                                <Tooltip />
                                <ZAxis dataKey="name" name="Name" />
                                <XAxis dataKey="noOfBooksOrdered" name="Number of Books Ordered" />
                                <YAxis dataKey="totalCost" name="Total Cost" />
                                <Scatter fill="#8884d8" name="name" data={orderedAndCost} />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </Container>
        </>
    );
}

export default Order;
