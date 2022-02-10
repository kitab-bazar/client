import { lazy } from 'react';

import { wrap } from '#base/utils/routes';

const fourHundredFour = wrap({
    path: '*',
    title: '404',
    component: lazy(() => import('#base/components/PreloadMessage')),
    componentProps: {
        heading: '404',
        content: 'What you are looking for does not exist.',
    },
    visibility: 'is-anything',
    navbarVisibility: true,
});
const register = wrap({
    path: '/register/',
    title: 'Register',
    navbarVisibility: true,
    component: lazy(() => import('#views/Register')),
    componentProps: {
    },
    visibility: 'is-not-authenticated',
});
const login = wrap({
    path: '/login/',
    title: 'Login',
    navbarVisibility: true,
    component: lazy(() => import('#views/Login')),
    componentProps: {
    },
    visibility: 'is-not-authenticated',
});
const home = wrap({
    path: '/',
    title: 'Home',
    navbarVisibility: true,
    component: lazy(() => import('#views/HomePage')),
    componentProps: {
    },
    visibility: 'is-anything',
});
const myProfile = wrap({
    path: '/profile/',
    title: 'Profile',
    navbarVisibility: true,
    component: lazy(() => import('#views/Profile')),
    componentProps: {
    },
    visibility: 'is-authenticated',
});
const explore = wrap({
    path: '/books/',
    title: 'Books',
    navbarVisibility: true,
    component: lazy(() => import('#views/Explore')),
    componentProps: {},
    visibility: 'is-anything',
});
const orderList = wrap({
    path: '/orders/',
    title: 'Orders',
    navbarVisibility: true,
    component: lazy(() => import('#views/OrderList')),
    componentProps: {
    },
    visibility: 'is-authenticated',
});
const wishList = wrap({
    path: '/wish-list',
    title: 'Wish List',
    navbarVisibility: true,
    component: lazy(() => import('#views/Explore')),
    componentProps: {
        wishList: true,
    },
    visibility: 'is-authenticated',
    checkPermissions: (user) => (
        !user?.publisherId
    ),
});

const routes = {
    register,
    login,
    home,
    myProfile,
    wishList,
    fourHundredFour,
    orderList,
    explore,
};
export default routes;
