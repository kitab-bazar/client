import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts';
import { Container } from '@the-deep/deep-ui';
import styles from './styles.css';

// Dummy Data for Payment
const windowPayment: any = [{
    window: 'Window 1',
    payment: 900,
},
{
    window: 'Window 2',
    payment: 800,
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

function Window() {
    return (
        <>
            <Container
                className={styles.reports}
                heading="Window"
                headingSize="extraSmall"
            >
                <div className={styles.wrapper}>

                    <div className={styles.dataVisualizations}>
                        <ResponsiveContainer>
                            <BarChart
                                data={windowPayment}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="window" />
                                <YAxis />
                                <Tooltip />
                                <Bar
                                    dataKey="payment"
                                    fill="#2A4494"
                                    label={{ position: 'top' }}
                                    name="Payment"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                        <div>Total payment per order window</div>
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
                                <Line dataKey="orderWindow2Books" stroke="#0098A6" name="Window 2" />
                                <Line dataKey="orderWindow1Books" stroke="#FF8552" name="Window 1" />
                                <Legend />
                            </LineChart>
                        </ResponsiveContainer>
                        <div>Number of categories books ordered per order window</div>
                    </div>
                </div>
            </Container>
        </>
    );
}

export default Window;
