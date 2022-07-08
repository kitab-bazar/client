import React from 'react';
import { Container } from '@the-deep/deep-ui';
import { useQuery, gql } from '@apollo/client';
import { ReportsQuery } from '#generated/types';

import District from './District';
import Overall from './Overall';
import Books from './Books';
import Window from './Window';

import styles from './styles.css';

const REPORTS = gql`
    query Reports {
        orderWindows {
            results {
              id
              title
            }
          }
        moderatorQuery {
            reports {
                bookGradesPerOrderWindow {
                    grades {
                        grade
                        numberOfBooks
                    }
                    orderWindowId
                    title
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
                booksAndCostPerSchool {
                    numberOfBooksOrdered
                    schoolId
                    schoolName
                    totalCost
                }
                booksOrderedAndIncentivesPerDistrict {
                    districtId
                    name
                    noOfBooksOrdered
                    noOfIncentiveBooks
                }
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
                deliveriesPerDistrict {
                    districtId
                    name
                    schoolDelivered
                }
                numberOfBooksOnThePlatform
                numberOfDistrictsReached
                numberOfBooksOrdered
                numberOfIncentiveBooks
                numberOfMunicipalities
                numberOfPublishers
                numberOfSchoolsReached
                numberOfSchoolsRegistered
                numberOfSchoolsUnverified
                numberOfSchoolsVerified
                paymentPerOrderWindow {
                    orderWindowId
                    payment
                    title
                }
                usersPerDistrict {
                    districtId
                    name
                    unverifiedUsers
                    verifiedUsers
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

function Reports() {
    const {
        data: ReportsResponse,
    } = useQuery<ReportsQuery>(
        REPORTS,
    );

    const overallData = {
        booksOnThePlatform: ReportsResponse
            ?.moderatorQuery?.reports?.numberOfBooksOnThePlatform ?? undefined,
        districtsReached: ReportsResponse
            ?.moderatorQuery?.reports?.numberOfDistrictsReached ?? undefined,
        incentiveBooks: ReportsResponse
            ?.moderatorQuery?.reports?.numberOfIncentiveBooks ?? undefined,
        booksOrdered: ReportsResponse
            ?.moderatorQuery?.reports?.numberOfBooksOrdered ?? undefined,
        municipalities: ReportsResponse
            ?.moderatorQuery?.reports?.numberOfMunicipalities ?? undefined,
        publishers: ReportsResponse
            ?.moderatorQuery?.reports?.numberOfPublishers ?? undefined,
        schoolsReached: ReportsResponse
            ?.moderatorQuery?.reports?.numberOfSchoolsReached ?? undefined,
        schoolsRegistered: ReportsResponse
            ?.moderatorQuery?.reports?.numberOfSchoolsRegistered ?? undefined,
        schoolsUnverified: ReportsResponse
            ?.moderatorQuery?.reports?.numberOfSchoolsUnverified ?? undefined,
        schoolsVerified: ReportsResponse
            ?.moderatorQuery?.reports?.numberOfSchoolsVerified ?? undefined,
    };

    const usersPerDistrict = ReportsResponse
        ?.moderatorQuery?.reports?.usersPerDistrict ?? undefined;
    const booksOrderedAndIncentivesPerDistrict = ReportsResponse
        ?.moderatorQuery?.reports?.booksOrderedAndIncentivesPerDistrict ?? undefined;
    const deliveriesPerDistrict = ReportsResponse
        ?.moderatorQuery?.reports?.deliveriesPerDistrict ?? undefined;

    const booksPerCategory = ReportsResponse
        ?.moderatorQuery?.reports?.booksPerCategory ?? undefined;
    const booksPerGrade = ReportsResponse
        ?.moderatorQuery?.reports?.booksPerGrade ?? undefined;
    const booksPerLanguage = ReportsResponse
        ?.moderatorQuery?.reports?.booksPerLanguage ?? undefined;
    const booksPerPublisher = ReportsResponse
        ?.moderatorQuery?.reports?.booksPerPublisher ?? undefined;

    const booksAndCostPerSchool = ReportsResponse
        ?.moderatorQuery?.reports?.booksAndCostPerSchool ?? undefined;

    const booksPerPublisherPerCategory = ReportsResponse
        ?.moderatorQuery?.reports?.booksPerPublisherPerCategory ?? undefined;

    const paymentPerOrderWindow = ReportsResponse
        ?.moderatorQuery?.reports?.paymentPerOrderWindow ?? undefined;
    const bookGradesPerOrderWindow = ReportsResponse
        ?.moderatorQuery?.reports?.bookGradesPerOrderWindow ?? undefined;

    const window = ReportsResponse?.orderWindows?.results ?? undefined;

    const publisherColor = booksPerPublisher?.map((publisher) => {
        const colors = COLORS[Number(publisher?.publisherId) % COLORS.length];
        return {
            publisher: publisher?.publisherName,
            fill: colors,
        };
    });

    const orderWindows = window?.map((item) => {
        const colors = COLORS[Number(item.id) % COLORS.length];
        return {
            window: item.title,
            fill: colors,
        };
    });

    return (
        <Container
            className={styles.reports}
            heading="Reports"
            headingSize="small"
        >
            <>
                <Overall
                    overallData={overallData}
                />
                <District
                    usersPerDistrict={usersPerDistrict}
                    booksOrderedAndIncentivesPerDistrict={booksOrderedAndIncentivesPerDistrict}
                    deliveriesPerDistrict={deliveriesPerDistrict}
                />
                <Window
                    paymentPerOrderWindow={paymentPerOrderWindow}
                    bookGradesPerOrderWindow={bookGradesPerOrderWindow}
                    orderWindows={orderWindows}
                    booksAndCostPerSchool={booksAndCostPerSchool}
                />
                <Books
                    booksPerCategory={booksPerCategory}
                    booksPerGrade={booksPerGrade}
                    booksPerLanguage={booksPerLanguage}
                    booksPerPublisher={booksPerPublisher}
                    booksPerPublisherPerCategory={booksPerPublisherPerCategory}
                    publisherColor={publisherColor}
                />
            </>
        </Container>
    );
}

export default Reports;
