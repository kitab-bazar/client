import React, { useState, useMemo } from 'react';

import {
    SearchMultiSelectInput,
    SearchMultiSelectInputProps,
} from '@the-deep/deep-ui';
import { useQuery, gql } from '@apollo/client';

import {
    CategoryOptionsQuery,
    CategoryOptionsQueryVariables,
} from '#generated/types';

import useDebouncedValue from '#hooks/useDebouncedValue';

const CATEGORIES = gql`
    query CategoryOptions($search: String) {
        categories(name: $search) {
            results {
                id
                name
            }
            totalCount
        }
    }
`;

export type Category = NonNullable<NonNullable<NonNullable<CategoryOptionsQuery['categories']>['results']>[number]>;

type Def = { containerClassName?: string };
type CategoryMultiSelectInputProps<K extends string> = SearchMultiSelectInputProps<
    string,
    K,
    Category,
    Def,
    'onSearchValueChange' | 'searchOptions' | 'optionsPending' | 'keySelector' | 'labelSelector' | 'totalOptionsCount' | 'onShowDropdownChange'
>;

function keySelector(category: Category) {
    return category.id;
}

function labelSelector(category: Category) {
    return category.name;
}

function CategorySearchMultiSelectInput<K extends string>(
    props: CategoryMultiSelectInputProps<K>,
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

    const { data, loading } = useQuery<CategoryOptionsQuery, CategoryOptionsQueryVariables>(
        CATEGORIES,
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
            searchOptions={data?.categories?.results}
            optionsPending={loading}
            totalOptionsCount={data?.categories?.totalCount ?? undefined}
            onShowDropdownChange={setOpened}
        />
    );
}

export default CategorySearchMultiSelectInput;
