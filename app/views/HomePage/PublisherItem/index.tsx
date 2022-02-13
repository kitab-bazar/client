import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { Link } from '@the-deep/deep-ui';

import { PublisherType } from '#generated/types';

import routes from '#base/configs/routes';

import styles from './styles.css';

export interface Props {
    className?: string;
    publisher: Pick<PublisherType, 'id' | 'name'>;
}

function PublisherItem(props: Props) {
    const {
        publisher,
        className,
    } = props;

    return (
        <Link
            to={{
                pathname: routes.bookList.path,
                state: { publisher: publisher.id },
            }}
            className={_cs(styles.publisherItem, className)}
            linkElementClassName={styles.link}
        >
            <div className={styles.preview}>
                {publisher.name?.[0]}
            </div>
            <div className={styles.name}>
                {publisher.name}
            </div>
        </Link>
    );
}

export default PublisherItem;
