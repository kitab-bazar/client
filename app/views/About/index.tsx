import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { Container } from '@the-deep/deep-ui';
import {
    FaTruck,
    FaBookReader,
    FaHandshake,
    FaGift,
} from 'react-icons/fa';

import { about } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import NumberOutput from '#components/NumberOutput';
import {
    resolveToString,
    resolveToComponent,
} from '#base/utils/lang';

import styles from './styles.css';

interface GoalPointProps {
    icon: React.ReactNode;
    description: string;
}

function GoalPoint(props: GoalPointProps) {
    const {
        icon,
        description,
    } = props;

    return (
        <div className={styles.goalPoint}>
            <div className={styles.icon}>
                {icon}
            </div>
            <div className={styles.goalDescription}>
                {description}
            </div>
        </div>
    );
}

interface Props {
    className?: string;
}

function About(props: Props) {
    const { className } = props;
    const strings = useTranslation(about);

    return (
        <div className={_cs(styles.about, className)}>
            <div className={styles.pageContent}>
                <Container
                    className={styles.whoAreWe}
                    heading={strings.whoAreWeLabel}
                >
                    {strings.whoAreWeDescription}
                </Container>
                <Container
                    className={styles.platformBackground}
                    heading={strings.backgroundLabel}
                >
                    {strings.platformBackground}
                </Container>
                <Container
                    className={styles.goals}
                    heading={strings.goalsLabel}
                >
                    <p>
                        {strings.firstGoalDescription}
                    </p>
                    <p>
                        {strings.secondGoalDescription}
                    </p>
                </Container>
                <Container
                    className={styles.goalPoints}
                    contentClassName={styles.goalPointList}
                >
                    <GoalPoint
                        icon={<FaBookReader />}
                        description={strings.accessToReadingMaterialText}
                    />
                    <GoalPoint
                        icon={<FaGift />}
                        description={strings.bookCornerIncentiveText}
                    />
                    <GoalPoint
                        icon={<FaHandshake />}
                        description={strings.relationshipEnhacementText}
                    />
                    <GoalPoint
                        icon={<FaTruck />}
                        description={strings.supplyChainText}
                    />
                </Container>
                <Container
                    className={styles.contactUs}
                    heading={strings.contactUsLabel}
                >
                    <p>
                        {strings.contactUsDescription}
                    </p>
                    <p>
                        {resolveToString(
                            strings.sendUsEmailLabel,
                            { email: 'info@kitabbazar.org' },
                        )}
                    </p>
                    <p className={styles.phone}>
                        {resolveToComponent(
                            strings.callUsLabel,
                            {
                                phoneNumber: (
                                    <NumberOutput
                                        // NOTE: Currently set as TC's number
                                        value={9741673214}
                                        separatorHidden
                                    />
                                ),
                            },
                        )}
                    </p>
                </Container>
            </div>
        </div>
    );
}

export default About;
