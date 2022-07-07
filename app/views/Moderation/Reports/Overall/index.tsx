import React from 'react';
import {
    Container,
    InformationCard,
} from '@the-deep/deep-ui';

import styles from './styles.css';

export interface overallType {
    booksOnThePlatform: number | undefined,
    districtsReached: number | undefined,
    incentiveBooks: number | undefined,
    booksOrdered: number | undefined,
    municipalities: number | undefined,
    publishers: number | undefined,
    schoolsReached: number | undefined,
    schoolsRegistered: number | undefined,
    schoolsUnverified: number | undefined,
    schoolsVerified: number | undefined
}

interface OverallProps {
    overallData: overallType;
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
                    value={overallData.incentiveBooks}
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
