import React, { useCallback, useState } from 'react';
import {
    Container,
    ListView,
    Pager,
} from '@the-deep/deep-ui';
import { _cs } from '@togglecorp/fujs';
import { gql, useQuery } from '@apollo/client';
import {
    MyNotificationsQuery,
    MyNotificationsQueryVariables,
} from '#generated/types';

import NotificationItem from './NotificationItem';

import styles from './styles.css';

const NOTIFICATIONS = gql`
query MyNotifications ($page: Int!, $pageSize: Int!){
    notifications(page: $page, pageSize: $pageSize) {
      results {
            title
            read
            id
            notificationType
            createdAt
            order {
                id
                orderCode
            }
        }
        unreadCount
        totalCount
        readCount
        pageSize
        page
    }
}
`;

const PAGE_SIZE = 25;

export type Notification = NonNullable<NonNullable<MyNotificationsQuery['notifications']>['results']>[number];

const notificationKeySelector = (n: Notification) => n.id;

interface Props {
    className?: string;
    onNotificationClose: () => void;
}

function Notifications(props: Props) {
    const {
        className,
        onNotificationClose,
    } = props;

    const [page, setPage] = useState<number>(1);

    const {
        data,
        loading,
        refetch,
        error,
    } = useQuery<MyNotificationsQuery, MyNotificationsQueryVariables>(
        NOTIFICATIONS,
        {
            variables: {
                page,
                pageSize: PAGE_SIZE,
            },
        },
    );

    const reloadNotifications = useCallback(() => {
        refetch({
            page,
            pageSize: PAGE_SIZE,
        });
        onNotificationClose();
    }, [page, refetch, onNotificationClose]);

    const notificationRendererParams = React.useCallback((_, n: Notification) => ({
        notification: n,
        onReload: reloadNotifications,
    }), [reloadNotifications]);

    const notifications = data?.notifications?.results ?? undefined;

    return (
        <Container
            className={_cs(styles.notifications, className)}
            heading="Notifications"
            spacing="none"
            headingSize="extraSmall"
            headerClassName={styles.header}
            borderBelowHeader
            footerActions={(
                <Pager
                    activePage={page}
                    itemsCount={(data?.notifications?.totalCount) ?? 0}
                    maxItemsPerPage={PAGE_SIZE}
                    onActivePageChange={setPage}
                    itemsPerPageControlHidden
                />
            )}
        >
            <ListView
                data={notifications}
                keySelector={notificationKeySelector}
                rendererParams={notificationRendererParams}
                renderer={NotificationItem}
                errored={!!error}
                pending={loading}
                filtered={false}
            />

        </Container>
    );
}

export default Notifications;
