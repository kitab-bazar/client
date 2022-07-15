import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Container } from '@the-deep/deep-ui';
import { ReportsQuery } from '#generated/types';
import styles from './styles.css';

type usersPerDistrictType = NonNullable<NonNullable<ReportsQuery['moderatorQuery']>['reports']>['usersPerDistrict'];
type booksOrderedAndIncentivesPerDistrictType = NonNullable<NonNullable<ReportsQuery['moderatorQuery']>['reports']>['booksOrderedAndIncentivesPerDistrict'];
type deliveriesPerDistrict = NonNullable<NonNullable<ReportsQuery['moderatorQuery']>['reports']>['deliveriesPerDistrict'];
interface DistrictProps {
    usersPerDistrict: usersPerDistrictType;
    booksOrderedAndIncentivesPerDistrict: booksOrderedAndIncentivesPerDistrictType;
    deliveriesPerDistrict: deliveriesPerDistrict;
}

function District(props: DistrictProps) {
    const { usersPerDistrict,
        booksOrderedAndIncentivesPerDistrict,
        deliveriesPerDistrict } = props;

    return (
        <Container
            className={styles.reports}
            heading="District"
            headingSize="small"
        >
            <div className={styles.wrapper}>
                <div className={styles.dataVisualizations}>
                    <div className={styles.chartLabel}>
                        Number of Deliveries by District
                    </div>
                    <ResponsiveContainer>
                        <BarChart
                            data={deliveriesPerDistrict ?? undefined}
                            margin={{
                                left: 10,
                                top: 10,
                                right: 10,
                                bottom: 30,
                            }}
                        >
                            <XAxis
                                dataKey="name"
                                label={{
                                    value: 'Districts',
                                    position: 'bottom',
                                    textAnchor: 'middle',
                                }}
                            />
                            <YAxis
                                tickCount={6}
                                label={{
                                    value: 'Number of Deliveries',
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
                                dataKey="schoolDelivered"
                                fill="var(--dui-color-accent)"
                                label={{ position: 'top' }}
                                name="Number of Deliveries"
                                barSize={50}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className={styles.dataVisualizations}>
                    <div className={styles.chartLabel}>
                        Number of Ordered and Incentive Books Distributed per District
                    </div>
                    <ResponsiveContainer>
                        <BarChart
                            data={booksOrderedAndIncentivesPerDistrict ?? undefined}
                            margin={{
                                left: 10,
                                top: 10,
                                right: 10,
                                bottom: 30,
                            }}
                        >
                            <XAxis
                                dataKey="name"
                                label={{
                                    value: 'Districts',
                                    position: 'bottom',
                                    textAnchor: 'middle',
                                }}
                            />
                            <YAxis
                                label={{
                                    value: 'Total Number of Books',
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
                                dataKey="noOfBooksOrdered"
                                fill="var(--dui-color-elton-blue)"
                                name="Books Ordered"
                                stackId="name"
                                barSize={50}
                            />
                            <Bar
                                dataKey="noOfIncentiveBooks"
                                fill="var(--dui-color-maximum-yellow-red)"
                                label={{ position: 'top' }}
                                stackId="name"
                                name="Incentive Books"
                                barSize={50}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className={styles.wrapper}>
                <div className={styles.dataVisualizations}>
                    <div className={styles.chartLabel}>
                        Number of Verified Users per District
                    </div>
                    <ResponsiveContainer>
                        <BarChart
                            margin={{
                                left: 10,
                                top: 10,
                                right: 10,
                                bottom: 30,
                            }}
                            data={usersPerDistrict ?? undefined}
                        >
                            <XAxis
                                dataKey="name"
                                label={{
                                    value: 'Districts',
                                    position: 'bottom',
                                    textAnchor: 'middle',
                                }}
                            />
                            <YAxis
                                tickCount={6}
                                label={{
                                    value: 'Total Number of Users',
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
                                dataKey="verifiedUsers"
                                fill="var(--dui-color-medium-purple)"
                                name="Verified Users"
                                stackId="name"
                                barSize={50}
                            />
                            <Bar
                                dataKey="unverifiedUsers"
                                fill="var(--dui-color-maximum-yellow-red)"
                                name="Unverified Users"
                                stackId="name"
                                label={{ position: 'top' }}
                                barSize={50}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Container>
    );
}

export default District;
