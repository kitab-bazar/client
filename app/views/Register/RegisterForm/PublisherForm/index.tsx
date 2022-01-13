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
}

function PublisherForm<K extends string>(props: Props<K>) {
    const {
        name,
        value,
        error: formError,
        onChange,
    } = props;

    const setFieldValue = useFormObject(name, onChange, defaultPublisherValue);
    const error = getErrorObject(formError);

    return (
        <>
            <TextInput
                name="name"
                label="Name of the Publisher"
                value={value?.name}
                error={error?.name}
                onChange={setFieldValue}
                placeholder="Togglecorp"
            />
            <LocationInput
                name="municipality"
                value={value?.municipality}
                error={error?.municipality}
                onChange={setFieldValue}
            />
            <NumberInput
                name="wardNumber"
                label="Ward Number"
                value={value?.wardNumber}
                error={error?.wardNumber}
                onChange={setFieldValue}
            />
            <TextInput
                name="localAddress"
                label="Local Address"
                value={value?.localAddress}
                error={error?.localAddress}
                onChange={setFieldValue}
            />
            <TextInput
                name="panNumber"
                label="PAN"
                value={value?.panNumber}
                error={error?.panNumber}
                onChange={setFieldValue}
            />
            <TextInput
                name="vatNumber"
                label="VAT Number"
                value={value?.vatNumber}
                error={error?.vatNumber}
                onChange={setFieldValue}
            />
        </>
    );
}

export default PublisherForm;
