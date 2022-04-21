import React, { useState, useCallback, useMemo } from 'react';
import {
    MdFileUpload,
} from 'react-icons/md';
import { _cs, isDefined } from '@togglecorp/fujs';
import { useQuery, useMutation, gql } from '@apollo/client';
import {
    PurgeNull,
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
    defaultUndefinedType,
    internal,
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
    FileInput,
    QuickActionButton,
} from '@the-deep/deep-ui';
import { IoClose } from 'react-icons/io5';

import {
    CreateBooksOptionsQuery,
    CreateBooksOptionsQueryVariables,
    CreateBookMutation,
    CreateBookMutationVariables,
    UpdateBookMutation,
    UpdateBookMutationVariables,
} from '#generated/types';
import { newBookModal } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import { transformToFormError, ObjectError } from '#base/utils/errorTransform';
import AuthorMultiSelectInput, { Author } from '#components/AuthorMultiSelectInput';
import CategoryMultiSelectInput, { Category } from '#components/CategoryMultiSelectInput';
import NonFieldError from '#components/NonFieldError';
import ErrorMessage from '#components/ErrorMessage';
import { BookForDetail } from '#components/BookItem';

import { EnumFix, enumKeySelector, enumLabelSelector } from '#utils/types';

import styles from './styles.css';

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
const UPDATE_BOOK = gql`
mutation UpdateBook(
        $data: BookCreateInputType!,
        $id: ID!,
    ) {
        updateBook(data: $data, id: $id) {
            ok
            errors
            result {
                id
                description
                image {
                    name
                    url
                }
                isbn
                edition
                gradeDisplay
                languageDisplay
                price
                title
                titleEn
                titleNe
                descriptionEn
                descriptionNe
                publishedDate
                language
                grade
                numberOfPages
                authors {
                    id
                    name
                    aboutAuthor
                }
                categories {
                    id
                    name
                }
                publisher {
                    id
                    name
                }
                cartDetails {
                    id
                    quantity
                }
                wishlistId
            }
        }
    }
`;

const CREATE_BOOKS_OPTIONS = gql`
    query CreateBooksOptions {
        languageOptions: __type(name: "BookLanguageEnum") {
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
type FormType = PurgeNull<EnumFix<CreateBookMutationVariables['data'], 'language' | 'grade'>>;
type PartialFormType = PartialForm<FormType>;
type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const schema: FormSchema = {
    fields: (): FormSchemaFields => ({
        titleEn: [requiredStringCondition],
        titleNe: [requiredStringCondition],
        descriptionEn: [requiredStringCondition],
        descriptionNe: [requiredStringCondition],
        isbn: [requiredStringCondition],
        numberOfPages: [requiredCondition],
        language: [requiredCondition],
        publisher: [requiredCondition],
        publishedDate: [requiredCondition],
        price: [requiredCondition],
        edition: [],
        grade: [],
        categories: [requiredListCondition, defaultEmptyArrayType],
        authors: [requiredListCondition, defaultEmptyArrayType],
        image: [defaultUndefinedType],
    }),
};

interface Props {
    publisher: string;
    className?: string;
    onModalClose: () => void;
    bookDetails?: BookForDetail;
}

function UploadBookModal(props: Props) {
    const {
        className,
        onModalClose,
        publisher,
        bookDetails,
    } = props;

    const strings = useTranslation(newBookModal);
    const [
        authors,
        setAuthors,
    ] = useState<Author[] | undefined | null>(bookDetails?.authors);
    const [
        categories,
        setCategories,
    ] = useState<Category[] | undefined | null>(bookDetails?.categories);
    const initialValue: PartialFormType = useMemo(() => (removeNull({
        publisher,
        titleEn: bookDetails?.titleEn,
        titleNe: bookDetails?.titleNe,
        descriptionEn: bookDetails?.descriptionEn,
        descriptionNe: bookDetails?.descriptionNe,
        isbn: bookDetails?.isbn,
        numberOfPages: bookDetails?.numberOfPages,
        language: bookDetails?.language,
        publishedDate: bookDetails?.publishedDate,
        price: bookDetails?.price,
        edition: bookDetails?.edition,
        grade: bookDetails?.grade,
        categories: bookDetails?.categories.map((c) => c.id),
        authors: bookDetails?.authors.map((v) => v.id),
    })), [bookDetails, publisher]);

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
        updateBook,
        {
            loading: updateBookPending,
        },
    ] = useMutation<UpdateBookMutation, UpdateBookMutationVariables>(
        UPDATE_BOOK,
        {
            onCompleted: (response) => {
                if (!response.updateBook) {
                    return;
                }
                const { errors, ok } = response.updateBook;
                if (errors) {
                    const formError = transformToFormError(removeNull(errors) as ObjectError[]);
                    setError(formError);
                    alert.show(
                        <ErrorMessage
                            header={strings.bookEditFailureMessage}
                            description={
                                isDefined(formError)
                                    ? formError[internal]
                                    : undefined
                            }
                        />,
                        { variant: 'error' },
                    );
                } else if (ok) {
                    alert.show(
                        strings.bookEditSuccessMessage,
                        { variant: 'success' },
                    );
                    onModalClose();
                }
            },
            onError: (errors) => {
                setError(errors.message);
                alert.show(
                    <ErrorMessage
                        header={strings.bookEditSuccessMessage}
                        description={errors.message}
                    />,
                    { variant: 'error' },
                );
            },
        },
    );

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
                        <ErrorMessage
                            header={strings.newBookUploadFailureMessage}
                            description={
                                isDefined(formError)
                                    ? formError[internal]
                                    : undefined
                            }
                        />,
                        { variant: 'error' },
                    );
                } else if (ok) {
                    alert.show(
                        strings.newBookUploadSuccessMessage,
                        { variant: 'success' },
                    );
                    onModalClose();
                }
            },
            onError: (errors) => {
                setError(errors.message);
                alert.show(
                    <ErrorMessage
                        header={strings.newBookUploadFailureMessage}
                        description={errors.message}
                    />,
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

    const handleRemoveButtonClick = useCallback(() => {
        setFieldValue(undefined, 'image' as const);
    }, [setFieldValue]);

    const handleSubmit = useCallback(
        () => {
            const submit = createSubmitHandler(
                validate,
                setError,
                (val) => {
                    if (bookDetails?.id) {
                        updateBook({
                            variables: {
                                data: {
                                    ...val as CreateBookMutationVariables['data'],
                                    publisher,
                                    // FIXME: add this to form
                                    isPublished: true,
                                },
                                id: bookDetails.id,
                            },
                            context: {
                                hasUpload: true,
                            },
                        });
                    } else {
                        createBook({
                            variables: {
                                data: {
                                    ...val as CreateBookMutationVariables['data'],
                                    publisher,
                                    // FIXME: add this to form
                                    isPublished: true,
                                },
                            },
                            context: {
                                hasUpload: true,
                            },
                        });
                    }
                },
            );
            submit();
        },
        [setError, validate, createBook, updateBook, publisher, bookDetails?.id],
    );

    const optionsDisabled = createBooksOptionsPending || !!createBooksOptionsError;
    const imageSrc = useMemo(() => {
        if (value.image) {
            return URL.createObjectURL(value?.image as File);
        }
        if (bookDetails?.image) {
            return bookDetails.image.url as string;
        }
        return undefined;
    }, [value.image, bookDetails?.image]);

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
                        disabled={pristine || createBookPending || updateBookPending}
                    >
                        {strings.saveButtonLabel}
                    </Button>
                </>
            )}
        >
            <NonFieldError error={error} />
            <div>
                <FileInput
                    name="image"
                    label="Upload book cover"
                    value={null}
                    onChange={setFieldValue}
                    disabled={createBookPending || updateBookPending}
                    accept="image/*"
                    multiple={false}
                    overrideStatus
                    showStatus
                >
                    <MdFileUpload />
                </FileInput>
                {imageSrc && (
                    <div>
                        <QuickActionButton
                            name={undefined}
                            onClick={handleRemoveButtonClick}
                            className={styles.removeButton}
                        >
                            <IoClose />
                        </QuickActionButton>
                        <img
                            src={imageSrc}
                            alt="Book Cover"
                        />
                    </div>
                )}
            </div>

            <TextInput
                name="titleEn"
                label={strings.titleEnLabel}
                value={value?.titleEn}
                error={error?.titleEn}
                onChange={setFieldValue}
                disabled={createBookPending || updateBookPending}
            />
            <TextInput
                name="titleNe"
                label={strings.titleNeLabel}
                value={value?.titleNe}
                error={error?.titleNe}
                onChange={setFieldValue}
                disabled={createBookPending || updateBookPending}
            />
            <TextArea
                name="descriptionEn"
                label={strings.descriptionEnLabel}
                value={value?.descriptionEn}
                error={error?.descriptionEn}
                onChange={setFieldValue}
                disabled={createBookPending || updateBookPending}
            />
            <TextArea
                name="descriptionNe"
                label={strings.descriptionNeLabel}
                value={value?.descriptionNe}
                error={error?.descriptionNe}
                onChange={setFieldValue}
                disabled={createBookPending || updateBookPending}
            />
            <TextInput
                name="isbn"
                label={strings.isbnLabel}
                value={value?.isbn}
                error={error?.isbn}
                onChange={setFieldValue}
                disabled={createBookPending || updateBookPending}
            />
            <NumberInput
                name="numberOfPages"
                label={strings.numberOfPagesLabel}
                value={value?.numberOfPages}
                error={error?.numberOfPages}
                onChange={setFieldValue}
                disabled={createBookPending || updateBookPending}
                min={1}
            />
            <TextInput
                name="edition"
                label={strings.editionLabel}
                value={value?.edition}
                error={error?.edition}
                onChange={setFieldValue}
                disabled={createBookPending || updateBookPending}
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
                disabled={createBookPending || updateBookPending}
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
                disabled={createBookPending || updateBookPending || optionsDisabled}
            />
            <DateInput
                name="publishedDate"
                label={strings.publishedDateLabel}
                disabled={createBookPending || updateBookPending}
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
                disabled={createBookPending || updateBookPending}
                min={1}
            />
            <CategoryMultiSelectInput
                name="categories"
                label={strings.categoriesLabel}
                value={value.categories}
                onChange={setFieldValue}
                options={categories}
                onOptionsChange={setCategories}
                disabled={createBookPending || updateBookPending}
                error={getErrorString(error?.categories)}
            />
            <AuthorMultiSelectInput
                name="authors"
                label={strings.authorsLabel}
                value={value.authors}
                onChange={setFieldValue}
                options={authors}
                onOptionsChange={setAuthors}
                disabled={createBookPending || updateBookPending}
                error={getErrorString(error?.authors)}
            />
        </Modal>
    );
}

export default UploadBookModal;
