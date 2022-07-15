import React from 'react';
import { _cs } from '@togglecorp/fujs';

import CarouselContext from '../CarouselContext';

import styles from './styles.css';

function getActiveItemsMap(
    start: number,
    numberOfVisibleItems: number,
    maxItems: number,
) {
    const map: Record<number, boolean> = {};

    if (maxItems > 0) {
        for (let i = 1; i <= maxItems; i += 1) {
            map[i] = false;
        }

        const limit = start + numberOfVisibleItems;
        for (let i = start; i < limit; i += 1) {
            const index = (i - 1) % maxItems;
            map[index + 1] = true;
        }
    }

    return map;
}

interface Props {
    order: number;
    className?: string;
    children: React.ReactNode;
}

function CarouselItem(props: Props) {
    const {
        order,
        className,
        children,
    } = props;

    const {
        activeItem,
        registerItem,
        unregisterItem,
        numberOfVisibleItems,
        items,
    } = React.useContext(CarouselContext);

    React.useEffect(() => {
        registerItem(order);

        return () => { unregisterItem(order); };
    }, [registerItem, unregisterItem, order]);

    const itemsLength = items.length;
    const inVisibleRange = React.useMemo(() => {
        if (!activeItem) {
            return false;
        }

        const activeItemsMap = getActiveItemsMap(
            activeItem,
            numberOfVisibleItems,
            itemsLength,
        );

        return activeItemsMap[order];
    }, [activeItem, order, numberOfVisibleItems, itemsLength]);

    if (!inVisibleRange) {
        return null;
    }

    const safeActiveItem = activeItem ?? 0;
    const displayOrder = order < safeActiveItem ? (safeActiveItem + order + 1) : order;

    return (
        <div
            className={_cs(styles.carouselItem, className)}
            style={{
                order: displayOrder,
            }}
        >
            {children}
        </div>
    );
}

export default CarouselItem;
