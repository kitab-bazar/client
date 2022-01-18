import React from 'react';
import { Button, Container, NumberInput, TextOutput } from '@the-deep/deep-ui';
import {
    gql,
} from '@apollo/client';
import { AiTwotoneDelete } from 'react-icons/ai';
import { FaShoppingCart } from 'react-icons/fa';
import Bhun from './Bhun.png';

import styles from './styles.css';

const WISH_LIST = gql`
query WishList {
    wishList {
      results {
        book {
          image {
            name
            url
          }
          id
          price
          authors {
            id
            name
          }
        }
      }
    }
  }
  `;

function WishList() {
    return (
        <div className={styles.wishList}>
            <div className={styles.container}>
                <div className={styles.metaData}>
                    <img
                        className={styles.image}
                        src={Bhun}
                        alt="img"
                    />
                    <Container
                        className={styles.details}
                        heading="Bhun Bhun"
                    >
                        <div className={styles.headerDescription}>
                            <TextOutput
                                label="Author Name"
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
                            onClick={undefined}
                            variant="secondary"
                            icons={<AiTwotoneDelete />}
                            autoFocus
                        >
                            Remove
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WishList;
