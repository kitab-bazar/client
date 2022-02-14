import React from 'react';
import {
    IoPencil,
    IoPerson,
} from 'react-icons/io5';
import {
    PendingMessage,
    Message,
    Button,
    Container,
    TextOutput,
    useModalState,
} from '@the-deep/deep-ui';
import {
    AreaChart,
    XAxis,
    YAxis,
    Area,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import {
    _cs,
    isDefined,
    compareDate,
} from '@togglecorp/fujs';
import { useQuery, gql } from '@apollo/client';

import {
    PublisherProfileQuery,
    PublisherProfileQueryVariables,
    PublisherStatsQuery,
    PublisherStatsQueryVariables,
} from '#generated/types';

import { publisher } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';

import EditPublisherProfileModal from './EditPublisherProfileModal';

import styles from './styles.css';

const PUBLISHER_PROFILE = gql`
    query PublisherProfile {
        me {
            id
            email
            fullName
            firstName
            lastName
            phoneNumber
            image {
                name
                url
            }
            publisher {
                id
                localAddress
                name
                panNumber
                vatNumber
                wardNumber
                municipality {
                    id
                    name
                    district {
                        id
                        name
                        province {
                            id
                            name
                        }
                    }
                }
            }
        }
    }
`;

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
                orderPlacedAtDate
                totalQuantity
            }
        }
    }
`;

interface ChartData {
    orderPlacedAtDate: string;
    totalQuantity: number;
}

export type ProfileDetails = NonNullable<NonNullable<PublisherProfileQuery>['me']>;

interface Props {
    className?: string;
}

function PublisherProfile(props: Props) {
    const { className } = props;
    const strings = useTranslation(publisher);

    const {
        previousData,
        data: profileDetails = previousData,
        loading,
        refetch: refetchProfileDetails,
    } = useQuery<PublisherProfileQuery, PublisherProfileQueryVariables>(
        PUBLISHER_PROFILE,
    );

    const { data: publisherStats } = useQuery<
        PublisherStatsQuery,
        PublisherStatsQueryVariables
    >(PUBLISHER_STATS);

    const orderSummary = React.useMemo(
        () => {
            // FIXME: we should not need to cast this
            const filteredStats = publisherStats?.orderStat?.stat
                ?.filter((v) => isDefined(v.orderPlacedAtDate)) as ChartData[] | undefined | null;

            return (filteredStats ?? []).map((v) => ({
                ...v,
                orderPlacedAt: new Date(v.orderPlacedAtDate).getTime(),
            })).sort((a, b) => compareDate(a.orderPlacedAtDate, b.orderPlacedAtDate));
        },
        [publisherStats],
    );

    const [
        editProfileModalShown,
        showEditProfileModal,
        hideEditProfileModal,
    ] = useModalState(false);

    const publisherDetails = {
        ...profileDetails?.me?.publisher,
        municipality: profileDetails?.me?.publisher?.municipality.id,
    };

    return (
        <div className={_cs(styles.publisherProfile, className)}>
            <div className={styles.pageContainer}>
                { loading && <PendingMessage />}
                <Container
                    className={styles.profileDetails}
                    contentClassName={styles.profileDetailsContent}
                    spacing="comfortable"
                    heading={strings.profileDetailsHeading}
                    headerActions={(
                        <Button
                            name={undefined}
                            variant="general"
                            onClick={showEditProfileModal}
                            icons={<IoPencil />}
                        >
                            {strings.editProfileButtonContent}
                        </Button>
                    )}
                >
                    <div className={styles.schoolDetails}>
                        <div className={styles.displayPicture}>
                            {profileDetails?.me?.image?.url ? (
                                <img
                                    className={styles.image}
                                    src={profileDetails.me.image.url}
                                    alt={profileDetails.me.image.name ?? ''}
                                />
                            ) : (
                                <IoPerson className={styles.fallbackIcon} />
                            )}
                        </div>
                        <div className={styles.attributes}>
                            <TextOutput
                                spacing="none"
                                block
                                valueContainerClassName={styles.value}
                                label={strings.publisherNameLabel}
                                value={profileDetails?.me?.publisher?.name}
                            />
                            <TextOutput
                                spacing="none"
                                block
                                valueContainerClassName={styles.value}
                                label={strings.emailLabel}
                                value={profileDetails?.me?.email}
                            />
                            <TextOutput
                                spacing="none"
                                block
                                valueContainerClassName={styles.value}
                                label={strings.phoneNumberLabel}
                                value={profileDetails?.me?.phoneNumber ?? 'Not available'}
                            />
                            {/* NOTE: empty div only for gap */}
                            <div>
                                &nbsp;
                            </div>
                            <TextOutput
                                label={strings.addressLabel}
                                value={`${
                                    profileDetails
                                        ?.me
                                        ?.publisher
                                        ?.localAddress
                                }, ${
                                    profileDetails
                                        ?.me
                                        ?.publisher
                                        ?.municipality
                                        ?.district
                                        ?.name
                                }`}
                            />
                            <TextOutput
                                label={strings.wardNumberLabel}
                                value={profileDetails?.me?.publisher?.wardNumber}
                            />
                            <TextOutput
                                label={strings.panNumberLabel}
                                value={profileDetails?.me?.publisher?.panNumber}
                            />
                            <TextOutput
                                label={strings.vatNumberLabel}
                                value={profileDetails?.me?.publisher?.vatNumber}
                            />
                        </div>
                    </div>
                </Container>
                <Container
                    className={styles.orderSummary}
                    heading={strings.orderDetailsHeading}
                    spacing="comfortable"
                >
                    <ResponsiveContainer className={styles.chartContainer}>
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
                                    dataKey="orderPlacedAtDate"
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
                            <Message message="Chart not available" />
                        )}
                    </ResponsiveContainer>
                </Container>
                {editProfileModalShown && (
                    <EditPublisherProfileModal
                        onModalClose={hideEditProfileModal}
                        onEditSuccess={refetchProfileDetails}
                        profileDetails={publisherDetails}
                    />
                )}
            </div>
        </div>
    );
}

export default PublisherProfile;
