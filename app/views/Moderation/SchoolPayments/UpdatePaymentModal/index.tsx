import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
    ObjectSchema,
    PartialForm,
    useForm,
    createSubmitHandler,
    getErrorObject,
    requiredCondition,
} from '@togglecorp/toggle-form';
import {
    Modal,
    Button,
    NumberInput,
    DateInput,
    SelectInput,
} from '@the-deep/deep-ui';

import SchoolSelectInput, { SearchSchoolType } from '#components/SchoolSelectInput';
import NonFieldError from '#components/NonFieldError';

import { Payment } from '../index';

type FormType = {
    id: string;
    school: string;
    date: string;
    amount: number;
    status: Payment['status'];
};
type PartialFormType = PartialForm<FormType>;
type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const schema: FormSchema = {
    fields: (): FormSchemaFields => {
        const basicFields: FormSchemaFields = {
            id: [],
            school: [requiredCondition],
            date: [requiredCondition],
            amount: [requiredCondition],
            status: [requiredCondition],
        };
        return basicFields;
    },
};

interface StatusOption {
    key: Payment['status'];
    value: string;
}
const statusOptions: StatusOption[] = [
    {
        key: 'verified',
        value: 'Verified',
    },
    {
        key: 'pending',
        value: 'Pending',
    },
    {
        key: 'canceled',
        value: 'Canceled',
    },
];

function statusKeySelector(status: StatusOption) {
    return status.key;
}

function statusLabelSelector(status: StatusOption) {
    return status.value;
}

interface Props {
    onUpdateSuccess: () => void;
    paymentDetails: Payment | undefined | null;
    onModalClose: () => void;
}

function UpdatePaymentModal(props: Props) {
    const {
        onModalClose,
        onUpdateSuccess,
        paymentDetails,
    } = props;

    const [schoolOptions, setSchoolOptions] = useState<SearchSchoolType[] | undefined | null>([]);
    const initialValue: PartialFormType = useMemo(() => ({
        id: paymentDetails?.id,
        school: paymentDetails?.school.id,
        date: paymentDetails?.date,
        amount: paymentDetails?.amount,
        status: paymentDetails?.status,
    }), [paymentDetails]);

    useEffect(() => {
        if (paymentDetails?.school) {
            setSchoolOptions([paymentDetails.school]);
        }
    }, [paymentDetails]);

    const {
        pristine,
        value,
        error: riskyError,
        setFieldValue,
        validate,
        setError,
    } = useForm(schema, initialValue);

    const error = getErrorObject(riskyError);

    const updatePaymentPending = false;
    const updatePayment = useCallback(({ variables } : { variables: PartialFormType }) => {
        console.warn('variables', variables);
        onUpdateSuccess();
    }, [onUpdateSuccess]);

    const submit = useMemo(() => (
        createSubmitHandler(
            validate,
            setError,
            (finalValue) => {
                updatePayment({
                    variables: finalValue as FormType,
                });
            },
        )
    ), [setError, validate, updatePayment]);

    return (
        <Modal
            heading={paymentDetails ? 'Edit Payment' : 'Add Payment'}
            onCloseButtonClick={onModalClose}
            size="small"
            freeHeight
            footerActions={(
                <>
                    <Button
                        name={undefined}
                        onClick={onModalClose}
                        variant="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        name={undefined}
                        variant="primary"
                        onClick={submit}
                        disabled={pristine || updatePaymentPending}
                    >
                        Save
                    </Button>
                </>
            )}
        >
            <NonFieldError error={error} />
            <SchoolSelectInput
                name="school"
                label="School"
                onChange={setFieldValue}
                value={value?.school}
                error={error?.school}
                options={schoolOptions}
                onOptionsChange={setSchoolOptions}
            />
            <DateInput
                name="date"
                label="Payment date"
                disabled={updatePaymentPending}
                onChange={setFieldValue}
                value={value?.date}
                error={error?.date}
            />
            <NumberInput
                name="amount"
                label="Amount"
                value={value?.amount}
                error={error?.amount}
                onChange={setFieldValue}
                disabled={updatePaymentPending}
            />
            <SelectInput
                name="status"
                label="Status"
                keySelector={statusKeySelector}
                labelSelector={statusLabelSelector}
                options={statusOptions}
                value={value?.status}
                error={error?.status}
                onChange={setFieldValue}
                disabled={updatePaymentPending}
            />
        </Modal>
    );
}

export default UpdatePaymentModal;
