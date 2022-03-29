import React, { useCallback } from 'react';
import { _cs, isDefined } from '@togglecorp/fujs';
import { gql, useMutation } from '@apollo/client';
import {
    IoCheckmark,
    IoArrowUndoSharp,
} from 'react-icons/io5';
import {
    QuickActionButton,
    useAlert,
    Container,
    DateOutput,
} from '@the-deep/deep-ui';
import {
    removeNull,
    internal,
} from '@togglecorp/toggle-form';

// import Avatar from '#components/Avatar';

import {
    NotificationStatusUpdateMutation,
    NotificationStatusUpdateMutationVariables,
} from '#generated/types';
import { transformToFormError, ObjectError } from '#base/utils/errorTransform';
import useTranslation from '#base/hooks/useTranslation';
import { notifications } from '#base/configs/lang';
import { resolveToString } from '#base/utils/lang';
import ErrorMessage from '#components/ErrorMessage';

import { Notification } from '../index';

import styles from './styles.css';

const NOTIFICATION_STATUS_UPDATE = gql`
mutation NotificationStatusUpdate($notificationId: ID!, $read: Boolean!) {
    toggleNotification(
        id: $notificationId,
        data: { read: $read },
    ) {
        ok
        errors
        result {
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
    }
}
`;

interface Props {
    className?: string;
    content?: React.ReactNode;
    notification: Omit<Notification, 'notificationType'>;
}

function NotificationContainer(props: Props) {
    const {
        content,
        className,
        notification: {
            id: notificationId,
            createdAt,
            read,
        },
    } = props;

    const alert = useAlert();
    const strings = useTranslation(notifications);

    const [
        updateStatus,
        { loading },
    ] = useMutation<NotificationStatusUpdateMutation, NotificationStatusUpdateMutationVariables>(
        NOTIFICATION_STATUS_UPDATE,
        {
            // FIXME: it's better to import the query instead as this name can
            // change
            refetchQueries: ['UserNotificationsCount'],
            onCompleted: (response) => {
                if (response?.toggleNotification?.ok) {
                    const newStatus = response.toggleNotification?.result?.read
                        ? strings.readStatus : strings.unseenStatus;
                    alert.show(
                        resolveToString(
                            strings.notificationStatusUpdateSuccessMessage,
                            { newStatus },
                        ),
                        { variant: 'success' },
                    );
                } else if (response?.toggleNotification?.errors) {
                    const transformedError = transformToFormError(
                        removeNull(response?.toggleNotification?.errors) as ObjectError[],
                    );
                    alert.show(
                        <ErrorMessage
                            header={strings.notificationStatusUpdateFaillureMessage}
                            description={
                                isDefined(transformedError)
                                    ? transformedError[internal]
                                    : undefined
                            }
                        />,
                        { variant: 'error' },
                    );
                }
            },

            onError: (errors) => {
                alert.show(
                    <ErrorMessage
                        header={strings.notificationStatusUpdateFaillureMessage}
                        description={errors.message}
                    />,
                    { variant: 'error' },
                );
            },
        },
    );

    const handleUnseenClick = useCallback(() => {
        updateStatus({
            variables: {
                notificationId,
                read: false,
            },
        });
    }, [updateStatus, notificationId]);

    const handleSeenClick = useCallback(() => {
        updateStatus({
            variables: {
                notificationId,
                read: true,
            },
        });
    }, [updateStatus, notificationId]);

    return (
        <Container
            className={_cs(
                className,
                styles.notificationContainer,
                read && styles.seenNotification,
            )}
            contentClassName={styles.content}
        >
            {/*
            <Avatar
                className={styles.displayPicture}
                // NOTE: We'll add user profiles later after we fix it from server side
                src={undefined}
                name={userName}
            />
            */}
            <div className={styles.midContainer}>
                <div className={styles.mainText}>
                    {content}
                </div>
                <div className={styles.dateContainer}>
                    <DateOutput
                        format="dd-MM-yyyy at hh:mm aaa"
                        value={createdAt}
                    />
                </div>
            </div>
            <QuickActionButton
                name={undefined}
                className={styles.button}
                title={read ? 'Mark as unread' : 'Mark as read'}
                onClick={read ? handleUnseenClick : handleSeenClick}
                disabled={loading}
            >
                {read ? <IoArrowUndoSharp /> : <IoCheckmark />}
            </QuickActionButton>
        </Container>
    );
}

export default NotificationContainer;
