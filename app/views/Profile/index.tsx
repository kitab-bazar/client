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

import OrderList from './OrderList';

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
        school {
            id
            name
            vatNumber
            panNumber
            localAddress
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

    const {
        loading,
        data: profileData,
    } = useQuery<ProfileDetailsQuery, ProfileDetailsQueryVariables>(
        PROFILE_DETAILS,
    );

    const userDetails = profileData?.me;
    let profileDetails;
    if (userDetails?.userType === 'SCHOOL_ADMIN') {
        profileDetails = userDetails?.school;
    }

    if (userDetails?.userType === 'PUBLISHER') {
        profileDetails = userDetails?.publisher;
    }

    return (
        <div className={_cs(styles.profile, className)}>
            {loading && <PendingMessage />}
            {!loading && userDetails && profileDetails ? (
                <>
                    <div className={styles.pageHeader}>
                        <div className={styles.pageContainer}>
                            <div className={styles.headerContent}>
                                <div className={styles.displayPictureContainer}>
                                    <IoPerson className={styles.fallbackIcon} />
                                </div>
                                <Header
                                    className={styles.header}
                                    heading={profileDetails.name}
                                >
                                    {profileDetails.localAddress}
                                </Header>
                            </div>
                        </div>
                    </div>
                    <div className={styles.pageContent}>
                        <Tabs
                            useHash
                            initialHash="about"
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
                                            About
                                        </Tab>
                                        <Tab
                                            activeClassName={styles.active}
                                            className={styles.tabItem}
                                            name="orders"
                                        >
                                            Orders
                                        </Tab>
                                        <Tab
                                            activeClassName={styles.active}
                                            className={styles.tabItem}
                                            name="packages"
                                        >
                                            Packages
                                        </Tab>
                                    </TabList>
                                    <TabPanel
                                        name="about"
                                        className={styles.tabContent}
                                    >
                                        <div className={styles.about}>
                                            <AboutOutput
                                                label="School Name"
                                                value={profileDetails.name}
                                            />
                                            <AboutOutput
                                                label="Email"
                                                value={userDetails.email}
                                            />
                                            <AboutOutput
                                                label="Phone Number"
                                                value={userDetails.phoneNumber}
                                            />
                                            <AboutOutput
                                                label="Address"
                                                value={profileDetails.localAddress}
                                            />
                                            {profileDetails?.vatNumber ? (
                                                <AboutOutput
                                                    label="VAT No."
                                                    value={profileDetails.vatNumber}
                                                />
                                            ) : (
                                                <AboutOutput
                                                    label="PAN"
                                                    value={profileDetails.panNumber}
                                                />
                                            )}
                                        </div>
                                    </TabPanel>
                                    <TabPanel
                                        name="orders"
                                        className={styles.tabContent}
                                    >
                                        <OrderList
                                            className={styles.orderList}
                                        />
                                    </TabPanel>
                                    <TabPanel
                                        name="packages"
                                        className={styles.tabContent}
                                    >
                                        Packages
                                    </TabPanel>
                                </div>
                            </div>
                        </Tabs>
                    </div>
                </>
            ) : (
                <Message
                    message="Failed to load the profile"
                />
            )}
        </div>
    );
}

export default Profile;
