import React from 'react';
import {
    Container,
    Tab,
    Tabs,
    TabPanel,
    TabList,
    Button,
    TextOutput,
} from '@the-deep/deep-ui';
import {
    gql,
    useQuery,
} from '@apollo/client';
import { useParams } from 'react-router-dom';

import {
    BookDetailQuery,
    BookDetailQueryVariables,
} from '#generated/types';

import styles from './styles.css';

const BOOK_DETAIL = gql`
query BookDetail ($id: ID!){
    book(id: $id ) {
        description
        id
        image
        isbn
        edition
        language
        price
        title
        numberOfPages
        authors {
            id
            name
        }
    }
}
`;

function BookDetail() {
    const { id } = useParams();

    const { data: result, loading } = useQuery<
        BookDetailQuery,
        BookDetailQueryVariables
    >(BOOK_DETAIL, {
        skip: !id,
        variables: { id: id ?? '' },
    });

    const [activeTab, setActiveTab] = React.useState<'description' | 'content' | undefined>('description');
    const authorsDisplay = React.useMemo(() => (
        result?.book?.authors?.map((d) => d.name).join(', ')
    ), [result?.book?.authors]);

    return (
        <div className={styles.bookDetail}>
            <div className={styles.container}>
                {result?.book ? (
                    <>
                        <div className={styles.metaData}>
                            <div className={styles.preview}>
                                {result?.book?.image ? (
                                    <img
                                        className={styles.image}
                                        src={result.book.image}
                                        alt={result.book.title}
                                    />
                                ) : (
                                    <div className={styles.noPreview}>
                                        Preview not available
                                    </div>
                                )}
                            </div>
                            <Container
                                className={styles.details}
                                heading={result.book.title}
                                headingDescription={authorsDisplay}
                                headerDescription={(
                                    <div className={styles.headerDescription}>
                                        <TextOutput
                                            label="Price (NPR)"
                                            value={result.book.price}
                                            valueType="number"
                                        />
                                        <TextOutput
                                            label="Number of pages"
                                            value={result.book.numberOfPages}
                                            valueType="number"
                                        />
                                        <TextOutput
                                            label="ISBN"
                                            value={result.book.isbn}
                                        />
                                        <TextOutput
                                            label="Language"
                                            value={result.book.language}
                                        />
                                    </div>
                                )}
                                footerIcons={(
                                    <>
                                        <Button name="buy">
                                            Buy now
                                        </Button>
                                        <Button
                                            name="wishlist"
                                            variant="secondary"
                                        >
                                            Add to wishlist
                                        </Button>
                                    </>
                                )}
                            />
                        </div>
                        <div className={styles.otherDetails}>
                            <Tabs
                                value={activeTab}
                                onChange={setActiveTab}
                            >
                                <TabList>
                                    <Tab name="description">
                                        Description
                                    </Tab>
                                    <Tab name="content">
                                        Content
                                    </Tab>
                                </TabList>
                                <TabPanel name="description">
                                    <div
                                        // eslint-disable-next-line react/no-danger
                                        dangerouslySetInnerHTML={
                                            { __html: result.book.description ?? '' }
                                        }
                                    />
                                </TabPanel>
                                <TabPanel name="content">
                                    <div className={styles.bookContentPreview}>
                                        Not available
                                    </div>
                                </TabPanel>
                            </Tabs>
                        </div>
                        <Container
                            heading="About the author"
                            headingSize="small"
                        >
                            Author detail not available
                        </Container>
                    </>
                ) : (!loading && (
                    <div className={styles.noDetail}>
                        Book details not available
                    </div>
                ))}
            </div>
        </div>
    );
}
export default BookDetail;
