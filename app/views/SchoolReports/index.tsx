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

import Books from '../Moderation/Reports/Books';
import styles from './styles.css';

const REPORTS = gql`
    query SchoolReports {
        schoolQuery {
            reports {
                booksPerCategory {
                    category
                    categoryId
                    numberOfBooks
                }
                booksPerGrade {
                    grade
                    numberOfBooks
                }
                booksPerLanguage {
                    language
                    numberOfBooks
                }
                booksPerPublisher {
                    numberOfBooks
                    publisherId
                    publisherName
                }
                booksPerPublisherPerCategory {
                    categories {
                        category
                        categoryId
                        numberOfBooks
                    }
                    publisherId
                    publisherName
                }
                numberOfBooksOrdered
                numberOfIncentiveBooks
                paymentPerOrderWindow {
                    orderWindowId
                    payment
                    title
                }
            }
        }
    }
`;

const COLORS = [
    'var(--dui-color-cornflower-blue)',
    'var(--dui-color-elton-blue)',
    'var(--dui-color-maximum-yellow-red)',
    'var(--dui-color-medium-purple)',
    'var(--dui-color-princeton-orange)',
    'var(--dui-color-rose-madder)',
    'var(--dui-color-deep-taupe)',
    'var(--dui-color-brandy)',
];

function SchoolReports() {
    const {
        data: reportsResponse,
    } = useQuery<SchoolReportsQuery>(
        REPORTS,
    );

    const booksPerCategory = reportsResponse
        ?.schoolQuery?.reports?.booksPerCategory ?? undefined;
    const booksPerGrade = reportsResponse
        ?.schoolQuery?.reports?.booksPerGrade ?? undefined;
    const booksPerLanguage = reportsResponse
        ?.schoolQuery?.reports?.booksPerLanguage ?? undefined;
    const booksPerPublisher = reportsResponse
        ?.schoolQuery?.reports?.booksPerPublisher ?? undefined;
    const booksPerPublisherPerCategory = reportsResponse
        ?.schoolQuery?.reports?.booksPerPublisherPerCategory ?? undefined;

    const publisherColor = booksPerPublisher?.map((publisher) => {
        const colors = COLORS[Number(publisher?.publisherId) % COLORS.length];
        return {
            publisher: publisher?.publisherName,
            fill: colors,
        };
    });

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
                <Books
                    booksPerCategory={booksPerCategory}
                    booksPerGrade={booksPerGrade}
                    booksPerLanguage={booksPerLanguage}
                    booksPerPublisher={booksPerPublisher}
                    booksPerPublisherPerCategory={booksPerPublisherPerCategory}
                    publisherColor={publisherColor}
                />
            </Container>
        </div>
    );
}

export default SchoolReports;
