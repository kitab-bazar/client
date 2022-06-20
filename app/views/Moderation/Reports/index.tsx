import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';
import { Container, InformationCard } from '@the-deep/deep-ui';
import styles from './styles.css';
import Order from './Order/index';
import Schools from './Schools/index';
import Books from './Books/index';
import Locations from './Locations/index';

// Dummy Data for Payment
const windowPayment: any = [{
    window: 'window 1',
    payment: 2000,
},
{
    window: 'window 2',
    payment: 1600,
},
];

function Reports() {
    return (
        <>
            <Container
                className={styles.reports}
                heading="Reports"
                headingSize="small"
            >
                <>
                    <Schools />
                    <Order />
                    <Books />
                    <Locations />
                    <Container
                        className={styles.reports}
                        heading="Institutional Users"
                        headingSize="extraSmall"
                    >
                        <div className={styles.informationCardWrapper}>
                            <InformationCard
                                label="Number of institutional users in the platform"
                                value={55}
                                variant="accent"
                                className={styles.informationCard}
                            />
                        </div>

                    </Container>
                    <Container
                        className={styles.reports}
                        heading="Payment"
                        headingSize="extraSmall"
                    >
                        <div className={styles.dataVisualizations}>
                            <ResponsiveContainer>
                                <BarChart
                                    width={150}
                                    height={40}
                                    data={windowPayment}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="window" />
                                    <YAxis />
                                    <Bar
                                        dataKey="payment"
                                        fill="#82ca9d"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Container>
                </>
            </Container>
        </>
    );
}

export default Reports;
