import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import SIGNIN_EN from './en/signin.json';
import SIGNIN_VI from './vn/signin.json';
import SIGNUP_EN from './en/signup.json';
import SIGNUP_VI from './vn/signup.json';
import HEADER_EN from './en/header.json';
import HEADER_VI from './vn/header.json';
import HOME_EN from './en/home.json';
import HOME_VI from './vn/home.json';
import FOOTER_EN from './en/footer.json'
import FOOTER_VI from './vn/footer.json'
import VERIFY_EN from './en/verify.json'
import VERIFY_VI from './vn/verify.json'
import FOGOT_EN from './en/forgot.json'
import FOGOT_VI from './vn/forgot.json'
import OTP_En from './en/otp.json'
import OTP_VN from './vn/otp.json'
import RESTPASS_EN from './en/resetpass.json'
import RESTPASS_VI from './vn/resetpass.json'
import CART_EN from './en/cart.json'
import CART_VI from './vn/cart.json'
import CHECKOUT_EN from './en/checkout.json'
import CHECKOUT_VI from './vn/checkout.json'
import RETURNQR_EN from './en/returnQR.json'
import RETURNQR_VI from './vn/returnQR.json'
import SALEPRODUCT_EN from './en/saleProduct.json'
import SALEPRODUCT_VI from './vn/saleProduct.json'
import PRODUCTCARD_EN from './en/productCart.json'
import PRODUCTCARD_VI from './vn/productCart.json'
import ORDER_EN from './en/myOrder.json'
import ORDER_VI from './vn/myOrder.json'

import COMPARE_EN from './en/compare.json'
import COMPARE_VI from './vn/compare.json'

import LUCKYWHEEL_EN from './en/luckyWheel.json'
import LUCKYWHEEL_VI from './vn/luckyWheel.json'

export const locales = {
    en: 'English',
    vi: 'Tiếng Việt',
};

export const resources = {
    en: {
        signin: SIGNIN_EN,
        signup: SIGNUP_EN,
        header: HEADER_EN,
        home: HOME_EN,
        footer: FOOTER_EN,
        verify: VERIFY_EN,
        forgot: FOGOT_EN,
        otp: OTP_En,
        resetpass: RESTPASS_EN,
        cart: CART_EN,
        checkout: CHECKOUT_EN,
        returnQR: RETURNQR_EN,
        saleProduct: SALEPRODUCT_EN,
        productCart: PRODUCTCARD_EN,
        order: ORDER_EN,
        compare: COMPARE_EN,
        luckyWheel: LUCKYWHEEL_EN,
    },
    vi: {
        signin: SIGNIN_VI,
        signup: SIGNUP_VI,
        header: HEADER_VI,
        home: HOME_VI,
        footer: FOOTER_VI,
        verify: VERIFY_VI,
        forgot: FOGOT_VI,
        otp: OTP_VN,
        resetpass: RESTPASS_VI,
        cart: CART_VI,
        checkout: CHECKOUT_VI,
        returnQR: RETURNQR_VI,
        saleProduct: SALEPRODUCT_VI,
        productCart: PRODUCTCARD_VI,
        order: ORDER_VI,
        compare: COMPARE_VI,
        luckyWheel: LUCKYWHEEL_VI,
    },
};

export const defaultNS = 'signin';

i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    ns: ['signin', 'signup', 'header', 'home', 'footer', 'verify', 'forgot', 'otp', 'resetpass', 'cart', 'checkout', 'returnQR', 'saleProduct', 'productCart', 'order', 'compare', 'luckyWheel'],
    defaultNS,
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
