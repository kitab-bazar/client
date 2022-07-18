import React from 'react';
import {
    _cs,
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';

import CarouselContext from './CarouselContext';

import styles from './styles.css';

const CAROUSEL_ITEM_CHANGE_DURATION = 0; // in seconds

function bound(value: number, min: number, max: number) {
    const diff = (max - min + 1); // 5

    if (value > max) {
        return ((value - min) % diff) + min;
    }

    if (value < min) {
        const minDiff = (min - value) - 1; // 0 -> 2
        return max - (minDiff % diff);
    }

    return value;
}

interface Props {
    className?: string;
    children: React.ReactNode;
    numberOfVisibleItems?: number;
}

function Carousel(props: Props) {
    const {
        className,
        children,
        numberOfVisibleItems = 1,
    } = props;

    const autoChangeTimerRef = React.useRef<number>(CAROUSEL_ITEM_CHANGE_DURATION);
    const [shouldAnimate, setShouldAnimate] = React.useState<boolean>(true);

    interface ItemState {
        items: number[];
        activeItem: number | undefined;
    }

    const [
        itemState,
        setItemState,
    ] = React.useState<ItemState>({
        items: [],
        activeItem: 1,
    });

    const switchToNextItem = React.useCallback(() => {
        setItemState((prevState) => {
            if (prevState.items.length === 0) {
                return prevState;
            }

            if (isDefined(prevState.activeItem)) {
                if (prevState.activeItem >= prevState.items.length) {
                    return {
                        ...prevState,
                        activeItem: 1,
                    };
                }

                return {
                    ...prevState,
                    activeItem: prevState.activeItem + 1,
                };
            }

            return {
                ...prevState,
                activeItem: 1,
            };
        });
    }, [setItemState]);

    // TODO: Commented out it is not needed for now

    // const decreaseTimer = React.useCallback(() => {
    //    if (autoChangeTimerRef.current === 0) {
    //        switchToNextItem();
    //        autoChangeTimerRef.current = CAROUSEL_ITEM_CHANGE_DURATION;
    //    } else if (autoChangeTimerRef.current > 0) {
    //        autoChangeTimerRef.current -= 1;
    //    }
    // }, [switchToNextItem]);

    React.useEffect(() => {
        let intervalId: number;
        // TODO: Commented out it is not needed for now

        // if (shouldAnimate) {
        //    intervalId = window.setInterval(decreaseTimer, 1000);
        // }

        return () => {
            window.clearInterval(intervalId);
        };
    }, [shouldAnimate]);

    type setterFn = React.Dispatch<React.SetStateAction<number | undefined>>;
    const setActiveItemSafe: setterFn = React.useCallback((newValueOrSetter) => {
        if (typeof newValueOrSetter === 'function') {
            setItemState((prevState) => {
                const newValue = newValueOrSetter(prevState.activeItem);

                if (isNotDefined(newValue)) {
                    return {
                        ...prevState,
                        activeItem: newValue,
                    };
                }

                const boundedValue = bound(
                    newValue ?? 1,
                    1,
                    prevState.items.length,
                );

                return {
                    ...prevState,
                    activeItem: boundedValue,
                };
            });
        } else if (typeof newValueOrSetter === 'number') {
            setItemState((prevState) => {
                const boundedValue = bound(
                    newValueOrSetter,
                    1,
                    prevState.items.length,
                );
                return {
                    ...prevState,
                    activeItem: boundedValue,
                };
            });
        }
        // TODO: Not needed for now
        // setActiveItem(newValueOrSetter);
    }, []);

    const registerItem = React.useCallback((order) => {
        setItemState((prevState) => {
            if (prevState.items.findIndex((i) => i === order) !== -1) {
                // eslint-disable-next-line no-console
                console.error('Item with given order already exists in the carousel');
                return prevState;
            }

            const newItemList = [...prevState.items, order];
            return {
                ...prevState,
                items: newItemList,
            };
        });
    }, []);

    const unregisterItem = React.useCallback((order) => {
        setItemState((prevState) => {
            const index = prevState.items.findIndex((i) => i === order);
            if (index === -1) {
                // eslint-disable-next-line no-console
                console.error('Item with given order does not exist on carousel');
                return prevState;
            }

            const newItems = [...prevState.items];
            newItems.splice(index, 1);

            const newActiveItem = (
                isDefined(prevState.activeItem) && prevState.activeItem
            ) > newItems.length
                ? newItems.length
                : prevState.activeItem;

            return {
                activeItem: newActiveItem,
                items: newItems,
            };
        });
    }, []);

    const contextValue = React.useMemo(() => ({
        items: itemState.items,
        activeItem: itemState.activeItem,
        setActiveItem: setActiveItemSafe,
        registerItem,
        unregisterItem,
        shouldAnimate,
        setShouldAnimate,
        numberOfVisibleItems,
    }), [
        itemState,
        setActiveItemSafe,
        registerItem,
        unregisterItem,
        shouldAnimate,
        setShouldAnimate,
        numberOfVisibleItems,
    ]);

    return (
        <div className={_cs(styles.carousel, className)}>
            <CarouselContext.Provider value={contextValue}>
                {children}
            </CarouselContext.Provider>
        </div>
    );
}

export default Carousel;
