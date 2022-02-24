import React, { useContext, useState } from 'react';

import { useQuery, gql } from '@apollo/client';

import {
    removeNull,
} from '@togglecorp/toggle-form';

import { UserContext } from '#base/context/UserContext';
import PreloadMessage from '#base/components/PreloadMessage';

import { checkErrorCode } from '#base/utils/apollo';
import { MeQuery, MeQueryVariables, OrderWindowQuery } from '#generated/types';

const ME = gql`
    query Me {
        me {
            email
            firstName
            id
            canonicalName
            isActive
            lastLogin
            lastName
            userType
            institution {
                id
                name
            }
            publisher {
                id
                name
            }
            school {
                id
                name
            }
            allowedPermissions
        }
    }
`;

const ORDER_WINDOW = gql`
    query OrderWindow {
        orderWindowActive {
            id
            startDate
            endDate
        }
    }
`;

interface Props {
    preloadClassName?: string;
    children: React.ReactNode;
}
function Init(props: Props) {
    const {
        preloadClassName,
        children,
    } = props;

    const [ready, setReady] = useState(false);
    const [errored, setErrored] = useState(false);

    const {
        authenticated,
        setUser,
        setOrderWindow,
    } = useContext(UserContext);

    useQuery<OrderWindowQuery>(
        ORDER_WINDOW,
        {
            fetchPolicy: 'network-only',
            // NOTE: only call if user is authenticated
            // NOTE: also re-triggers request when logged-in user changes
            skip: !authenticated,
            onCompleted: (data) => {
                const orderWindow = removeNull(data.orderWindowActive);
                setOrderWindow(orderWindow);
            },
        },
    );

    useQuery<MeQuery, MeQueryVariables>(
        ME,
        {
            fetchPolicy: 'network-only',
            onCompleted: (data) => {
                const safeMe = removeNull(data.me);
                if (safeMe) {
                    setUser({
                        id: safeMe.id,
                        displayName: safeMe.canonicalName,
                        displayPictureUrl: undefined,
                        type: safeMe.userType,
                        permissions: safeMe.allowedPermissions,
                        publisherId: safeMe.publisher?.id,
                    });
                } else {
                    setUser(undefined);
                }
                setReady(true);
            },
            onError: (error) => {
                const { graphQLErrors } = error;
                const authError = checkErrorCode(
                    graphQLErrors,
                    ['me'],
                    '401',
                );

                setErrored(!authError);
                setUser(undefined);
                setReady(true);
            },
        },
    );

    if (errored) {
        return (
            <PreloadMessage
                className={preloadClassName}
                heading="Oh no!"
                content="Some error occurred"
            />
        );
    }
    if (!ready) {
        return (
            <PreloadMessage
                className={preloadClassName}
                content="Checking user session..."
            />
        );
    }

    return (
        <>
            {children}
        </>
    );
}

export default Init;
