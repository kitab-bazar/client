import React, { useState } from 'react';
import {
    Tab,
    Tabs,
    TabPanel,
    TabList,
    PendingMessage,
} from '@the-deep/deep-ui';
import { useQuery, gql } from '@apollo/client';
import {
    PublisherProfileQuery,
    PublisherProfileQueryVariables,
} from '#generated/types';

import Profile from './Profile';
import Books from './Books';
import Orders from './Orders';
import styles from './styles.css';

const PUBLISHER_PROFILE = gql`
    query PublisherProfile {
        me {
            id
            firstName
            lastName
            fullName
            phoneNumber
            email
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

export type ProfileDetails = NonNullable<NonNullable<PublisherProfileQuery>['me']>;

function PublisherProfile() {
    const [activeTab, setActiveTab] = useState<'profile' | 'books' | 'orders' | undefined>('profile');

    const {
        data: profileDetails,
        refetch: refetchProfileDetails,
        loading,
    } = useQuery<PublisherProfileQuery, PublisherProfileQueryVariables>(
        PUBLISHER_PROFILE,
    );

    return (
        <div className={styles.publisherProfile}>
            { loading && (<PendingMessage />)}
            <Tabs
                value={activeTab}
                onChange={setActiveTab}
            >
                <TabList
                    className={styles.tabList}
                >
                    <Tab name="profile">
                        Profile
                    </Tab>
                    <Tab name="books">
                        Books
                    </Tab>
                    <Tab name="orders">
                        Orders
                    </Tab>
                </TabList>
                <TabPanel name="profile" className={styles.tabPanel}>
                    <Profile
                        profileDetails={profileDetails?.me ?? undefined}
                        onEditSuccess={refetchProfileDetails}
                    />
                </TabPanel>
                <TabPanel name="books" className={styles.tabPanel}>
                    <Books
                        publisherId={profileDetails?.me?.publisher?.id}
                    />
                </TabPanel>
                <TabPanel name="orders" className={styles.tabPanel}>
                    <Orders />
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default PublisherProfile;
