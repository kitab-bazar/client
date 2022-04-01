import React from 'react';
import { Header, ListView } from '@the-deep/deep-ui';

import EbookBar from '#components/EbookBar';

import styles from './styles.css';

function EBook() {
    return (
        <div className={styles.ebook}>
            <Header
                className={styles.pageHeader}
                heading="E-Books"
                spacing="loose"
            />
            {/* <ListView
                className={styles.bookList}
                data={undefined}
                rendererParams={bookItemRendererParams}
                renderer={BookItem}
                keySelector={keySelector}
                errored={!!bookError}
                filtered={filtered}
                pending={bookLoading}
                pendingMessage={strings.pendingBookListMessage}
                emptyMessage={strings.bookListEmptyMessage}
                messageShown
            /> */}
            <EbookBar />
            <EbookBar />
        </div>
    );
}

export default EBook;
