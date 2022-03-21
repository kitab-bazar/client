import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    Tabs,
    TabList,
    Tab,
    TabPanel,
} from '@the-deep/deep-ui';

import Schools from './Schools';
import SchoolPayments from './SchoolPayments';
import PublisherPackages from './PublisherPackages';
import SchoolPackages from './SchoolPackages';
import CourierPackages from './CourierPackages';
import Orders from './Orders';
import styles from './styles.css';

interface Props {
    className?: string;
}

function Moderation(props: Props) {
    const { className } = props;
    return (
        <div
            className={_cs(styles.moderation, className)}
        >
            <Tabs
                useHash
                defaultHash="users"
                variant="secondary"
            >
                <TabList className={styles.tabList}>
                    <Tab
                        name="users"
                        className={styles.tabItem}
                        activeClassName={styles.active}
                    >
                        Schools
                    </Tab>
                    <Tab
                        name="school-payments"
                        className={styles.tabItem}
                        activeClassName={styles.active}
                    >
                        School Payments
                    </Tab>
                    <Tab
                        name="orders"
                        className={styles.tabItem}
                        activeClassName={styles.active}
                    >
                        Orders
                    </Tab>
                    <Tab
                        name="school-packages"
                        className={styles.tabItem}
                        activeClassName={styles.active}
                    >
                        School Packages
                    </Tab>
                    <Tab
                        name="publisher-packages"
                        className={styles.tabItem}
                        activeClassName={styles.active}
                    >
                        Publisher Packages
                    </Tab>
                    <Tab
                        name="courier-packages"
                        className={styles.tabItem}
                        activeClassName={styles.active}
                    >
                        Courier Packages
                    </Tab>
                </TabList>
                <TabPanel
                    name="users"
                    className={styles.tabPanel}
                >
                    <Schools />
                </TabPanel>
                <TabPanel
                    name="orders"
                    className={styles.tabPanel}
                >
                    <Orders />
                </TabPanel>
                <TabPanel
                    name="school-payments"
                    className={styles.tabPanel}
                >
                    <SchoolPayments />
                </TabPanel>
                <TabPanel
                    name="publisher-packages"
                    className={styles.tabPanel}
                >
                    <PublisherPackages />
                </TabPanel>
                <TabPanel
                    name="school-packages"
                    className={styles.tabPanel}
                >
                    <SchoolPackages />
                </TabPanel>
                <TabPanel
                    name="courier-packages"
                    className={styles.tabPanel}
                >
                    <CourierPackages />
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default Moderation;
