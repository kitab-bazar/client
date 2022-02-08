import React, { useMemo, useCallback } from 'react';
import { _cs } from '@togglecorp/fujs';
import { Message } from '@the-deep/deep-ui';

import { notifications } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import { resolveToComponent } from '#base/utils/lang';
import routes from '#base/configs/routes';
import SmartButtonLikeLink from '#base/components/SmartButtonLikeLink';

import { Notification } from '../index';
import NotificationContainer from '../NotificationContainer';

import styles from './styles.css';

interface Props {
    className?: string;
    notification: Notification;
    onClick: (id: string) => void;
}

function NotificationItem(props: Props) {
    const {
        notification,
        onClick,
        className,
    } = props;

    const {
        title,
        id,
    } = notification;
    const strings = useTranslation(notifications);

    const handleOnClick = useCallback(() => {
        onClick(id);
    }, [id, onClick]);

    const orderLink = useMemo(() => (
        notification.order ? (
            <SmartButtonLikeLink
                route={routes.orderList}
                state={{ orderId: order.orderCode }}
            >
                View details
            </SmartButtonLikeLink>
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
            onReload={handleOnClick}
        />
    );
}

export default NotificationItem;
