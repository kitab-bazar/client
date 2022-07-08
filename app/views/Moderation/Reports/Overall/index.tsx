import React from 'react';
import {
    Container,
    InformationCard,
} from '@the-deep/deep-ui';

import styles from './styles.css';
import { ReportsQuery } from '#generated/types';

type booksOnThePlatformType = NonNullable<NonNullable<ReportsQuery['moderatorQuery']>['reports']>['numberOfBooksOnThePlatform'];
type districtsReachedType = NonNullable<NonNullable<ReportsQuery['moderatorQuery']>['reports']>['numberOfDistrictsReached'];
type incentiveBooksType = NonNullable<NonNullable<ReportsQuery['moderatorQuery']>['reports']>['numberOfIncentiveBooks'];
type booksOrderedType = NonNullable<NonNullable<ReportsQuery['moderatorQuery']>['reports']>['numberOfBooksOrdered'];
type municipalitiesType = NonNullable<NonNullable<ReportsQuery['moderatorQuery']>['reports']>['numberOfMunicipalities'];
type publishersType = NonNullable<NonNullable<ReportsQuery['moderatorQuery']>['reports']>['numberOfPublishers'];
type schoolsReachedType = NonNullable<NonNullable<ReportsQuery['moderatorQuery']>['reports']>['numberOfSchoolsReached'];
type schoolsRegisteredType = NonNullable<NonNullable<ReportsQuery['moderatorQuery']>['reports']>['numberOfSchoolsRegistered'];
type schoolsUnverifiedType = NonNullable<NonNullable<ReportsQuery['moderatorQuery']>['reports']>['numberOfSchoolsUnverified'];
type schoolsVerifiedType = NonNullable<NonNullable<ReportsQuery['moderatorQuery']>['reports']>['numberOfSchoolsVerified'];

export interface OverallType {
    booksOnThePlatform: booksOnThePlatformType | undefined;
    districtsReached: districtsReachedType | undefined;
    incentiveBooks: incentiveBooksType | null | undefined;
    booksOrdered: booksOrderedType | undefined;
    municipalities: municipalitiesType | undefined;
    publishers: publishersType | undefined;
    schoolsReached: schoolsReachedType | undefined;
    schoolsRegistered: schoolsRegisteredType | undefined;
    schoolsUnverified: schoolsUnverifiedType | undefined;
    schoolsVerified: schoolsVerifiedType | undefined;
}

interface OverallProps {
    overallData: OverallType;
}

function Overall(props: OverallProps) {
    const { overallData } = props;

    return (
        <Container
            className={styles.overallContainer}
            heading="Overall"
            headingSize="small"
        >
            <div className={styles.informationCardWrapper}>
                <InformationCard
                    label="Number of Schools Registered"
                    value={overallData.schoolsRegistered}
                    variant="accent"
                    className={styles.informationCard}
                />
                <InformationCard
                    label="Number of Schools Verified"
                    value={overallData.schoolsVerified}
                    variant="accent"
                    className={styles.informationCard}
                />
                <InformationCard
                    label="Number of Schools Unverified"
                    value={overallData.schoolsUnverified}
                    variant="accent"
                    className={styles.informationCard}
                />
                <InformationCard
                    label="Number of Publishers"
                    value={overallData.publishers}
                    variant="accent"
                    className={styles.informationCard}
                />
            </div>
            <div className={styles.informationCardWrapper}>
                <InformationCard
                    label="Number of Books on the Platform"
                    value={overallData.booksOnThePlatform}
                    variant="accent"
                    className={styles.informationCard}
                />
                <InformationCard
                    label="Number of Incentive Books"
                    value={overallData.incentiveBooks ?? undefined}
                    variant="accent"
                    className={styles.informationCard}
                />
                <InformationCard
                    label="Number of Books Ordered"
                    value={overallData.booksOrdered}
                    variant="accent"
                    className={styles.informationCard}
                />
            </div>
            <div className={styles.informationCardWrapper}>
                <InformationCard
                    label="Number of Districts Reached"
                    value={overallData.districtsReached}
                    variant="accent"
                    className={styles.informationCard}
                />
                <InformationCard
                    label="Number of Municipalities"
                    value={overallData.municipalities}
                    variant="accent"
                    className={styles.informationCard}
                />
                <InformationCard
                    label="Number of Schools Reached"
                    value={overallData.schoolsReached}
                    variant="accent"
                    className={styles.informationCard}
                />
            </div>
        </Container>
    );
}

export default Overall;
