import React, { useState } from 'react';
import {
    SelectInput,
    SelectInputProps,
} from '@the-deep/deep-ui';
import {
    useQuery,
    gql,
} from '@apollo/client';
import {
    PublishersQuery,
    PublishersQueryVariables,
    PublisherType,
} from '#generated/types';

const PUBLISHSERS = gql`
    query Publishers {
        publishers {
            results {
                id
                name
            }
            totalCount
        }
    }
`;

export type PublisherTypeMini = Pick<PublisherType, 'id' | 'name'>;
type Def = { containerClassName?: string };
type PublisherSelectInputProps<K extends string> = SelectInputProps<
    string,
    K,
    PublisherTypeMini,
    Def
    >;

function PublisherSelectInput<K extends string>(props: PublisherSelectInputProps<K>) {
    const {
        onOptionsChange,
    } = props;
    const [opened, setOpened] = useState(false);

    const {
        previousData,
        data = previousData,
        loading,
    } = useQuery<PublishersQuery, PublishersQueryVariables>(
        PUBLISHSERS,
        {
            skip: !opened,
            onCompleted: (response) => {
                if (!response.publishers) {
                    return;
                }
                if (onOptionsChange) {
                    onOptionsChange(response.publishers.results);
                }
            },
        },
    );

    return (
        <SelectInput
            {...props}
            optionsPending={loading}
            totalOptionsCount={data?.publishers?.totalCount ?? undefined}
            onShowDropdownChange={setOpened}
        />
    );
}
export default PublisherSelectInput;
