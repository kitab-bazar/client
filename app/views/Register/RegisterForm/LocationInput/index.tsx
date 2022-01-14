import React from 'react';
import {
    useQuery,
    useLazyQuery,
    gql,
} from '@apollo/client';
import { SelectInput } from '@the-deep/deep-ui';
import { isDefined } from '@togglecorp/fujs';

import {
    ProvinceListQuery,
    ProvinceListQueryVariables,
    DistrictListQuery,
    DistrictListQueryVariables,
    MunicipalityListQuery,
    MunicipalityListQueryVariables,
} from '#generated/types';

const PROVINCE_LIST = gql`
    query ProvinceList {
        provinces {
            results {
                id
                name
            }
            totalCount
        }
    }
`;

const DISTRICT_LIST = gql`
    query DistrictList($provinceIds: [ID!]) {
        districts(provinces: $provinceIds) {
            results {
                id
                name
            }
            totalCount
        }
    }
`;

const MUNICIPALITY_LIST = gql`
    query MunicipalityList(
        $provinceIds: [ID!],
        $districtIds: [ID!],
    ) {
        municipalities(
            provinces: $provinceIds,
            districts: $districtIds,
        ) {
            results {
                id
                name
            }
            totalCount
        }
    }
`;

type Province = NonNullable<NonNullable<ProvinceListQuery['provinces']>['results']>[number];
type District = NonNullable<NonNullable<DistrictListQuery['districts']>['results']>[number];
type Municipality = NonNullable<NonNullable<MunicipalityListQuery['municipalities']>['results']>[number];

const provinceKeySelector = (d: Province) => d.id;
const provinceLabelSelector = (d: Province) => d.name;

const districtKeySelector = (d: District) => d.id;
const districtLabelSelector = (d: District) => d.name;

const municipalityKeySelector = (d: Municipality) => d.id;
const municipalityLabelSelector = (d: Municipality) => d.name;

interface Props<K extends string> {
    name: K;
    onChange: (value: Municipality['id'] | undefined, name: K) => void;
    error?: string;
    disabled?: boolean;
}

function LocationInput<K extends string>(props: Props<K>) {
    const {
        name,
        onChange,
        error,
        disabled,
    } = props;

    const {
        data: provinceList,
        loading: provincesPending,
    } = useQuery<ProvinceListQuery, ProvinceListQueryVariables>(
        PROVINCE_LIST,
    );

    const [province, setProvince] = React.useState<Province['id'] | undefined>();
    const [district, setDistrict] = React.useState<District['id'] | undefined>();
    const [municipality, setMunicipality] = React.useState<Municipality['id'] | undefined>();

    const handleMunicipalityChange = React.useCallback((newMunicipality: Municipality['id'] | undefined) => {
        if (onChange) {
            onChange(newMunicipality, name);
            setMunicipality(newMunicipality);
        }
    }, [onChange, name, setMunicipality]);

    const districtVariables = React.useMemo(() => ({
        provinceIds: province ? [province] : undefined,
    }), [province]);

    const [
        loadDistricts,
        {
            data: districtList,
            loading: districtsPending,
        },
    ] = useLazyQuery<DistrictListQuery, DistrictListQueryVariables>(
        DISTRICT_LIST,
        { variables: districtVariables },
    );

    const handleProvinceChange = React.useCallback((newProvince: Province['id'] | undefined) => {
        setProvince(newProvince);
        if (isDefined(newProvince)) {
            loadDistricts();
        } else {
            setDistrict(undefined);
            handleMunicipalityChange(undefined);
        }
    }, [loadDistricts, handleMunicipalityChange]);

    const municipalityVariables = React.useMemo(() => ({
        provinceIds: province ? [province] : undefined,
        districtIds: district ? [district] : undefined,
    }), [province, district]);

    const [
        loadMunicipalities,
        {
            data: municipalityList,
            loading: municipalitiesPending,
        },
    ] = useLazyQuery<MunicipalityListQuery, MunicipalityListQueryVariables>(
        MUNICIPALITY_LIST,
        { variables: municipalityVariables },
    );

    const handleDistrictChange = React.useCallback((newDistrict: District['id'] | undefined) => {
        setDistrict(newDistrict);
        if (isDefined(newDistrict)) {
            loadMunicipalities();
        } else {
            handleMunicipalityChange(undefined);
        }
    }, [loadMunicipalities, handleMunicipalityChange]);

    return (
        <>
            <SelectInput
                label="Province"
                name="province"
                options={provinceList?.provinces?.results}
                keySelector={provinceKeySelector}
                labelSelector={provinceLabelSelector}
                value={province}
                onChange={handleProvinceChange}
                disabled={disabled || provincesPending}
            />
            <SelectInput
                label="District"
                name="district"
                options={districtList?.districts?.results}
                keySelector={districtKeySelector}
                labelSelector={districtLabelSelector}
                value={district}
                onChange={handleDistrictChange}
                disabled={disabled || !province || districtsPending || !districtList}
            />
            <SelectInput
                label="Municipality"
                name={municipality}
                options={municipalityList?.municipalities?.results}
                keySelector={municipalityKeySelector}
                labelSelector={municipalityLabelSelector}
                value={municipality}
                onChange={handleMunicipalityChange}
                disabled={disabled || !district || municipalitiesPending || !municipalityList}
                error={error}
            />
        </>
    );
}

export default LocationInput;
