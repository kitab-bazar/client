import React, { useState } from 'react';
import {
    Tab,
    Tabs,
    TabPanel,
    TabList,
} from '@the-deep/deep-ui';

import Profile from './Profile';
import Books from './Books';
import styles from './styles.css';

function PublisherProfile() {
    const [activeTab, setActiveTab] = useState<'profile' | 'books' | 'orders' | undefined>('profile');
    return (
        <div className={styles.publisherProfile}>
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
                    <Profile />
                </TabPanel>
                <TabPanel name="books" className={styles.tabPanel}>
                    <Books />
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default PublisherProfile;
