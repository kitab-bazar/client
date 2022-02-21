import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    ListView,
    TextOutput,
} from '@the-deep/deep-ui';
import {
    gql,
    useQuery,
} from '@apollo/client';

import EmptyMessage from '#components/EmptyMessage';

import {
    SchoolListQuery,
    SchoolListQueryVariables,
} from '#generated/types';

import styles from './styles.css';

const SCHOOL_LIST = gql`
query SchoolList {
    users {
        results {
            id
            userType
            school {
                id
                name
                localAddress
                vatNumber
                panNumber
                wardNumber
                municipality {
                    id
                    name
                    district {
                        id
                        name
                    }
                }
            }
        }
    }
}
`;

type SchoolItem = NonNullable<NonNullable<SchoolListQuery['users']>['results']>[number];

interface SchoolItemProps {
    user: SchoolItem;
}

function SchoolItem(props: SchoolItemProps) {
    const {
        user,
    } = props;

    const school = user?.school;

    if (!school) {
        return null;
    }

    return (
        <div className={styles.userItem}>
            <div className={styles.name}>
                {school.name}
            </div>
            <div className={styles.address}>
                {`${school.municipality.name}-${school.wardNumber}, ${school.municipality.district.name}`}
            </div>
            <div className={styles.localAddress}>
                {school.localAddress}
            </div>
            <TextOutput
                label="PAN"
                value={school.panNumber}
            />
        </div>
    );
}

const keySelector = (u: { id: string}) => u.id;

interface Props {
    className?: string;
}

function Schools(props: Props) {
    const { className } = props;
    const {
        data,
        loading,
        error,
    } = useQuery<SchoolListQuery, SchoolListQueryVariables>(
        SCHOOL_LIST,
    );

    const userItemRendererParams = React.useCallback(
        (_: string, user: SchoolItem): SchoolItemProps => ({
            user,
        }),
        [],
    );

    return (
        <div
            className={_cs(styles.users, className)}
        >
            <ListView
                data={data?.users?.results}
                pending={loading}
                rendererParams={userItemRendererParams}
                renderer={SchoolItem}
                keySelector={keySelector}
                errored={!!error}
                filtered={false}
                emptyMessage={(
                    <EmptyMessage
                        message="Couldn't find any user"
                        suggestion="There aren't any user at the moment"
                    />
                )}
            />
        </div>
    );
}

export default Schools;
