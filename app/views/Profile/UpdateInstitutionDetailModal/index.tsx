import React, { useCallback } from 'react';
import {
    Button,
    Modal,
    TextInput,
} from '@the-deep/deep-ui';
import {
    ObjectSchema,
    PartialForm,
    useForm,
    getErrorObject,
    urlCondition,
    createSubmitHandler,
} from '@togglecorp/toggle-form';

import { profile } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';

import styles from './styles.css';

interface Institution {
    id: string;
    url?: string;
    logoUrl?: string;
    ebookLibraryLink?: string;
}
interface Props {
    institution: Institution;
    onModalClose: () => void;
}

type FormType = Institution;
type PartialFormType = PartialForm<FormType>;
type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const schema: FormSchema = {
    fields: (): FormSchemaFields => ({
        url: [urlCondition],
        logoUrl: [urlCondition],
        ebookLibraryLink: [urlCondition],
    }),
};

function UpdateInstitutionDetailModal(props: Props) {
    const {
        institution,
        onModalClose,
    } = props;

    const strings = useTranslation(profile);
    const {
        pristine,
        value,
        error: riskyError,
        setFieldValue,
        validate,
        setError,
    } = useForm(schema, institution as PartialFormType);

    const error = getErrorObject(riskyError);

    const handleSubmit = useCallback(() => {
        const submit = createSubmitHandler(
            validate,
            setError,
            (val) => ({
                ...val,
            }),
        );
        submit();
    }, [validate, setError]);

    const disabled = false;

    return (
        <Modal
            className={styles.addInstitutionDetailModal}
            heading={strings.updateInstitutionDetail}
            headingSize="small"
            size="small"
            onCloseButtonClick={onModalClose}
            footerActions={(
                <>
                    <Button
                        name={undefined}
                        onClick={onModalClose}
                        variant="secondary"
                    >
                        {strings.cancelLabel}
                    </Button>
                    <Button
                        name={undefined}
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={pristine}
                    >
                        {strings.saveLabel}
                    </Button>
                </>
            )}
        >
            <TextInput
                name="url"
                onChange={setFieldValue}
                label={strings.urlLabel}
                value={value?.url}
                error={error?.url}
                disabled={disabled}
            />
            <TextInput
                name="logoUrl"
                onChange={setFieldValue}
                label={strings.logoUrlLabel}
                value={value?.logoUrl}
                error={error?.logoUrl}
                disabled={disabled}
            />
            <TextInput
                name="ebookLibraryLink"
                onChange={setFieldValue}
                label={strings.ebookLibraryLinkLabel}
                value={value?.ebookLibraryLink}
                error={error?.ebookLibraryLink}
                disabled={disabled}
            />
        </Modal>
    );
}

export default UpdateInstitutionDetailModal;
