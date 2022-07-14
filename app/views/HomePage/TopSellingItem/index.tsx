import React from 'react';
import { Link } from '@the-deep/deep-ui';

function TopSellingItem() {
    return (
        <Link><img
            className={styles.previewImage}
            src={category.image?.url ?? undefined}
            alt={category.name}
        />
            <div className={styles.name}>
                {category.name}
            </div>
        </Link>
    );
}

export default TopSellingItem;