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
    Button,
    TextOutput,
    useModalState,
    Link,
} from '@the-deep/deep-ui';

import {
    ProfileDetailsQuery,
    ProfileDetailsQueryVariables,
} from '#generated/types';

import { profile } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';

import UpdateInstitutionDetailModal from './UpdateInstitutionDetailModal';
import OrderList from './OrderList';
import SchoolPayments from './SchoolPayments';
import InstitutionPayments from './InstitutionPayments';
import PackageList from './PackageList';

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
        institution {
            id
            name
            panNumber
            vatNumber
            localAddress
            libraryUrl
            logoUrl
            websiteUrl
            wardNumber
            municipality {
                id
            }
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
        profileDetails = userDetails.institution;
        nameLabel = strings.institution;
    }

    const [
        updateInstitutionDetailModalShown,
        showUpdateInstitutionDetailModal,
        hideUpdateInstitutionDetailModal,
    ] = useModalState(false);

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
                                        {(
                                            userDetails.userType === 'PUBLISHER'
                                            || userDetails.userType === 'SCHOOL_ADMIN'
                                            || userDetails.userType === 'INSTITUTIONAL_USER'
                                        ) && (
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
                                        {(
                                            userDetails.userType === 'SCHOOL_ADMIN'
                                            || userDetails.userType === 'INSTITUTIONAL_USER'
                                        ) && (
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
                                            {userDetails.userType === 'INSTITUTIONAL_USER' && (
                                                <Button
                                                    className={styles.button}
                                                    name={undefined}
                                                    onClick={showUpdateInstitutionDetailModal}
                                                    variant="primary"
                                                >
                                                    {strings.updateInstitutionDetail}
                                                </Button>
                                            )}
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
                                            {(
                                                userDetails.userType === 'PUBLISHER'
                                                || userDetails.userType === 'SCHOOL_ADMIN'
                                            ) && (
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
                                            {userDetails?.institution?.websiteUrl && (
                                                <AboutOutput
                                                    label={strings.websiteUrl}
                                                    value={(
                                                        <Link
                                                            to={userDetails.institution.websiteUrl}
                                                        >
                                                            {userDetails.institution.websiteUrl}
                                                        </Link>
                                                    )}
                                                />
                                            )}
                                            {userDetails?.institution?.libraryUrl && (
                                                <AboutOutput
                                                    label={strings.libraryUrl}
                                                    value={(
                                                        <Link
                                                            to={userDetails.institution.libraryUrl}
                                                        >
                                                            {userDetails.institution.libraryUrl}
                                                        </Link>
                                                    )}
                                                />
                                            )}
                                        </div>
                                    </TabPanel>
                                    {(
                                        userDetails.userType === 'PUBLISHER'
                                        || userDetails.userType === 'SCHOOL_ADMIN'
                                        || userDetails.userType === 'INSTITUTIONAL_USER'
                                    ) && (
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
                                            <PackageList />
                                        </TabPanel>
                                    )}
                                    {(
                                        userDetails.userType === 'SCHOOL_ADMIN'
                                    ) && (
                                        <TabPanel
                                            name="payments"
                                            className={styles.tabContent}
                                        >
                                            <SchoolPayments />
                                        </TabPanel>
                                    )}
                                    {(
                                        userDetails.userType === 'INSTITUTIONAL_USER'
                                    ) && (
                                        <TabPanel
                                            name="payments"
                                            className={styles.tabContent}
                                        >
                                            <InstitutionPayments />
                                        </TabPanel>
                                    )}
                                    {updateInstitutionDetailModalShown
                                        && userDetails.institution && (
                                        <UpdateInstitutionDetailModal
                                            institution={userDetails.institution}
                                            onModalClose={hideUpdateInstitutionDetailModal}
                                        />
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
