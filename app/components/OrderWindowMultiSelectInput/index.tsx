import React, { useState, useMemo } from 'react';
import {
    SearchMultiSelectInput,
    SearchMultiSelectInputProps,
} from '@the-deep/deep-ui';
import { useQuery, gql } from '@apollo/client';
import {
    OrderWindowOptionsQuery,
    OrderWindowOptionsQueryVariables,
    OrderWindowType,
} from '#generated/types';

import useDebouncedValue from '#hooks/useDebouncedValue';

export type SearchOrderWindowType = Pick<OrderWindowType, 'id' | 'title'>;

const ORDER_WINDOWS = gql`
    query OrderWindowOptions($search: String) {
         orderWindows(search: $search) {
             totalCount
             results {
                 id
                 title
                 type
                 endDate
                 startDate
             }
         }
    }
`;

type Def = { containerClassName?: string };
type OrderWindowMultiSelectInputProps<K extends string> = SearchMultiSelectInputProps<
    string,
    K,
    SearchOrderWindowType,
    Def,
    'onSearchValueChange' | 'searchOptions' | 'optionsPending' | 'keySelector' | 'labelSelector' | 'totalOptionsCount' | 'onShowDropdownChange'
>;

const keySelector = (d: SearchOrderWindowType) => d.id;

export function OrderWindowTitleSelector(m: SearchOrderWindowType) {
    return m.title;
}

function OrderWindowMultiSelectInput<K extends string>(
    props: OrderWindowMultiSelectInputProps<K>,
) {
    const {
        className,
        ...otherProps
    } = props;

    const [opened, setOpened] = useState(false);
    const [searchText, setSearchText] = useState<string>('');
    const debouncedSearchText = useDebouncedValue(searchText);

    const variables = useMemo(() => ({
        name: debouncedSearchText,
    }), [debouncedSearchText]);

    const {
        previousData,
        data = previousData,
        loading,
    } = useQuery<OrderWindowOptionsQuery, OrderWindowOptionsQueryVariables>(
        ORDER_WINDOWS,
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
            labelSelector={OrderWindowTitleSelector}
            onSearchValueChange={setSearchText}
            searchOptions={data?.orderWindows?.results}
            optionsPending={loading}
            totalOptionsCount={data?.orderWindows?.totalCount ?? undefined}
            onShowDropdownChange={setOpened}
        />
    );
}

export default OrderWindowMultiSelectInput;
