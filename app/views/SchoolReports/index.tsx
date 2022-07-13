import React from 'react';
import { Container } from '@the-deep/deep-ui';
import { useQuery, gql } from '@apollo/client';
import { ReportsQuery } from '#generated/types';

import Books from '../Moderation/Reports/Books';
import styles from './styles.css';

const Reports = gql`
    query schoolReports {
        moderatorQuery {
            reports {
                booksPerGrade {
                    grade
                    numberOfBooks
                }
                booksPerLanguage {
                    language
                    numberOfBooks
                }
                booksPerPublisher {
                    numberOfBooks
                    publisherId
                    publisherName
                }
                booksPerCategory {
                    category
                    categoryId
                    numberOfBooks
                }
                booksPerPublisherPerCategory {
                    categories {
                        category
                        categoryId
                        numberOfBooks
                    }
                    publisherId
                    publisherName
                }
            }
        }
    }
`;

function SchoolReports() {
    console.log('run');
    return (
        <div className={styles.schoolReports}>
            <Container
                className={styles.reports}
                heading="Reports"
                headingSize="small"
            >
                <Books
                    booksPerCategory={booksPerCategory}
                    booksPerGrade={booksPerGrade}
                    booksPerLanguage={booksPerLanguage}
                    booksPerPublisher={booksPerPublisher}
                    booksPerPublisherPerCategory={booksPerPublisherPerCategory}
                    publisherColor={publisherColor}
                />
            </Container>
        </div>
    );
}

export default SchoolReports;
