import React, { useMemo, useCallback } from 'react';
import { _cs } from '@togglecorp/fujs';
import { Message } from '@the-deep/deep-ui';

import { notifications } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import { resolveToComponent } from '#base/utils/lang';
import routes from '#base/configs/routes';
import SmartLink from '#base/components/SmartLink';

import { Notification } from '../index';
import NotificationContainer from '../NotificationContainer';

import styles from './styles.css';

interface Props {
    className?: string;
    notification: Notification;
    onReload: (id: string) => void;
}

function NotificationItem(props: Props) {
    const {
        notification,
        onReload,
        className,
    } = props;

    const {
        title,
        id,
    } = notification;
    const strings = useTranslation(notifications);

    const handleOnReloadClick = useCallback(() => {
        onReload(id);
    }, [id, onReload]);

    const orderLink = useMemo(() => (
        notification.order ? (
            <SmartLink
                route={routes.orderList}
                // state={{ orderId: notification.order.orderCode }}
            >
                {`order #${notification.order.orderCode.split('-')[0]}`}
            </SmartLink>
        ) : undefined
    ), [notification.order]);

    if (notification.notificationType === 'ORDER_RECEIVED') {
        return (
            <NotificationContainer
                notification={notification}
                content={resolveToComponent(
                    strings.newOrderReceived,
                    { orderLink },
                )}
            />
        );
    }

    if (notification.notificationType === 'ORDER_CANCELLED') {
        return (
            <NotificationContainer
                notification={notification}
                content={resolveToComponent(
                    strings.orderCancelled,
                    { orderLink },
                )}
            />
        );
    }

    if (notification.notificationType === 'ORDER_PACKED') {
        return (
            <NotificationContainer
                notification={notification}
                content={resolveToComponent(
                    strings.orderPacked,
                    { orderLink },
                )}
            />
        );
    }

    if (notification.notificationType === 'ORDER_COMPLETED') {
        return (
            <NotificationContainer
                notification={notification}
                content={resolveToComponent(
                    strings.orderCompleted,
                    { orderLink },
                )}
            />
        );
    }

    if (notification.notificationType === 'GENERAL') {
        return (
            <NotificationContainer
                notification={notification}
                content={notification.title}
            />
        );
    }

    return (
        <Message
            className={_cs(className, styles.notificationItem)}
            message={title}
            onReload={handleOnReloadClick}
        />
    );
}

export default NotificationItem;
