import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    Tabs,
    TabList,
    Tab,
    TabPanel,
} from '@the-deep/deep-ui';

import styles from './styles.css';

import Schools from './Schools';
import SchoolPayments from './SchoolPayments';
import PublisherPackages from './PublisherPackages';
import SchoolPackages from './SchoolPackages';
import MunicipalityPackages from './MunicipalityPackages';

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
                        name="publisher-packages"
                        className={styles.tabItem}
                        activeClassName={styles.active}
                    >
                        Publisher Packages
                    </Tab>
                    <Tab
                        name="school-packages"
                        className={styles.tabItem}
                        activeClassName={styles.active}
                    >
                        School Packages
                    </Tab>
                    <Tab
                        name="municipality-packages"
                        className={styles.tabItem}
                        activeClassName={styles.active}
                    >
                        Municipality Packages
                    </Tab>
                </TabList>
                <TabPanel
                    name="users"
                    className={styles.tabPanel}
                >
                    <Schools />
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
                    name="municipality-packages"
                    className={styles.tabPanel}
                >
                    <MunicipalityPackages />
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default Moderation;
