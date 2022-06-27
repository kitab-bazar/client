import React from 'react';
import {
    Container,
    InformationCard,
} from '@the-deep/deep-ui';
import styles from './styles.css';

function Overall() {
    return (
        <Container
            className={styles.overallContainer}
            heading="Overall"
            headingSize="extraSmall"
        >
            <div className={styles.informationCardWrapper}>
                <InformationCard
                    label="Number of schools registered"
                    value={14}
                    variant="accent"
                />
                <InformationCard
                    label="Number of Schools verified"
                    value={55}
                    variant="accent"
                    className={styles.informationCard}
                />
                <InformationCard
                    label="Number of Schools unverified"
                    value={55}
                    variant="accent"
                    className={styles.informationCard}
                />
                <InformationCard
                    label="Number of publishers"
                    value={10}
                    variant="accent"
                    className={styles.informationCard}
                />
            </div>
            <div className={styles.informationCardWrapper}>
                <InformationCard
                    label="Number of books on the Platform"
                    value={154}
                    variant="accent"
                    className={styles.informationCard}
                />
                <InformationCard
                    label="Number of incentive books"
                    value={14}
                    variant="accent"
                    className={styles.informationCard}
                />
                <InformationCard
                    label="Number of books ordered"
                    value={14}
                    variant="accent"
                    className={styles.informationCard}
                />
            </div>
            <div className={styles.informationCardWrapper}>
                <InformationCard
                    label="Number of districts reached"
                    value={55}
                    variant="accent"
                    className={styles.informationCard}
                />
                <InformationCard
                    label="Number of municipalities"
                    value={200}
                    variant="accent"
                    className={styles.informationCard}
                />
                <InformationCard
                    label="Number of schools reached"
                    value={10}
                    variant="accent"
                    className={styles.informationCard}
                />
            </div>
        </Container>
    );
}

export default Overall;
