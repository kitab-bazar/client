import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { _cs } from '@togglecorp/fujs';
import { IoPerson } from 'react-icons/io5';
import {
    Tabs,
    TabList,
    Tab,
    TabPanel,
    Header,
    PendingMessage,
    Message,
    TextOutput,
} from '@the-deep/deep-ui';

import {
    ProfileDetailsQuery,
    ProfileDetailsQueryVariables,
} from '#generated/types';

import { profile } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';

import OrderList from './OrderList';
import SchoolPayments from './SchoolPayments';

import styles from './styles.css';

interface AboutOutputProps {
    label: React.ReactNode;
    value: React.ReactNode;
}
function AboutOutput(props: AboutOutputProps) {
    const {
        label,
        value,
    } = props;

    return (
        <TextOutput
            className={styles.aboutOutput}
            labelContainerClassName={styles.label}
            valueContainerClassName={styles.value}
            label={label}
            value={value}
        />
    );
}

const PROFILE_DETAILS = gql`
query ProfileDetails {
    me {
        id
        userType
        phoneNumber
        email
        canonicalName
        school {
            id
            name
            vatNumber
            panNumber
            localAddress
            schoolId
        }
        publisher {
            id
            name
            vatNumber
            panNumber
            localAddress
        }
    }
}
`;

interface Props {
    className?: string,
}

function Profile(props: Props) {
    const { className } = props;
    const strings = useTranslation(profile);

    const {
        loading,
        data: profileData,
    } = useQuery<ProfileDetailsQuery, ProfileDetailsQueryVariables>(
        PROFILE_DETAILS,
    );

    const userDetails = profileData?.me;
    let nameLabel;

    let profileDetails;
    if (userDetails?.userType === 'SCHOOL_ADMIN') {
        profileDetails = userDetails?.school;
        nameLabel = strings.schoolNameLabel;
    } else if (userDetails?.userType === 'PUBLISHER') {
        profileDetails = userDetails?.publisher;
        nameLabel = strings.publisherNameLabel;
    } else if (userDetails?.userType === 'INSTITUTIONAL_USER') {
        profileDetails = userDetails?.publisher;
        nameLabel = strings.publisherNameLabel;
    }

    return (
        <div className={_cs(styles.profile, className)}>
            {loading && <PendingMessage />}
            {!loading && userDetails ? (
                <>
                    <div className={styles.pageHeader}>
                        <div className={styles.pageContainer}>
                            <div className={styles.headerContent}>
                                <div className={styles.displayPictureContainer}>
                                    <IoPerson className={styles.fallbackIcon} />
                                </div>
                                <Header
                                    className={styles.header}
                                    heading={userDetails.canonicalName}
                                >
                                    {profileDetails?.localAddress}
                                </Header>
                            </div>
                        </div>
                    </div>
                    <div className={styles.pageContent}>
                        <Tabs
                            useHash
                            defaultHash="about"
                            variant="secondary"
                        >
                            <div className={styles.pageContainer}>
                                <div className={styles.mainContent}>
                                    <TabList className={styles.tabList}>
                                        <Tab
                                            activeClassName={styles.active}
                                            className={styles.tabItem}
                                            name="about"
                                        >
                                            {strings.aboutTabLabel}
                                        </Tab>
                                        {(userDetails.userType === 'PUBLISHER' || userDetails.userType === 'SCHOOL_ADMIN') && (
                                            <Tab
                                                activeClassName={styles.active}
                                                className={styles.tabItem}
                                                name="orders"
                                            >
                                                {strings.ordersTabLabel}
                                            </Tab>
                                        )}
                                        {userDetails.userType === 'PUBLISHER' && (
                                            <Tab
                                                activeClassName={styles.active}
                                                className={styles.tabItem}
                                                name="packages"
                                            >
                                                {strings.packagesTabLabel}
                                            </Tab>
                                        )}
                                        {userDetails.userType === 'SCHOOL_ADMIN' && (
                                            <Tab
                                                activeClassName={styles.active}
                                                className={styles.tabItem}
                                                name="payments"
                                            >
                                                {strings.paymentsTabLabel}
                                            </Tab>
                                        )}
                                        {userDetails.userType === 'INSTITUTIONAL_USER' && (
                                            <Tab
                                                activeClassName={styles.active}
                                                className={styles.tabItem}
                                                name="payments"
                                            >
                                                {strings.paymentsTabLabel}
                                            </Tab>
                                        )}
                                    </TabList>
                                    <TabPanel
                                        name="about"
                                        className={styles.tabContent}
                                    >
                                        <div className={styles.about}>
                                            <AboutOutput
                                                label={nameLabel}
                                                value={userDetails.canonicalName}
                                            />
                                            <AboutOutput
                                                label={strings.emailLabel}
                                                value={userDetails.email}
                                            />
                                            <AboutOutput
                                                label={strings.phoneNumberLabel}
                                                value={userDetails.phoneNumber}
                                            />
                                            <AboutOutput
                                                label={strings.addressLabel}
                                                value={profileDetails?.localAddress}
                                            />
                                            {userDetails?.publisher && (
                                                <AboutOutput
                                                    label={strings.vatNumberLabel}
                                                    value={userDetails.publisher.vatNumber}
                                                />
                                            )}
                                            {(userDetails.userType === 'PUBLISHER' || userDetails.userType === 'SCHOOL_ADMIN') && (
                                                <AboutOutput
                                                    label={strings.panLabel}
                                                    value={profileDetails?.panNumber}
                                                />
                                            )}
                                            {userDetails?.school && (
                                                <AboutOutput
                                                    label={strings.schoolIdLabel}
                                                    value={userDetails.school.schoolId}
                                                />
                                            )}
                                        </div>
                                    </TabPanel>
                                    {(userDetails.userType === 'PUBLISHER' || userDetails.userType === 'SCHOOL_ADMIN') && (
                                        <TabPanel
                                            name="orders"
                                            className={styles.tabContent}
                                        >
                                            <OrderList />
                                        </TabPanel>
                                    )}
                                    {userDetails.userType === 'PUBLISHER' && (
                                        <TabPanel
                                            name="packages"
                                            className={styles.tabContent}
                                        >
                                            Packages
                                        </TabPanel>
                                    )}
                                    {userDetails.userType === 'SCHOOL_ADMIN' && (
                                        <TabPanel
                                            name="payments"
                                            className={styles.tabContent}
                                        >
                                            <SchoolPayments />
                                        </TabPanel>
                                    )}
                                </div>
                            </div>
                        </Tabs>
                    </div>
                </>
            ) : (
                <Message
                    message={strings.profileLoadFailureMessage}
                />
            )}
        </div>
    );
}

export default Profile;
