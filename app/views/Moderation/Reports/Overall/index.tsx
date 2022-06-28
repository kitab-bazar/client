import React from 'react';
import {
    Container,
    InformationCard,
} from '@the-deep/deep-ui';
import { useQuery, gql } from '@apollo/client';

import styles from './styles.css';
import { OverallReportsQuery } from '#generated/types';

export type OverallReports = NonNullable<NonNullable<OverallReportsQuery['moderatorQuery']>>;

const OVERALL_REPORTS = gql`
    query OverallReports {
        moderatorQuery {
            reports {
                numberOfBooksOnThePlatform
                numberOfBooksOrdered
                numberOfDistrictsReached
                numberOfIncentiveBooks
                numberOfMunicipalities
                numberOfPublishers
                numberOfSchoolsReached
                numberOfSchoolsRegistered
                numberOfSchoolsUnverfied
                numberOfSchoolsVerified
            }
        }
    }
`;

function Overall() {
    const {
        data: OverallReportsResponse,
        loading: OverallReportsLoading,
        error,
    } = useQuery<OverallReportsQuery>(
        OVERALL_REPORTS,
    );

    console.log(OverallReportsResponse);
    return (
        <Container
            className={styles.overallContainer}
            heading="Overall"
            headingSize="extraSmall"
        >
            <div className={styles.informationCardWrapper}>
                <InformationCard
                    label="Number of schools registered"
                    value={OverallReportsResponse?.moderatorQuery
                        ?.reports?.numberOfSchoolsRegistered ?? undefined}
                    variant="accent"
                />
                <InformationCard
                    label="Number of Schools verified"
                    value={OverallReportsResponse?.moderatorQuery
                        ?.reports?.numberOfSchoolsVerified ?? undefined}
                    variant="accent"
                    className={styles.informationCard}
                />
                <InformationCard
                    label="Number of Schools unverified"
                    value={OverallReportsResponse?.moderatorQuery
                        ?.reports?.numberOfSchoolsUnverfied ?? undefined}
                    variant="accent"
                    className={styles.informationCard}
                />
                <InformationCard
                    label="Number of publishers"
                    value={OverallReportsResponse?.moderatorQuery
                        ?.reports?.numberOfPublishers ?? undefined}
                    variant="accent"
                    className={styles.informationCard}
                />
            </div>
            <div className={styles.informationCardWrapper}>
                <InformationCard
                    label="Number of books on the Platform"
                    value={OverallReportsResponse?.moderatorQuery
                        ?.reports?.numberOfBooksOnThePlatform ?? undefined}
                    variant="accent"
                    className={styles.informationCard}
                />
                <InformationCard
                    label="Number of incentive books"
                    value={OverallReportsResponse?.moderatorQuery
                        ?.reports?.numberOfIncentiveBooks ?? undefined}
                    variant="accent"
                    className={styles.informationCard}
                />
                <InformationCard
                    label="Number of books ordered"
                    value={OverallReportsResponse?.moderatorQuery
                        ?.reports?.numberOfBooksOrdered ?? undefined}
                    variant="accent"
                    className={styles.informationCard}
                />
            </div>
            <div className={styles.informationCardWrapper}>
                <InformationCard
                    label="Number of districts reached"
                    value={OverallReportsResponse?.moderatorQuery
                        ?.reports?.numberOfDistrictsReached ?? undefined}
                    variant="accent"
                    className={styles.informationCard}
                />
                <InformationCard
                    label="Number of municipalities"
                    value={OverallReportsResponse?.moderatorQuery
                        ?.reports?.numberOfMunicipalities ?? undefined}
                    variant="accent"
                    className={styles.informationCard}
                />
                <InformationCard
                    label="Number of schools reached"
                    value={OverallReportsResponse?.moderatorQuery
                        ?.reports?.numberOfSchoolsReached ?? undefined}
                    variant="accent"
                    className={styles.informationCard}
                />
            </div>
        </Container>
    );
}

export default Overall;
