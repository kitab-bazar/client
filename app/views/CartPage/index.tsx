import React from 'react';
import { Button, Container, NumberInput, TextOutput } from '@the-deep/deep-ui';
import { AiTwotoneDelete } from 'react-icons/ai';
import { FaShoppingCart } from 'react-icons/fa';

import styles from './styles.css';

function WishListBook() {
    return (
        <div className={styles.container}>
            <div className={styles.metaData}>
                {/* <img
                        className={styles.image}
                        src={image.url}
                        alt={}
                    />
                ) : (
                    <div className={styles.noPreview}>
                        Preview not available
                    </div>
                )} */}
                <Container
                    className={styles.details}
                    heading="cart"
                >
                    <div className={styles.headerDescription}>
                        <TextOutput
                            label="author"
                        />
                        <TextOutput
                            label="Price (NPR)"
                            valueType="number"
                        />
                        <div className={styles.quantity}>
                            <TextOutput
                                label="Quantity"
                                valueType="number"
                            />
                            <NumberInput
                                name="quantity"
                                value={undefined}
                                onChange={undefined}
                            />
                        </div>
                    </div>
                </Container>
                <div className={styles.wishListButton}>
                    <Button
                        name={undefined}
                        onClick={undefined}
                        variant="secondary"
                        icons={<FaShoppingCart />}
                        autoFocus
                    >
                        Add to cart
                    </Button>
                    <Button
                        name={undefined}
                        variant="secondary"
                        icons={<AiTwotoneDelete />}
                        autoFocus
                    >
                        Remove
                    </Button>
                </div>
            </div>
        </div>
    );
}

function CartPage() {
    return (
        <div className={styles.wishList}>
            <WishListBook />
        </div>
    );
}

export default CartPage;
