import React from 'react';
import {
    Container,
    InformationCard,
} from '@the-deep/deep-ui';
import { useQuery, gql } from '@apollo/client';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { SchoolReportsQuery } from '#generated/types';

import styles from './styles.css';

const REPORTS = gql`
    query SchoolReports {
        schoolQuery {
            reports {
                paymentPerOrderWindow {
                    orderWindowId
                    payment
                    title
                }
                numberOfIncentiveBooks
                numberOfBooksOrdered
            }
        }
    }
`;

function SchoolReports() {
    const {
        data: reportsResponse,
    } = useQuery<SchoolReportsQuery>(
        REPORTS,
    );

    return (
        <div className={styles.schoolReports}>
            <Container
                className={styles.reports}
                heading="Reports"
                headingSize="small"
            >
                <div className={styles.informationCardWrapper}>
                    <InformationCard
                        label="Number of Books Ordered"
                        value={reportsResponse
                            ?.schoolQuery?.reports?.numberOfBooksOrdered ?? undefined}
                        variant="accent"
                        className={styles.informationCard}
                    />
                    <InformationCard
                        label="Number of Incentive Books"
                        value={reportsResponse
                            ?.schoolQuery?.reports?.numberOfIncentiveBooks ?? undefined}
                        variant="accent"
                        className={styles.informationCard}
                    />
                </div>
                <div className={styles.wrapper}>
                    <div className={styles.dataVisualizations}>
                        <div className={styles.chartLabel}>
                            Total Payments per Order Window
                        </div>
                        <ResponsiveContainer>
                            <BarChart
                                data={reportsResponse
                                    ?.schoolQuery?.reports?.paymentPerOrderWindow ?? undefined}
                                margin={{
                                    left: 10,
                                    top: 10,
                                    right: 10,
                                    bottom: 30,
                                }}
                            >
                                <XAxis
                                    dataKey="title"
                                    label={{
                                        value: 'Order Windows',
                                        position: 'bottom',
                                        textAnchor: 'middle',
                                    }}
                                />
                                <YAxis
                                    label={{
                                        value: 'Payments in NRs',
                                        angle: -90,
                                        position: 'insideLeft',
                                        textAnchor: 'middle',
                                    }}
                                    padding={{
                                        top: 30,
                                    }}
                                />
                                <Tooltip cursor={false} />
                                <Legend
                                    verticalAlign="top"
                                />
                                <Bar
                                    dataKey="payment"
                                    fill="var(--dui-color-cornflower-blue)"
                                    label={{ position: 'top' }}
                                    name="Payment"
                                    barSize={50}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default SchoolReports;
