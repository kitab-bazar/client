import React, { useState } from 'react';
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
                id
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
    console.log(topSellingItemsResponse);
    const [visibleItems, setVisibleItems] = useState(3);
    const debounceTimeoutRef = React.useRef<number>();

    React.useEffect(() => {
        const onNumberOfVisibleItemsChange = () => {
            window.clearTimeout(debounceTimeoutRef.current);
            debounceTimeoutRef.current = window.setTimeout(() => {
                const width = document.documentElement.clientWidth;
                if (width < 710) {
                    setVisibleItems(1);
                } else if (width < 1200) {
                    setVisibleItems(2);
                } else {
                    setVisibleItems(3);
                }
            }, 200);
        };

        window.addEventListener('resize', onNumberOfVisibleItemsChange);
        onNumberOfVisibleItemsChange();

        return () => {
            window.removeEventListener('resize', onNumberOfVisibleItemsChange);
        };
    }, []);

    return (
        <Carousel
            className={styles.carousel}
            numberOfVisibleItems={visibleItems}
        >
            <div className={styles.carouselWrapper}>
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
                                className={styles.topSellingItem}
                                linkElementClassName={styles.link}
                            >
                                <img
                                    className={styles.preview}
                                    src={books.image?.url ?? undefined}
                                    alt={books.title}
                                />
                                <div className={styles.description}>
                                    {books.title}
                                </div>
                                <div className={styles.price}>
                                    {`Rs. ${books.price}`}
                                </div>
                            </Link>
                        </CarouselItem>
                    ))}
                </div>
                <CarouselButton action="next" />
            </div>
        </Carousel>
    );
}

export default TopSellingItem;
