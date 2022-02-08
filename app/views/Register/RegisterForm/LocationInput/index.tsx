import React, { useState, useMemo } from 'react';
import {
    useQuery,
    gql,
} from '@apollo/client';
import {
    SearchSelectInput,
    SearchSelectInputProps,
} from '@the-deep/deep-ui';

import {
    MunicipalityListQuery,
    MunicipalityListQueryVariables,
} from '#generated/types';

import useDebouncedValue from '#hooks/useDebouncedValue';

const MUNICIPALITY_LIST = gql`
    query MunicipalityList(
        $name: String,
        $ordering: String,
    ) {
        municipalities(
            name: $name,
            ordering: $ordering,
        ) {
            results {
                id
                name
                district {
                    id
                    name
                }
            }
            totalCount
        }
    }
`;

export type MunicipalityOption = NonNullable<NonNullable<MunicipalityListQuery['municipalities']>['results']>[number];

const keySelector = (d: MunicipalityOption) => d.id;
const labelSelector = (d: MunicipalityOption) => d.name;
const groupKeySelector = (d: MunicipalityOption) => d.district.id;
const groupLabelSelector = (d: MunicipalityOption) => d.district.name;

type Def = { containerClassName?: string };
type SelectInputProps<
    K extends string,
> = SearchSelectInputProps<
    string,
    K,
    MunicipalityOption,
    Def,
    'onSearchValueChange' | 'searchOptions' | 'optionsPending' | 'keySelector' | 'labelSelector' | 'totalCount'
>;

function LocationInput<K extends string>(props: SelectInputProps<K>) {
    const {
        className,
        ...otherProps
    } = props;

    const [searchText, setSearchText] = useState('');
    const [opened, setOpened] = useState(false);

    const debouncedSearchText = useDebouncedValue(searchText);

    const searchVariables = useMemo(
        (): MunicipalityListQueryVariables => (
            debouncedSearchText ? { name: debouncedSearchText } : { ordering: 'id' }
        ),
        [debouncedSearchText],
    );

    const {
        previousData,
        data = previousData,
        loading,
    } = useQuery<MunicipalityListQuery, MunicipalityListQueryVariables>(
        MUNICIPALITY_LIST,
        {
            variables: searchVariables,
            skip: !opened,
        },
    );

    const searchOptions = data?.municipalities?.results;
    const totalOptionsCount = data?.municipalities?.totalCount;

    return (
        <SearchSelectInput
            {...otherProps}
            className={className}
            keySelector={keySelector}
            labelSelector={labelSelector}
            groupKeySelector={groupKeySelector}
            groupLabelSelector={groupLabelSelector}
            grouped
            onSearchValueChange={setSearchText}
            onShowDropdownChange={setOpened}
            searchOptions={searchOptions}
            optionsPending={loading}
            totalOptionsCount={totalOptionsCount ?? undefined}
        />
    );
}

export default LocationInput;
