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
        }
    }
`;

function getDisplayName(data: NonNullable<MeQuery['me']>) {
    if (data.userType === 'ADMIN' || data.userType === 'INDIVIDUAL_USER') {
        if (!data.firstName || !data.lastName) {
            return data.email;
        }

        return [
            data.firstName,
            data.lastName,
        ].filter(Boolean).join(' ');
    }

    return data?.institution?.name
        ?? data?.publisher?.name
        ?? data?.school?.name ?? 'Unnamed';
}

interface Props {
    className?: string;
    children: React.ReactNode;
}
function Init(props: Props) {
    const {
        className,
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
                className={className}
                heading="Oh no!"
                content="Some error occurred"
            />
        );
    }
    if (!ready) {
        return (
            <PreloadMessage
                className={className}
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
