import React, { useState, useCallback } from 'react';
import { _cs } from '@togglecorp/fujs';
import { useQuery, useMutation, gql } from '@apollo/client';
import {
    ObjectSchema,
    PartialForm,
    useForm,
    createSubmitHandler,
    getErrorObject,
    requiredCondition,
    removeNull,
} from '@togglecorp/toggle-form';
import {
    Modal,
    Button,
    TextInput,
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
import { transformToFormError, ObjectError } from '#base/utils/errorTransform';
import AuthorMultiSelectInput, { Author } from '#components/AuthorMultiSelectInput';
import CategoryMultiSelectInput, { Category } from '#components/CategoryMultiSelectInput';
import { EnumFix } from '#utils/types';

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
        authors {
            results {
                id
                name
            }
        }

    }
`;
type FormType = EnumFix<CreateBookMutationVariables['data'], 'language'>;
type PartialFormType = PartialForm<FormType>;
type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const schema: FormSchema = {
    fields: (): FormSchemaFields => ({
        title: [requiredCondition],
        description: [requiredCondition],
        isbn: [requiredCondition],
        numberOfPages: [requiredCondition],
        language: [requiredCondition],
        publisher: [requiredCondition],
        publishedDate: [requiredCondition],
        price: [requiredCondition],
        categories: [requiredCondition],
        authors: [requiredCondition],
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
                        {
                            variant: 'error',
                        },
                    );
                } else if (ok) {
                    alert.show(
                        'Successfully uploaded book',
                        {
                            variant: 'success',
                        },
                    );
                    onUploadSuccess();
                    onModalClose();
                }
            },
            onError: () => {
                alert.show(
                    'Error uploading book',
                    {
                        variant: 'error',
                    },
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
            className={_cs(className)}
            heading="Upload Book"
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
                        Cancel
                    </Button>
                    <Button
                        name={undefined}
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={pristine || createBookPending}
                    >
                        Save
                    </Button>
                </>
            )}
        >
            <TextInput
                name="title"
                label="Title"
                value={value?.title}
                error={error?.title}
                onChange={setFieldValue}
                disabled={createBookPending}
            />
            <TextInput
                name="description"
                label="Description"
                value={value?.description}
                error={error?.description}
                onChange={setFieldValue}
                disabled={createBookPending}
            />
            <TextInput
                name="isbn"
                label="ISBN"
                value={value?.isbn}
                error={error?.isbn}
                onChange={setFieldValue}
                disabled={createBookPending}
            />
            <NumberInput
                name="numberOfPages"
                label="Number of Pages"
                value={value?.numberOfPages}
                error={error?.numberOfPages}
                onChange={setFieldValue}
                disabled={createBookPending}
            />
            <SelectInput
                label="Language"
                name="language"
                options={createBooksOptions?.languageOptions?.enumValues}
                keySelector={enumKeySelector}
                labelSelector={enumLabelSelector}
                value={value.language}
                onChange={setFieldValue}
                disabled={createBookPending || optionsDisabled}
            />
            <DateInput
                name="publishedDate"
                label="Published Date"
                disabled={createBookPending}
                onChange={setFieldValue}
                value={value?.publishedDate}
                error={error?.publishedDate}
            />
            <NumberInput
                name="price"
                label="Price"
                value={value?.price}
                error={error?.price}
                onChange={setFieldValue}
                disabled={createBookPending}
            />
            <CategoryMultiSelectInput
                name="categories"
                label="Categories"
                value={value.categories}
                onChange={setFieldValue}
                options={categories}
                onOptionsChange={setCategories}
                disabled={createBookPending}
            />
            <AuthorMultiSelectInput
                name="authors"
                label="Authors"
                value={value.authors}
                onChange={setFieldValue}
                options={authors}
                onOptionsChange={setAuthors}
                disabled={createBookPending}
            />
        </Modal>
    );
}

export default UploadBookModal;
