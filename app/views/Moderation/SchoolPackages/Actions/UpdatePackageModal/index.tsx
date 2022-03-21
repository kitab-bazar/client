import React, { useCallback, useMemo } from 'react';
import {
    Modal,
    Button,
    RadioInput,
    useAlert,
    TextArea,
} from '@the-deep/deep-ui';
import {
    ObjectSchema,
    PartialForm,
    useForm,
    getErrorObject,
    requiredCondition,
    createSubmitHandler,
    removeNull,
} from '@togglecorp/toggle-form';
import { useQuery, gql, useMutation } from '@apollo/client';
import {
    SchoolPackageOptionsQuery,
    SchoolPackageOptionsQueryVariables,
    SchoolPackageUpdateInputType,
    UpdateSchoolPackageMutation,
    UpdateSchoolPackageMutationVariables,
} from '#generated/types';
import NonFieldError from '#components/NonFieldError';
import ErrorMessage from '#components/ErrorMessage';
import { enumKeySelector, enumLabelSelector, EnumFix } from '#utils/types';
import {
    transformToFormError,
    ObjectError,
} from '#base/utils/errorTransform';

import { SchoolPackage } from '../../index';
import styles from './styles.css';

type FormType = EnumFix<UpdateSchoolPackageMutationVariables['data'], 'status'>;
type PartialFormType = PartialForm<FormType>;
type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;
const schema: FormSchema = {
    fields: (): FormSchemaFields => {
        const basicFields: FormSchemaFields = {
            status: [requiredCondition],
            comment: [],
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

const UPDATE_SCHOOL_PACKAGE = gql`
mutation UpdateSchoolPackage($data: SchoolPackageUpdateInputType!, $id: ID!) {
    moderatorMutation {
        updateSchoolPackage(data: $data, id: $id) {
            errors
            ok
            result {
                id
                status
                statusDisplay
                totalPrice
                totalQuantity
                packageId
                school {
                    id
                    canonicalName
                }
            }
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

    const initialValue: PartialFormType = useMemo(() => (schoolPackage ? {
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

    const {
        data: schoolPackageOptionsQuery,
        loading: schoolPackageOptionsQueryLoading,
    } = useQuery<SchoolPackageOptionsQuery, SchoolPackageOptionsQueryVariables>(
        SCHOOL_PACKAGE_OPTIONS,
    );

    const [
        updatePackage,
        { loading: updatePackagePending },
    ] = useMutation<UpdateSchoolPackageMutation, UpdateSchoolPackageMutationVariables>(
        UPDATE_SCHOOL_PACKAGE,
        {
            onCompleted: (response) => {
                const { moderatorMutation } = response;
                if (!moderatorMutation?.updateSchoolPackage) {
                    return;
                }
                const {
                    ok,
                    errors,
                } = moderatorMutation.updateSchoolPackage;
                if (ok) {
                    onModalClose();
                    alert.show(
                        'Package Update successfully!',
                        { variant: 'success' },
                    );
                } else if (errors) {
                    const formErrorFromServer = transformToFormError(
                        removeNull(errors) as ObjectError[],
                    );
                    setError(formErrorFromServer);
                }
            },
            onError: (errors) => {
                alert.show(
                    <ErrorMessage
                        header="Failed to update package"
                        description={errors.message}
                    />,
                    { variant: 'error' },
                );
            },
        },
    );

    const handleSubmit = useCallback(() => {
        const submit = createSubmitHandler(
            validate,
            setError,
            (val) => {
                updatePackage({
                    variables: { data: val as SchoolPackageUpdateInputType, id: schoolPackage.id },
                });
            },
        );
        submit();
    }, [setError, validate, updatePackage, schoolPackage.id]);

    return (
        <Modal
            className={styles.updatePackageModal}
            heading="Edit Package"
            headingSize="small"
            onCloseButtonClick={onModalClose}
            headingDescription={schoolPackage.packageId}
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
                        disabled={pristine || updatePackagePending}
                    >
                        Save
                    </Button>
                </>
            )}
        >
            <NonFieldError error={error} />
            <TextArea
                name="comment"
                onChange={setFieldValue}
                label="Comment"
                value={value?.comment}
                error={error?.comment}
                disabled={updatePackagePending}
            />
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
