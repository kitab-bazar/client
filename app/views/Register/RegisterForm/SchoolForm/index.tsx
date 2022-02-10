import React, { Dispatch, SetStateAction } from 'react';
import {
    TextInput,
    NumberInput,
} from '@the-deep/deep-ui';
import {
    getErrorObject,
    useFormObject,
    PartialForm,
    Error,
    SetValueArg,
} from '@togglecorp/toggle-form';

import NonFieldError from '#components/NonFieldError';

import { SchoolType } from '../common';
import LocationInput, { MunicipalityOption } from '../LocationInput';

// import styles from './styles.css';

type SchoolInputValue = PartialForm<SchoolType> | undefined;
const defaultSchoolValue: NonNullable<SchoolInputValue> = {};

interface Props<K extends string> {
    name: K;
    value: SchoolInputValue;
    error: Error<SchoolType>;
    onChange: (value: SetValueArg<SchoolInputValue> | undefined, name: K) => void;
    disabled?: boolean;

    municipalityOptions: MunicipalityOption[] | null | undefined;
    onMunicipalityOptionsChange: Dispatch<SetStateAction<MunicipalityOption[] | null | undefined>>;
}

function SchoolForm<K extends string>(props: Props<K>) {
    const {
        name,
        value,
        error: formError,
        onChange,
        disabled,

        municipalityOptions,
        onMunicipalityOptionsChange,
    } = props;

    const setFieldValue = useFormObject(name, onChange, defaultSchoolValue);
    const error = getErrorObject(formError);

    return (
        <>
            <NonFieldError error={error} />
            <TextInput
                name="name"
                // FIXME: translate
                label="Name of the School"
                value={value?.name}
                error={error?.name}
                onChange={setFieldValue}
                disabled={disabled}
            />
            <LocationInput
                name="municipality"
                label="Municipality"
                error={error?.municipality}
                value={value?.municipality}
                onChange={setFieldValue}
                options={municipalityOptions}
                onOptionsChange={onMunicipalityOptionsChange}
                disabled={disabled}
            />
            <NumberInput
                name="wardNumber"
                // FIXME: translate
                label="Ward Number"
                value={value?.wardNumber}
                error={error?.wardNumber}
                onChange={setFieldValue}
                disabled={disabled}
                min={1}
                max={99}
            />
            <TextInput
                name="localAddress"
                // FIXME: translate
                label="Local Address"
                value={value?.localAddress}
                error={error?.localAddress}
                onChange={setFieldValue}
                disabled={disabled}
            />
            <TextInput
                name="panNumber"
                // FIXME: translate
                label="PAN"
                value={value?.panNumber}
                error={error?.panNumber}
                onChange={setFieldValue}
                disabled={disabled}
            />
            <TextInput
                name="vatNumber"
                // FIXME: translate
                label="VAT Number"
                value={value?.vatNumber}
                error={error?.vatNumber}
                onChange={setFieldValue}
                disabled={disabled}
            />
        </>
    );
}

export default SchoolForm;
