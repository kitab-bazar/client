import React, { useState, useMemo } from 'react';

import {
    SearchMultiSelectInput,
    SearchMultiSelectInputProps,
} from '@the-deep/deep-ui';
import { useQuery, gql } from '@apollo/client';

import {
    AuthorOptionsQuery,
    AuthorOptionsQueryVariables,
} from '#generated/types';

import useDebouncedValue from '#hooks/useDebouncedValue';

const AUTHORS = gql`
    query AuthorOptions($search: String) {
        authors(name: $search) {
            results {
                id
                name
            }
            totalCount
        }
    }
`;

export type Author = NonNullable<NonNullable<NonNullable<AuthorOptionsQuery['authors']>['results']>[number]>;

type Def = { containerClassName?: string };
type AuthorMultiSelectInputProps<K extends string> = SearchMultiSelectInputProps<
    string,
    K,
    Author,
    Def,
    'onSearchValueChange' | 'searchOptions' | 'optionsPending' | 'keySelector' | 'labelSelector' | 'totalOptionsCount' | 'onShowDropdownChange'
>;

function keySelector(author: Author) {
    return author.id;
}

function labelSelector(author: Author) {
    return author.name;
}

function AuthorSearchMultiSelectInput<K extends string>(
    props: AuthorMultiSelectInputProps<K>,
) {
    const {
        className,
        ...otherProps
    } = props;

    const [opened, setOpened] = useState(false);
    const [searchText, setSearchText] = useState<string>('');
    const debouncedSearchText = useDebouncedValue(searchText);

    const variables = useMemo(() => ({
        search: debouncedSearchText,
    }), [debouncedSearchText]);

    const { data, loading } = useQuery<AuthorOptionsQuery, AuthorOptionsQueryVariables>(
        AUTHORS,
        {
            variables,
            skip: !opened,
        },
    );

    return (
        <SearchMultiSelectInput
            {...otherProps}
            className={className}
            keySelector={keySelector}
            labelSelector={labelSelector}
            onSearchValueChange={setSearchText}
            searchOptions={data?.authors?.results}
            optionsPending={loading}
            totalOptionsCount={data?.authors?.totalCount ?? undefined}
            onShowDropdownChange={setOpened}
        />
    );
}

export default AuthorSearchMultiSelectInput;
