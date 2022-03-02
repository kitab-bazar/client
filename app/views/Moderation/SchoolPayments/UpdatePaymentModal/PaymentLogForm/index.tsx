import React, { useState, useCallback } from 'react';
import {
    TextInput,
    Container,
} from '@the-deep/deep-ui';
import {
    getErrorObject,
    useFormObject,
    PartialForm,
    Error,
    SetValueArg,
    PurgeNull,
} from '@togglecorp/toggle-form';
import {
    CreatePaymentMutationVariables,
} from '#generated/types';

import NonFieldError from '#components/NonFieldError';
import KitabImageInput, { Option } from '#components/KitabImageInput';
import styles from './styles.css';

type PaymentLogType = NonNullable<PurgeNull<CreatePaymentMutationVariables['data']['paymentLog']>>;

type PaymentLogInputValue = PartialForm<PaymentLogType> | undefined;
const defaultPaymentLogValue: NonNullable<PaymentLogInputValue> = {};

interface Props<K extends string> {
    name: K;
    value: PaymentLogInputValue;
    error: Error<PaymentLogType>;
    onChange: (value: SetValueArg<PaymentLogInputValue> | undefined, name: K) => void;
    disabled?: boolean;
}

function PaymentLogForm<K extends string>(props: Props<K>) {
    const {
        name,
        value,
        error: formError,
        onChange,
        disabled,

    } = props;
    const [paymentLogs, setPaymentLogs] = useState<Option[] | null | undefined>();
    const setFieldValue = useFormObject(name, onChange, defaultPaymentLogValue);
    const error = getErrorObject(formError);

    const handleAddPaymentLogFiles = useCallback((options: Option[] | null | undefined) => {
        setPaymentLogs(options);
        const ids = options?.map((option) => option.id);
        setFieldValue(ids, 'files' as const);
    }, [setFieldValue]);

    return (
        <Container
            className={styles.paymentLogInput}
            heading="Payment Log"
            headingClassName={styles.heading}
            headingSize="extraSmall"
            contentClassName={styles.content}
        >
            <NonFieldError error={error} />
            <TextInput
                name="comment"
                label="Comment"
                value={value?.comment}
                error={error?.comment}
                onChange={setFieldValue}
                disabled={disabled}
            />
            <KitabImageInput
                name="paymentLog"
                showStatus
                value={paymentLogs}
                onChange={handleAddPaymentLogFiles}
                logFileType="PAYMENT"
            />
        </Container>
    );
}

export default PaymentLogForm;
