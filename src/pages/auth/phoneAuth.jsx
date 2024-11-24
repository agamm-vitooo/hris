import React, { useState } from "react";
import { auth, setUpRecaptcha } from "../../server/firebase"; // Import auth dan setUpRecaptcha
import { signInWithPhoneNumber } from "firebase/auth";
import { toast } from "react-toastify";

const PhoneAuth = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [verificationId, setVerificationId] = useState(null);
    const [isOtpSent, setIsOtpSent] = useState(false);

    const sendOtp = async (e) => {
        e.preventDefault();

        if (!phoneNumber) {
            toast.error("Please enter a valid phone number.");
            return;
        }

        setUpRecaptcha(); // Siapkan reCAPTCHA
        const appVerifier = window.recaptchaVerifier;

        try {
            const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setVerificationId(confirmationResult.verificationId);
            setIsOtpSent(true);
            toast.success("OTP sent successfully!");
        } catch (error) {
            toast.error(error.message);
            console.error("Error sending OTP:", error);
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();

        if (!otp || !verificationId) {
            toast.error("Please enter the OTP.");
            return;
        }

        try {
            const credential = await auth.confirmationResult.confirm(otp);
            toast.success(`Phone verified successfully! Welcome ${credential.user.phoneNumber}`);
        } catch (error) {
            toast.error("Invalid OTP. Please try again.");
            console.error("Error verifying OTP:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-yellow-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold text-yellow-600 text-center mb-4">Phone Authentication</h1>
                {!isOtpSent ? (
                    <form onSubmit={sendOtp} className="space-y-4">
                        <input
                            type="tel"
                            placeholder="Enter your phone number"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="w-full bg-yellow-600 text-white p-3 rounded-lg font-semibold hover:bg-yellow-700 transition duration-200"
                        >
                            Send OTP
                        </button>
                        <div id="recaptcha-container"></div> {/* Container untuk reCAPTCHA */}
                    </form>
                ) : (
                    <form onSubmit={verifyOtp} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="w-full bg-yellow-600 text-white p-3 rounded-lg font-semibold hover:bg-yellow-700 transition duration-200"
                        >
                            Verify OTP
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PhoneAuth;
