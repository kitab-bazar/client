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
    title: 'My Profile',
    navbarVisibility: true,
    component: lazy(() => import('#views/Profile')),
    componentProps: {
    },
    visibility: 'is-authenticated',
});
const orderList = wrap({
    path: '/orders/',
    title: 'My Orders',
    navbarVisibility: true,
    component: lazy(() => import('#views/OrderList')),
    componentProps: {
    },
    visibility: 'is-authenticated',
});
const wishList = wrap({
    path: '/wish-list',
    title: 'My Wish List',
    navbarVisibility: true,
    component: lazy(() => import('#views/Explore')),
    componentProps: {
        wishList: true,
    },
    visibility: 'is-authenticated',
});
const explore = wrap({
    path: '/explore/',
    title: 'Explore',
    navbarVisibility: true,
    component: lazy(() => import('#views/Explore')),
    componentProps: {},
    visibility: 'is-anything',
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
