import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    Tabs,
    TabList,
    Tab,
    TabPanel,
} from '@the-deep/deep-ui';

import Schools from './Schools';
import Institutions from './Institutions';
import Payments from './Payments';
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
                defaultHash="schools"
                variant="secondary"
            >
                <TabList className={styles.tabList}>
                    <Tab
                        name="schools"
                        className={styles.tabItem}
                        activeClassName={styles.active}
                    >
                        Schools
                    </Tab>
                    <Tab
                        name="institutions"
                        className={styles.tabItem}
                        activeClassName={styles.active}
                    >
                        Institutions
                    </Tab>
                    <Tab
                        name="payments"
                        className={styles.tabItem}
                        activeClassName={styles.active}
                    >
                        Payments
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
                    name="schools"
                    className={styles.tabPanel}
                >
                    <Schools />
                </TabPanel>
                <TabPanel
                    name="institutions"
                    className={styles.tabPanel}
                >
                    <Institutions />
                </TabPanel>
                <TabPanel
                    name="orders"
                    className={styles.tabPanel}
                >
                    <Orders />
                </TabPanel>
                <TabPanel
                    name="payments"
                    className={styles.tabPanel}
                >
                    <Payments />
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
