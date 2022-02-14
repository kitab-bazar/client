import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { Link } from '@the-deep/deep-ui';

import { GradeOptionsQuery, BookGradeEnum } from '#generated/types';

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
    grade: NonNullable<NonNullable<GradeOptionsQuery['gradeList']>['enumValues']>[number];
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
            <div className={styles.preview}>
                {gradePreviewMap[grade.name as BookGradeEnum]}
            </div>
            <div className={styles.description}>
                {grade.description}
            </div>
        </Link>
    );
}

export default GradeItem;
