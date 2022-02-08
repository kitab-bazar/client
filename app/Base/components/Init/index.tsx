import React, { useContext, useState } from 'react';

import { useQuery, gql } from '@apollo/client';

import {
    removeNull,
} from '@togglecorp/toggle-form';

import { UserContext } from '#base/context/UserContext';
import PreloadMessage from '#base/components/PreloadMessage';

import { checkErrorCode } from '#base/utils/apollo';
import { MeQuery, MeQueryVariables } from '#generated/types';

const ME = gql`
    query Me {
        me {
            email
            firstName
            id
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

// TODO: this should come from server or move to utils
function getDisplayName(data: NonNullable<MeQuery['me']>): string {
    if (data.userType === 'ADMIN' || data.userType === 'INDIVIDUAL_USER') {
        return [
            data.firstName,
            data.lastName,
        ].filter(Boolean).join(' ') || data.email;
    }
    if (data.userType === 'INSTITUTIONAL_USER') {
        return data.institution?.name || data.email;
    }
    if (data.userType === 'PUBLISHER') {
        return data.publisher?.name || data.email;
    }
    if (data.userType === 'SCHOOL_ADMIN') {
        return data.school?.name || data.email;
    }
    return data.email;
}

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
        setUser,
    } = useContext(UserContext);

    useQuery<MeQuery, MeQueryVariables>(
        ME,
        {
            fetchPolicy: 'network-only',
            onCompleted: (data) => {
                const safeMe = removeNull(data.me);
                if (safeMe) {
                    setUser({
                        id: safeMe.id,
                        displayName: getDisplayName(safeMe),
                        type: safeMe.userType,
                        permissions: safeMe.allowedPermissions,
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
