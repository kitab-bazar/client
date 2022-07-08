import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList,
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
        <>
            <Container
                className={styles.reports}
                heading="District"
                headingSize="small"
                headerDescriptionClassName={styles.filters}
            >
                <div className={styles.wrapper}>
                    <div className={styles.dataVisualizations}>
                        <div className={styles.chartLabel}>
                            Number of Deliveries by District
                        </div>
                        <ResponsiveContainer>
                            <BarChart
                                margin={{
                                    left: 10,
                                    top: 10,
                                    right: 10,
                                    bottom: 30,
                                }}
                                data={deliveriesPerDistrict ?? undefined}
                            >
                                <Tooltip />
                                <XAxis
                                    dataKey="name"
                                    label={{
                                        value: 'Districts',
                                        position: 'bottom',
                                        textAnchor: 'middle',
                                    }}
                                />
                                <Legend
                                    verticalAlign="top"
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
                                <Bar
                                    dataKey="schoolDelivered"
                                    fill="var(--dui-color-accent)"
                                    name="Number of Deliveries"
                                    barSize={50}
                                >
                                    <LabelList dataKey="schoolDelivered" position="top" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className={styles.dataVisualizations}>
                        <div className={styles.chartLabel}>
                            Number of Ordered and Incentive Books Distributed per District
                        </div>
                        <ResponsiveContainer>
                            <BarChart
                                margin={{
                                    left: 10,
                                    top: 10,
                                    right: 10,
                                    bottom: 30,
                                }}
                                data={booksOrderedAndIncentivesPerDistrict ?? undefined}
                            >
                                <XAxis
                                    dataKey="name"
                                    label={{
                                        value: 'Districts',
                                        position: 'bottom',
                                        textAnchor: 'middle',
                                    }}
                                />
                                <Legend
                                    verticalAlign="top"
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
                                <Tooltip />
                                <Bar
                                    dataKey="noOfBooksOrdered"
                                    fill="var(--dui-color-elton-blue)"
                                    label={{ position: 'top' }}
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
                                        value: 'Total Number of Books',
                                        angle: -90,
                                        position: 'insideLeft',
                                        textAnchor: 'middle',
                                    }}
                                    padding={{
                                        top: 30,
                                    }}
                                />
                                <Tooltip />
                                <Legend
                                    verticalAlign="top"
                                />
                                <Bar
                                    dataKey="verifiedUsers"
                                    fill="var(--dui-color-medium-purple)"
                                    name="Verified Users"
                                    stackId="name"
                                    label={{ position: 'top' }}
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
        </>
    );
}

export default District;
