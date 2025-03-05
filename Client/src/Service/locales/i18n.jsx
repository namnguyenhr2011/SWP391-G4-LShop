import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import SIGNIN_EN from "./en/signin.json";
import SIGNIN_VI from "./vn/signin.json";
import SIGNUP_EN from "./en/signup.json";
import SIGNUP_VI from "./vn/signup.json";
import HEADER_EN from "./en/header.json";
import HEADER_VI from "./vn/header.json";
import HOME_EN from "./en/home.json";
import HOME_VI from "./vn/home.json";


export const locales = {
    en: "English",
    vi: "Tiếng Việt",
};

export const resources = {
    en: {
        signin: SIGNIN_EN,
        signup: SIGNUP_EN,
        header: HEADER_EN,
        home: HOME_EN,

    },
    vi: {
        signin: SIGNIN_VI,
        signup: SIGNUP_VI,
        header: HEADER_VI,
        home: HOME_VI,

    },
};

export const defaultNS = "signin";

i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    ns: ["signin", "signup", "header", "home"],
    defaultNS,
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
