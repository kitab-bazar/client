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

import { register as registerStrings } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import NonFieldError from '#components/NonFieldError';
import { InstitutionType } from '../common';
import LocationInput, { MunicipalityOption } from '#components/LocationInput';

type InstitutionInputValue = PartialForm<InstitutionType> | undefined;
const defaultInstitutionValue: NonNullable<InstitutionInputValue> = {};

interface Props<K extends string> {
    name: K;
    value: InstitutionInputValue;
    error: Error<InstitutionType>;
    onChange: (value: SetValueArg<InstitutionInputValue> | undefined, name: K) => void;
    disabled?: boolean;

    municipalityOptions: MunicipalityOption[] | null | undefined;
    onMunicipalityOptionsChange: Dispatch<SetStateAction<MunicipalityOption[] | null | undefined>>;
}

function InstitutionForm<K extends string>(props: Props<K>) {
    const {
        name,
        value,
        error: formError,
        onChange,
        disabled,
        municipalityOptions,
        onMunicipalityOptionsChange,
    } = props;

    const strings = useTranslation(registerStrings);
    const setFieldValue = useFormObject(name, onChange, defaultInstitutionValue);
    const error = getErrorObject(formError);

    return (
        <>
            <NonFieldError error={error} />
            <TextInput
                name="name"
                label={strings.institutionNameInputLabel}
                value={value?.name}
                error={error?.name}
                onChange={setFieldValue}
                disabled={disabled}
            />
            <LocationInput
                name="municipality"
                label={strings.municipalityInputLabel}
                error={error?.municipality}
                value={value?.municipality}
                onChange={setFieldValue}
                options={municipalityOptions}
                onOptionsChange={onMunicipalityOptionsChange}
                disabled={disabled}
            />
            <NumberInput
                name="wardNumber"
                label={strings.wardNumberInputLabel}
                value={value?.wardNumber}
                error={error?.wardNumber}
                onChange={setFieldValue}
                disabled={disabled}
                min={1}
                max={99}
            />
            <TextInput
                name="localAddress"
                label={strings.localAddressInputLabel}
                value={value?.localAddress}
                error={error?.localAddress}
                onChange={setFieldValue}
                disabled={disabled}
            />
            <TextInput
                name="panNumber"
                label={strings.panInputLabel}
                value={value?.panNumber}
                error={error?.panNumber}
                onChange={setFieldValue}
                disabled={disabled}
            />
            <TextInput
                name="vatNumber"
                label={strings.vatNumberInputLabel}
                value={value?.vatNumber}
                error={error?.vatNumber}
                onChange={setFieldValue}
                disabled={disabled}
            />
        </>
    );
}

export default InstitutionForm;
