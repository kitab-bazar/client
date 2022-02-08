import React from 'react';
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
import { PublisherType } from '../common';
import LocationInput from '../LocationInput';

// import styles from './styles.css';

type PublisherInputValue = PartialForm<PublisherType> | undefined;
const defaultPublisherValue: NonNullable<PublisherInputValue> = {};

interface Props<K extends string> {
    name: K;
    value: PublisherInputValue;
    error: Error<PublisherType>;
    onChange: (value: SetValueArg<PublisherInputValue> | undefined, name: K) => void;
    disabled?: boolean;
}

function PublisherForm<K extends string>(props: Props<K>) {
    const {
        name,
        value,
        error: formError,
        onChange,
        disabled,
    } = props;

    const setFieldValue = useFormObject(name, onChange, defaultPublisherValue);
    const error = getErrorObject(formError);

    return (
        <>
            <NonFieldError error={error} />
            <TextInput
                name="name"
                // FIXME: translate
                label="Name of the Publisher"
                value={value?.name}
                error={error?.name}
                onChange={setFieldValue}
                disabled={disabled}
            />
            <LocationInput
                name="municipality"
                error={error?.municipality}
                onChange={setFieldValue}
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

export default PublisherForm;
