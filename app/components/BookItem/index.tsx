import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    Container,
    TextOutput,
    Button,
    useAlert,
} from '@the-deep/deep-ui';
import {
    IoCheckmark,
    IoClose,
} from 'react-icons/io5';
import {
    gql,
    useMutation,
} from '@apollo/client';

import {
    BookType,
    AddToOrderMutation,
    AddToOrderMutationVariables,
} from '#generated/types';

import styles from './styles.css';

const ADD_TO_ORDER = gql`
mutation AddToOrder($id: String!, $quantity: Int!) {
    createCartItem(data: { book: $id, quantity: $quantity }) {
        errors
        ok
        result {
            id
            book {
                id
                cartDetails {
                    id
                    quantity
                }
                wishlistId
            }
        }
    }
}
`;

type BookForList = Pick<BookType, 'id' | 'title' | 'price' | 'language' | 'authors' | 'categories' | 'image'>
    & {
        publisher: Pick<BookType['publisher'], 'id' | 'name'>;
        cartDetails?: null | Pick<NonNullable<BookType['cartDetails']>, 'id' | 'quantity'>;
    };
type BookForDetail = Pick<BookType, 'id' | 'title' | 'description' | 'price' | 'language' | 'numberOfPages' | 'isbn' | 'authors' | 'categories' | 'image'>
    & {
        publisher: Pick<BookType['publisher'], 'id' | 'name'>
        cartDetails?: null | Pick<NonNullable<BookType['cartDetails']>, 'id' | 'quantity'>;
    };
type BookForCompact = Pick<BookType, 'id' | 'title' | 'image' | 'authors' | 'price'>;

interface BaseProps {
    className?: string;
}

export type Props = BaseProps & ({
    variant: 'list';
    book: BookForList;
    onBookTitleClick: (bookId: string) => void;
} | {
    variant: 'compact';
    book: BookForCompact;
    onClick: (id: string) => void;
} | {
    variant: 'detail';
    book: BookForDetail;
    onCloseButtonClick: (v: undefined) => void;
})

function BookItem(props: Props) {
    const {
        className,
        variant,
        book,
    } = props;

    const alert = useAlert();

    const [
        addToOrder,
        { loading: addToOrderLoading },
    ] = useMutation<AddToOrderMutation, AddToOrderMutationVariables>(
        ADD_TO_ORDER,
        {
            onCompleted: (response) => {
                if (!response?.createCartItem?.ok) {
                    alert.show(
                        'Failed to add book to the order.',
                        { variant: 'error' },
                    );
                }
            },
            onError: (errors) => {
                alert.show(
                    errors.message,
                    { variant: 'error' },
                );
            },
        },
    );

    const authorsDisplay = React.useMemo(() => (
        book.authors?.map((d) => d.name).join(', ')
    ), [book.authors]);

    const handleClick = React.useCallback(() => {
        if (props.variant === 'compact' && props.onClick) {
            props.onClick(props.book.id);
        }
    }, [props]);

    const categoriesDisplay = React.useMemo(() => (
        variant !== 'compact'
            ? props.book.categories?.map((d) => d.name).join(', ')
            : undefined
    ), [variant, props.book]);

    const handleAddToOrder = React.useCallback(() => {
        addToOrder({
            variables: {
                id: book.id,
                quantity: 1,
            },
        });
    }, [book.id, addToOrder]);

    const actionsDisabled = addToOrderLoading;
    const orderButton = React.useMemo(() => {
        if (variant === 'compact') {
            return undefined;
        }

        if (props.book.cartDetails) {
            return (
                <Button
                    variant="secondary"
                    name={undefined}
                    icons={<IoCheckmark />}
                    readOnly
                >
                    In order list
                </Button>
            );
        }

        return (
            <Button
                name={undefined}
                variant="primary"
                onClick={handleAddToOrder}
                disabled={actionsDisabled}
            >
                Add to Order
            </Button>
        );
    }, [variant, actionsDisabled, handleAddToOrder, props.book]);

    const bookCoverPreview = (
        <div className={styles.preview}>
            {book.image?.url && (
                <img
                    className={styles.image}
                    src={book.image.url}
                    alt={book.image.name ?? undefined}
                />
            )}
        </div>
    );

    const containerClassName = _cs(
        props.variant === 'list' && styles.listVariant,
        props.variant === 'detail' && styles.detailVariant,
        props.variant === 'compact' && styles.compactVariant,
        styles.bookItem,
        className,
    );

    if (variant === 'list') {
        return (
            <div className={containerClassName}>
                {bookCoverPreview}
                <Container
                    className={styles.details}
                    heading={(
                        <Button
                            name={book.id}
                            variant="action"
                            onClick={props.onBookTitleClick}
                        >
                            {book.title}
                        </Button>
                    )}
                    headingSize="extraSmall"
                    headingDescription={authorsDisplay}
                    headerActions={(
                        <TextOutput
                            valueType="number"
                            label="NPR."
                            hideLabelColon
                            value={book.price}
                        />
                    )}
                    footerIconsContainerClassName={styles.meta}
                    footerIcons={(
                        <>
                            <TextOutput
                                label="Language"
                                value={props.book.language}
                            />
                            <TextOutput
                                label="Publisher"
                                value={props.book.publisher.name}
                            />
                            <div className={styles.categories}>
                                {categoriesDisplay}
                            </div>
                        </>
                    )}
                    footerActionsContainerClassName={styles.actions}
                    footerActions={orderButton}
                />
            </div>
        );
    }

    if (variant === 'detail') {
        return (
            <div className={containerClassName}>
                {bookCoverPreview}
                <Container
                    className={styles.details}
                    heading={book.title}
                    headerActions={(
                        <Button
                            name={undefined}
                            variant="action"
                            onClick={props.onCloseButtonClick}
                        >
                            <IoClose />
                        </Button>
                    )}
                    headingSize="small"
                    headingDescription={authorsDisplay}
                    borderBelowHeader
                    headerDescription={(
                        <TextOutput
                            // FIXME: translate
                            label="Price (NPR)"
                            value={book.price}
                            valueType="number"
                        />
                    )}
                    contentClassName={styles.content}
                >
                    <div className={styles.bookMeta}>
                        <TextOutput
                            // FIXME: translate
                            label="Language"
                            value={props.book.language}
                        />
                        <TextOutput
                            // FIXME: translate
                            label="Number of pages"
                            value={props.book.numberOfPages}
                            valueType="number"
                        />
                        <TextOutput
                            // FIXME: translate
                            label="ISBN"
                            value={props.book.isbn}
                        />
                        <TextOutput
                            // FIXME: translate
                            label="Publisher"
                            value={props.book.publisher.name}
                        />
                        <div className={styles.categories}>
                            {categoriesDisplay}
                        </div>
                    </div>
                    <div className={styles.actions}>
                        {orderButton}
                    </div>
                    <div
                        // TODO: sanitize description
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={
                            { __html: props.book.description ?? '' }
                        }
                    />
                </Container>
            </div>
        );
    }

    return (
        <div
            role="presentation"
            onClick={handleClick}
            className={containerClassName}
            title={book.title}
        >
            {bookCoverPreview}
            <div className={styles.details}>
                <div
                    className={styles.title}
                >
                    {book.title}
                </div>
                <div className={styles.author}>
                    {book.authors[0].name}
                </div>
                <div className={styles.price}>
                    {`NPR ${book.price}`}
                </div>
            </div>
        </div>
    );
}

export default BookItem;
