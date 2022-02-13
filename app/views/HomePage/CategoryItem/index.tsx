import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { Link } from '@the-deep/deep-ui';

import { CategoryType } from '#generated/types';
import routes from '#base/configs/routes';

import styles from './styles.css';

export interface Props {
    className?: string;
    category: CategoryType;
}

function CategoryItem(props: Props) {
    const {
        category,
        className,
    } = props;

    return (
        <Link
            to={{
                pathname: routes.bookList.path,
                state: { category: category.id },
            }}
            className={_cs(styles.categoryItem, className)}
            linkElementClassName={styles.link}
        >
            <div className={styles.preview}>
                {category.name?.[0]}
            </div>
            <div className={styles.name}>
                {category.name}
            </div>
        </Link>
    );
}

export default CategoryItem;
