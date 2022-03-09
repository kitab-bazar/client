import React, { useCallback, useMemo } from 'react';
import {
    Modal,
    Button,
    RadioInput,
    useAlert,
} from '@the-deep/deep-ui';
import {
    ObjectSchema,
    PartialForm,
    useForm,
    getErrorObject,
    requiredCondition,
    createSubmitHandler,
} from '@togglecorp/toggle-form';
import { useQuery, gql } from '@apollo/client';
import {
    SchoolPackageOptionsQuery,
    SchoolPackageOptionsQueryVariables,
} from '#generated/types';
import NonFieldError from '#components/NonFieldError';
import { enumKeySelector, enumLabelSelector } from '#utils/types';

import { SchoolPackage } from '../../index';
import styles from './styles.css';

type FormType = {
    id: string;
    status: string;
};
type PartialFormType = PartialForm<FormType>;
type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;
const schema: FormSchema = {
    fields: (): FormSchemaFields => {
        const basicFields: FormSchemaFields = {
            id: [requiredCondition],
            status: [requiredCondition],
        };
        return basicFields;
    },
};

const SCHOOL_PACKAGE_OPTIONS = gql`
    query SchoolPackageOptions {
        schoolPackageStatusOptions: __type(name: "SchoolPackageStatusEnum") {
            enumValues {
                name
                description
            }
        }
    }
`;

interface Props {
    schoolPackage: SchoolPackage;
    onModalClose: () => void;
}

function UpdatePackageModal(props: Props) {
    const {
        schoolPackage,
        onModalClose,
    } = props;

    const {
        data: schoolPackageOptionsQuery,
        loading: schoolPackageOptionsQueryLoading,
    } = useQuery<SchoolPackageOptionsQuery, SchoolPackageOptionsQueryVariables>(
        SCHOOL_PACKAGE_OPTIONS,
    );

    const initialValue: PartialFormType = useMemo(() => (schoolPackage ? {
        id: schoolPackage.id,
        status: schoolPackage.status,
    } : {}), [schoolPackage]);

    const {
        pristine,
        value,
        error: riskyError,
        setFieldValue,
        validate,
        setError,
    } = useForm(schema, initialValue);

    const alert = useAlert();
    const error = getErrorObject(riskyError);

    const handleSubmit = useCallback(() => {
        const submit = createSubmitHandler(
            validate,
            setError,
            (val) => {
                alert.show(val, { variant: 'success' });
            },
        );
        submit();
    }, [setError, validate, alert]);

    return (
        <Modal
            className={styles.updatePackageModal}
            heading="Edit Package"
            headingSize="small"
            onCloseButtonClick={onModalClose}
            size="small"
            freeHeight
            bodyClassName={styles.content}
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
                        onClick={handleSubmit}
                        disabled={pristine}
                    >
                        Save
                    </Button>
                </>
            )}
        >
            <NonFieldError error={error} />
            <RadioInput
                name="status"
                label="Status"
                keySelector={enumKeySelector}
                labelSelector={enumLabelSelector}
                options={schoolPackageOptionsQuery?.schoolPackageStatusOptions?.enumValues ?? []}
                value={value?.status}
                error={error?.status}
                onChange={setFieldValue}
                disabled={schoolPackageOptionsQueryLoading}
            />
        </Modal>
    );
}

export default UpdatePackageModal;
