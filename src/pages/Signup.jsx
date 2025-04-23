import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import React from "react";
import toast, { Toaster } from "react-hot-toast";

import config from "../../config";
export default function Signup() {
  const [step, setStep] = useState("signin");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const API_URL = `${config.baseUrl}/main/login`;

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}?email=${email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
     

      if (!response.ok) throw new Error(data?.message || "Login failed");

      setSentOtp(data.otp);
      setStep("otp");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsSubmitting(true); // Add additional submitting state
    setError("");

    try {
      let otpcheck = Number(otp);
      if (otpcheck === sentOtp) {
        // Make API call to get token after OTP verification
        const response = await fetch(`${config.baseUrl}/main/loginAdd`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Verification failed");
        }

        // Store token and type in cookies
        Cookies.set("token", data.token, { expires: 7 }); // Expires in 7 days
        Cookies.set("userType", data.type, { expires: 7 });

        toast.success("Login successful!");

        // Redirect based on user type
        setTimeout(() => {
          navigate(data.type === "admin" ? "/admin" : "/home");
        }, 1000);
      } else {
        toast.error("Invalid OTP!");
        setError(`OTP does not match`);
      }
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className=" min-h-screen flex items-center justify-center px-4 sm:px-6 bg-cover bg-center bg-no-repeat min-w-screen"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/premium-photo/medium-shot-man-playing-basketball_23-2150903117.jpg?ga=GA1.1.482852627.1738911374&semt=ais_authors_boost')",
      }}
    >
      <Toaster />
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative w-full max-w-md bg-black/70 border border-gray-700 shadow-xl rounded-lg backdrop-blur-md p-5 sm:p-8">
        <div className="text-left">
          <h2 className="text-lg sm:text-2xl font-semibold text-white">
            {step === "signin" ? "Sign In to Your Account" : "Enter OTP"}
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            {step === "signin"
              ? "Access your account securely."
              : `We sent an OTP to ${email}`}
          </p>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="mt-4">
          {step === "signin" ? (
            <form className="space-y-4" onSubmit={handleSignIn}>
              <div>
                <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-1 text-left">
                  Email Address :
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg py-2 px-3 sm:py-2.5 sm:px-4"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-lg"
                disabled={loading}
              >
                {loading ? "Processing..." : "Continue"}
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleVerifyOtp}>
              <div>
                <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-1 text-left">
                  Enter OTP :
                </label>
                <input
                  type="phone"
                  placeholder="Enter 6-digit OTP"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg py-2 px-3 sm:py-2.5 sm:px-4 tracking-widest text-center"
                  maxLength={6}
                  minLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={isSubmitting} // Disable input during submission
                />
              </div>

              <button
                type="submit"
                className={`w-full bg-primary text-white py-2 rounded-lg ${
                  isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
                disabled={loading || isSubmitting}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Verifying...
                  </div>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
