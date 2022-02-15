import React, { useState, useCallback } from 'react';
import { _cs } from '@togglecorp/fujs';
import { useQuery, useMutation, gql } from '@apollo/client';
import {
    ObjectSchema,
    PartialForm,
    useForm,
    createSubmitHandler,
    getErrorObject,
    getErrorString,
    requiredCondition,
    requiredStringCondition,
    requiredListCondition,
    removeNull,
    defaultEmptyArrayType,
} from '@togglecorp/toggle-form';
import {
    Modal,
    Button,
    TextInput,
    TextArea,
    SelectInput,
    NumberInput,
    DateInput,
    useAlert,
} from '@the-deep/deep-ui';

import {
    CreateBooksOptionsQuery,
    CreateBooksOptionsQueryVariables,
    CreateBookMutation,
    CreateBookMutationVariables,
} from '#generated/types';
import { newBookModal } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import { transformToFormError, ObjectError } from '#base/utils/errorTransform';
import AuthorMultiSelectInput, { Author } from '#components/AuthorMultiSelectInput';
import CategoryMultiSelectInput, { Category } from '#components/CategoryMultiSelectInput';
import NonFieldError from '#components/NonFieldError';
import { EnumFix } from '#utils/types';

import styles from './styles.css';

interface EnumEntity<T> {
    name: T;
    description?: string | null;
}

function enumKeySelector<T>(d: EnumEntity<T>) {
    return d.name;
}
function enumLabelSelector<T>(d: EnumEntity<T>) {
    return d.description ?? `${d.name}`;
}

const CREATE_BOOK = gql`
    mutation CreateBook(
        $data: BookCreateInputType!,
    ) {
        createBook(data: $data) {
            ok
            errors
        }
    }
`;

const CREATE_BOOKS_OPTIONS = gql`
    query CreateBooksOptions {
        languageOptions: __type(name: "language") {
            name
            enumValues {
                name
                description
            }
        }
        gradeList: __type(name: "BookGradeEnum") {
            enumValues {
                name
                description
            }
        }
        authors {
            results {
                id
                name
            }
        }

    }
`;
type FormType = EnumFix<CreateBookMutationVariables['data'], 'language' | 'grade'>;
type PartialFormType = PartialForm<FormType>;
type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const schema: FormSchema = {
    fields: (): FormSchemaFields => ({
        title: [requiredStringCondition],
        description: [requiredStringCondition],
        isbn: [requiredStringCondition],
        numberOfPages: [requiredCondition],
        language: [requiredCondition],
        publisher: [requiredCondition],
        publishedDate: [requiredCondition],
        price: [requiredCondition],
        edition: [requiredStringCondition],
        grade: [],
        categories: [requiredListCondition, defaultEmptyArrayType],
        authors: [requiredListCondition, defaultEmptyArrayType],
        image: [],
    }),
};

interface Props {
    publisher: string;
    className?: string;
    onModalClose: () => void;
    onUploadSuccess: () => void;
}

function UploadBookModal(props: Props) {
    const {
        className,
        onModalClose,
        onUploadSuccess,
        publisher,
    } = props;

    const strings = useTranslation(newBookModal);
    const [authors, setAuthors] = useState<Author[] | undefined | null>();
    const [categories, setCategories] = useState<Category[] | undefined | null>();
    const initialValue: PartialFormType = {
        publisher,
    };

    const {
        pristine,
        value,
        error: riskyError,
        setFieldValue,
        validate,
        setError,
    } = useForm(schema, initialValue);

    const error = getErrorObject(riskyError);
    const alert = useAlert();

    const [
        createBook,
        { loading: createBookPending },
    ] = useMutation<CreateBookMutation, CreateBookMutationVariables>(
        CREATE_BOOK,
        {
            onCompleted: (response) => {
                if (!response.createBook) {
                    return;
                }
                const { errors, ok } = response.createBook;
                if (errors) {
                    const formError = transformToFormError(removeNull(errors) as ObjectError[]);
                    setError(formError);
                    alert.show(
                        'Error uploading book',
                        { variant: 'error' },
                    );
                } else if (ok) {
                    alert.show(
                        'Successfully uploaded book',
                        { variant: 'success' },
                    );
                    onUploadSuccess();
                    onModalClose();
                }
            },
            onError: () => {
                alert.show(
                    'Error uploading book',
                    { variant: 'error' },
                );
            },
        },
    );

    const {
        data: createBooksOptions,
        loading: createBooksOptionsPending,
        error: createBooksOptionsError,
    } = useQuery<CreateBooksOptionsQuery, CreateBooksOptionsQueryVariables>(
        CREATE_BOOKS_OPTIONS,
    );

    const handleSubmit = useCallback(
        () => {
            const submit = createSubmitHandler(
                validate,
                setError,
                (val) => {
                    createBook({
                        variables: {
                            data: {
                                ...val as CreateBookMutationVariables['data'],
                                publisher,
                                // FIXME: add this to form
                                isPublished: true,
                            },
                        },
                    });
                },
            );
            submit();
        },
        [setError, validate, createBook, publisher],
    );

    const optionsDisabled = createBooksOptionsPending || !!createBooksOptionsError;

    return (
        <Modal
            className={_cs(styles.uploadBookModal, className)}
            bodyClassName={styles.inputList}
            heading={strings.modalHeading}
            onCloseButtonClick={onModalClose}
            size="medium"
            freeHeight
            footerActions={(
                <>
                    <Button
                        name={undefined}
                        onClick={onModalClose}
                        variant="secondary"
                    >
                        {strings.cancelButtonLabel}
                    </Button>
                    <Button
                        name={undefined}
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={pristine || createBookPending}
                    >
                        {strings.saveButtonLabel}
                    </Button>
                </>
            )}
        >
            <NonFieldError error={error} />
            <TextInput
                name="title"
                label={strings.titleLabel}
                value={value?.title}
                error={error?.title}
                onChange={setFieldValue}
                disabled={createBookPending}
            />
            <TextArea
                name="description"
                label={strings.descriptionLabel}
                value={value?.description}
                error={error?.description}
                onChange={setFieldValue}
                disabled={createBookPending}
            />
            <TextInput
                name="isbn"
                label={strings.isbnLabel}
                value={value?.isbn}
                error={error?.isbn}
                onChange={setFieldValue}
                disabled={createBookPending}
            />
            <NumberInput
                name="numberOfPages"
                label={strings.numberOfPagesLabel}
                value={value?.numberOfPages}
                error={error?.numberOfPages}
                onChange={setFieldValue}
                disabled={createBookPending}
                min={1}
            />
            <TextInput
                name="edition"
                label={strings.editionLabel}
                value={value?.edition}
                error={error?.edition}
                onChange={setFieldValue}
                disabled={createBookPending}
            />
            <SelectInput
                name="grade"
                label={strings.gradeLabel}
                keySelector={enumKeySelector}
                labelSelector={enumLabelSelector}
                options={createBooksOptions?.gradeList?.enumValues}
                value={value?.grade}
                error={error?.grade}
                onChange={setFieldValue}
                disabled={createBookPending}
            />
            <SelectInput
                label={strings.languageLabel}
                name="language"
                options={createBooksOptions?.languageOptions?.enumValues}
                keySelector={enumKeySelector}
                labelSelector={enumLabelSelector}
                value={value.language}
                error={error?.language}
                onChange={setFieldValue}
                disabled={createBookPending || optionsDisabled}
            />
            <DateInput
                name="publishedDate"
                label={strings.publishedDateLabel}
                disabled={createBookPending}
                onChange={setFieldValue}
                value={value?.publishedDate}
                error={error?.publishedDate}
            />
            <NumberInput
                name="price"
                label={strings.priceLabel}
                value={value?.price}
                error={error?.price}
                onChange={setFieldValue}
                disabled={createBookPending}
                min={1}
            />
            <CategoryMultiSelectInput
                name="categories"
                label={strings.categoriesLabel}
                value={value.categories}
                onChange={setFieldValue}
                options={categories}
                onOptionsChange={setCategories}
                disabled={createBookPending}
                error={getErrorString(error?.categories)}
            />
            <AuthorMultiSelectInput
                name="authors"
                label={strings.authorsLabel}
                value={value.authors}
                onChange={setFieldValue}
                options={authors}
                onOptionsChange={setAuthors}
                disabled={createBookPending}
                error={getErrorString(error?.authors)}
            />
        </Modal>
    );
}

export default UploadBookModal;
