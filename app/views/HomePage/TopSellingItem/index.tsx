import React from 'react';
import { Link } from '@the-deep/deep-ui';
import {
    gql,
    useQuery,
} from '@apollo/client';
import Carousel from '#components/Carousel';
import CarouselItem from '#components/Carousel/CarouselItem';
import CarouselButton from '#components/Carousel/CarouselButton';
import { TopSellingItemQuery } from '#generated/types';
import routes from '#base/configs/routes';

import styles from './styles.css';

const TOP_SELLING_ITEMS = gql`
    query TopSellingItem {
        books(ordering: "ordered_count", pageSize: 5) {
            results {
                image {
                    name
                    url
                }
                title
                price
                categories {
                    name
                }
                numberOfPages
            }
        }
    }
`;

function TopSellingItem() {
    const {
        data: topSellingItemsResponse,
    } = useQuery<TopSellingItemQuery>(
        TOP_SELLING_ITEMS,
    );

    const category = topSellingItemsResponse?.books?.results?.map((item) => (
        item.categories.map((categoryName) => (categoryName.name))
    ));

    return (
        <Carousel
            className={styles.carousel}
            numberOfVisibleItems={3}
        >
            <div>
                <CarouselButton action="prev" />
                <div className={styles.itemList}>
                    {topSellingItemsResponse?.books?.results?.map((books, i) => (
                        <CarouselItem
                            className={styles.carouselItem}
                            order={i + 1}
                        >
                            <Link
                                to={{
                                    pathname: routes.bookList.path,
                                    state: { book: books.title },
                                }}
                                className={styles.gradeItem}
                                linkElementClassName={styles.link}
                            >
                                <img
                                    className={styles.preview}
                                    src={books.image?.url ?? undefined}
                                    alt={books.title}
                                />
                                <div className={styles.bookTitle}>
                                    <div className={styles.description}>
                                        {books.title}
                                    </div>
                                    <div className={styles.price}>{`Rs. ${books.price}`}</div>
                                </div>
                                <h5>
                                    {`Total Pages: ${books.price}`}
                                </h5>
                            </Link>
                        </CarouselItem>
                    ))}
                </div>
                <CarouselButton action="next" />
            </div>
            {/* <div className={styles.actions}>
            </div> */}
        </Carousel>
    );
}

export default TopSellingItem;
