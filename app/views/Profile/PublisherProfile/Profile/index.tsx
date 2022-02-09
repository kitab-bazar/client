import React, { useMemo } from 'react';
import { isTruthyString, compareDate, isDefined } from '@togglecorp/fujs';
import {
    IoPencil,
} from 'react-icons/io5';
import {
    Card,
    Container,
    Button,
    Header,
    TextOutput,
    useModalState,
    Message,
} from '@the-deep/deep-ui';
import {
    AreaChart,
    XAxis,
    YAxis,
    Area,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { useQuery, gql } from '@apollo/client';

import {
    PublisherStatsQuery,
    PublisherStatsQueryVariables,
} from '#generated/types';

import EditPublisherProfileModal from './EditPublisherProfileModal';
import { ProfileDetails } from '../index';

import styles from './styles.css';

const dateFormatter = (value: number | string) => {
    const date = new Date(value);
    return date.toDateString();
};

const tickFormatter = (value: number | string) => {
    const date = new Date(value);
    const format: Intl.DateTimeFormatOptions = {
        dateStyle: 'medium',
    };
    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return new Intl.DateTimeFormat('en-GB', format).format(date);
};

const PUBLISHER_STATS = gql`
    query PublisherStats {
        orderStat {
            ordersCompletedCount
            totalBooksOrdered
            totalBooksUploaded
            stat {
                orderPlacedAt
                totalQuantity
            }
        }
    }
`;

interface ChartData {
    orderPlacedAt: string;
    totalQuantity: number;
}
interface Props {
    profileDetails?: ProfileDetails;
    onEditSuccess: () => void;
}

function Profile(props: Props) {
    const {
        profileDetails,
        onEditSuccess,
    } = props;

    const [
        editProfileModalShown,
        showEditProfileModal,
        hideEditProfileModal,
    ] = useModalState(false);

    const {
        data: publisherStats,
    } = useQuery<PublisherStatsQuery, PublisherStatsQueryVariables>(
        PUBLISHER_STATS,
    );

    const orderSummary = useMemo(
        () => {
            const filteredStats = publisherStats?.orderStat?.stat
                ?.filter((v) => isDefined(v.orderPlacedAt)) as ChartData[] | undefined | null;
            return (filteredStats ?? []).map((v) => ({
                ...v,
                orderPlacedAt: new Date(v.orderPlacedAt).getTime(),
            })).sort((a, b) => compareDate(a.orderPlacedAt, b.orderPlacedAt));
        },
        [publisherStats],
    );

    const publisherDetails = {
        ...profileDetails?.publisher,
        municipality: profileDetails?.publisher?.municipality.id,
    };

    return (
        <Container
            className={styles.profile}
            contentClassName={styles.content}
            spacing="comfortable"
        >
            <Container
                className={styles.profileDetails}
                spacing="comfortable"
            >
                <div className={styles.top}>
                    <Header
                        className={styles.heading}
                        headingSectionClassName={styles.headingSection}
                        headingSize="extraLarge"
                        spacing="comfortable"
                        actions={(
                            <Button
                                name={undefined}
                                variant="general"
                                onClick={showEditProfileModal}
                                icons={<IoPencil />}
                            >
                                Edit Profile
                            </Button>
                        )}
                        icons={isTruthyString(profileDetails?.image?.url) && (
                            <div
                                className={styles.displayPicture}
                            >
                                <img
                                    src={profileDetails?.image?.url ?? undefined}
                                    alt={profileDetails?.fullName ?? ''}
                                />
                            </div>
                        )}
                        heading={profileDetails?.fullName}
                    />
                </div>
                <div className={styles.bottom}>
                    <TextOutput
                        label="Address"
                        value={profileDetails?.publisher?.localAddress}
                    />
                    <TextOutput
                        label="Phone Number"
                        value={profileDetails?.phoneNumber}
                    />
                    <TextOutput
                        label="PAN Number"
                        value={profileDetails?.publisher?.panNumber}
                    />
                    <TextOutput
                        label="VAT Number"
                        value={profileDetails?.publisher?.vatNumber}
                    />
                </div>
            </Container>
            <Container
                className={styles.orderSummaryContainer}
                heading="Order Summary"
                headingSize="extraLarge"
                contentClassName={styles.summary}
            >
                <div className={styles.left}>
                    <TextOutput
                        label="Total books uploaded"
                        value={publisherStats?.orderStat?.totalBooksUploaded}
                    />
                    <TextOutput
                        label="Total books ordered"
                        value={publisherStats?.orderStat?.totalBooksOrdered}
                    />
                    <TextOutput
                        label="Total books orders completed"
                        value={publisherStats?.orderStat?.ordersCompletedCount}
                    />
                </div>
                <Card className={styles.right}>
                    <ResponsiveContainer className={styles.container}>
                        {(orderSummary.length > 0) ? (
                            <AreaChart data={orderSummary}>
                                <defs>
                                    <linearGradient
                                        key="#00adb5"
                                        id="accent-color-gradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#00adb5"
                                            stopOpacity={0.2}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#00adb5"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="orderPlacedAt"
                                    type="number"
                                    scale="time"
                                    domain={['dataMin', 'dataMax']}
                                    allowDuplicatedCategory={false}
                                    tickFormatter={tickFormatter}
                                    tick={{ strokeWidth: 1 }}
                                    interval="preserveStartEnd"
                                    padding={{ left: 10, right: 10 }}
                                />
                                <YAxis />
                                <Tooltip
                                    labelFormatter={dateFormatter}
                                    isAnimationActive={false}
                                />
                                <Area
                                    dataKey="totalQuantity"
                                    stroke="#00adb5"
                                    fill="{url(#accent-color-gradient)}"
                                />
                            </AreaChart>
                        ) : (
                            <Message
                                message="Chart not available"
                            />
                        )}
                    </ResponsiveContainer>
                </Card>
            </Container>
            {editProfileModalShown && (
                <EditPublisherProfileModal
                    onModalClose={hideEditProfileModal}
                    onEditSuccess={onEditSuccess}
                    profileDetails={publisherDetails}
                />
            )}
        </Container>
    );
}

export default Profile;
