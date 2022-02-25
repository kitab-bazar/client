import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { Link } from '@the-deep/deep-ui';

import { FooterGradeOptionsQuery, BookGradeEnum } from '#generated/types';
import NumberOutput from '#components/NumberOutput';

import routes from '#base/configs/routes';

import styles from './styles.css';

const gradePreviewMap: {
    [key in BookGradeEnum]: number;
} = {
    GRADE_1: 1,
    GRADE_2: 2,
    GRADE_3: 3,
};

export interface Props {
    className?: string;
    grade: NonNullable<NonNullable<FooterGradeOptionsQuery['gradeList']>['enumValues']>[number];
}

function GradeItem(props: Props) {
    const {
        grade,
        className,
    } = props;

    return (
        <Link
            to={{
                pathname: routes.bookList.path,
                state: { grade: grade.name },
            }}
            className={_cs(styles.gradeItem, className)}
            linkElementClassName={styles.link}
        >
            <NumberOutput
                className={styles.preview}
                value={gradePreviewMap[grade.name as BookGradeEnum]}
            />
            <div className={styles.description}>
                {grade.description}
            </div>
        </Link>
    );
}

export default GradeItem;
