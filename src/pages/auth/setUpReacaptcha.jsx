import { RecaptchaVerifier } from "firebase/auth";

const setUpRecaptcha = (auth) => {
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
            "recaptcha-container",
            {
                size: "invisible", // Bisa "normal" jika ingin reCAPTCHA terlihat
                callback: (response) => {
                    console.log("reCAPTCHA verified successfully!");
                },
                "expired-callback": () => {
                    console.error("reCAPTCHA expired. Please refresh the page.");
                },
            },
            auth
        );
    }
};

export default setUpRecaptcha;
