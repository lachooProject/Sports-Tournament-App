import React from "react";
import { useState, useEffect } from "react";
import { IoIosAddCircle } from "react-icons/io";
import signupSvg from "../assets/signup.svg";
import ResponsiveSlider from "../components/Ui/Slider";
import Logo from "../assets/logo.png";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaArrowCircleRight,
} from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";

// ✅ Dummy logo placeholder (You can replace this with an actual logo)
const logoPlaceholder = "https://via.placeholder.com/40";

const athleteSlides = [
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVnpCr3xMG3KwrXYYNY8Qwe0VYIn9KlmyHjE5wMcK35SquMbRsDbSOTIM&usqp=CAE&s",
    name: "Cristiano Ronaldo",
    category: "Football",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkVfD7jt0ws7S7psRIMChaewxLpFeOeqTWIlP1rgup4sBJTAcYVAgzSN4&usqp=CAE&s",
    name: "Lionel Messi",
    category: "Football",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-TJn1VUs1vgRqW6tsQp4lEleJnRxOxTq9Ng&s",
    name: "LeBron James",
    category: "Basketball",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCTQa5JZZ3-qwGX4I8dtdDWXZ4en3SNb538nSQGKInVJ6egRjxHa17cww&usqp=CAE&s",
    name: "Michael Jordan",
    category: "Basketball",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkjDE4yqjSwOxOX_e6RERiTRgFwLy6OYdde93FVquD7eJtV_9j_FMyvdI&usqp=CAE&s",
    name: "Serena Williams",
    category: "Tennis",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5CFf3HoRTWuv8ENs8f6qS9w5hc1vcJS_YUMaclOZ6KNwRlAyFCcTG5-s&usqp=CAE&s",
    name: "Roger Federer",
    category: "Tennis",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB0LqiD5onA02jb4Vdpk4io-6F8uxRlRZIo3PVwbCL6Ho2gcwKCRu9lu8&usqp=CAE&s",
    name: "Virat Kohli",
    category: "Cricket",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSN0p61uaaEk_YypdYevMgt_S_JaRIRZjKagcgNxXaauw0yRFyRTaCk8FU&s",
    name: "Usain Bolt",
    category: "Athletics",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRatLorcseSjedWzRIPAuGWJ1n_5Cr8sGHEI4Oi2m0gfQGhaMv7kcBwhkE&usqp=CAE&s",
    name: "Simone Biles",
    category: "Gymnastics",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYsaLAdAVKFsvGnxdTvjzBFvMfRbYkH4hnp2eVj5dtH0hmLuaT8c7sZWE&s",
    name: "Tom Brady",
    category: "American Football",
  },
];
const renderAthleteSlide = (slide) => (
  <div className="relative group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="relative h-96">
      {" "}
      {/* Increased height for better visibility */}
      <img
        src={slide.image}
        alt={slide.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {/* Gradient overlay that's always visible but stronger on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <div className="transform transition-transform duration-300 group-hover:translate-y-0">
          <h3 className="text-2xl font-bold mb-2 drop-shadow-lg text-center">
            {slide.name}
          </h3>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-500/80 rounded-full text-sm font-medium">
              {slide.category}
            </span>
          </div>
          {/* Additional info that appears on hover */}
          <p className="text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm">
            Professional {slide.category} player with outstanding achievements
            in the sport.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-blue-950" : "bg-transparent"
        } bg-opacity-90`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          
          <a
            href="/"
            className="flex items-center text-xl sm:text-3xl font-bold text-white gap-1.5"
          >
            <img
              src={logoPlaceholder}
              alt="Logo"
              className="h-10 w-10 rounded-full"
            />
            <span className="text-dark">Lc Tournament</span>
          </a>

          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white"
          >
            <FaArrowCircleRight className="w-6 h-6" />
          </button>

          
          <a
            href="/signup"
            className="hidden md:flex items-center bg-midnight px-3 py-2 rounded-md hover:bg-blue-600 transition"
          >
            <span className="text-white flex items-center gap-2">
              Get Started <FaArrowCircleRight className="w-5 h-5 ml-1" />
            </span>
          </a>
        </div>
      </nav> */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-midnight/0 backdrop-blur-md">
        <div
          className={`container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between ${
            isScrolled ? "h-16" : "h-16"
          }`}
        >
          <a
            href="/"
            className=" flex items-center text-xl sm:text-3xl font-bold text-white gap-1.5"
          >
            <span className="text-white m-1">
              {/* <img src={Logo} alt="" className="h-10 w-10" /> */}
            </span>
            <span className="text-indigo-600">LFC Tournament</span>
          </a>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <HiX className="h-6 w-6" />
            ) : (
              <HiMenu className="h-6 w-6" />
            )}
          </button>

          <a
            href="/signup"
            className="hidden md:flex md:flex-row items-center bg-blue-500 px-3 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            <span className="text-white flex items-center gap-2">
              Get Started
              <FaArrowCircleRight className="w-5 h-5 ml-1" />
            </span>
          </a>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden backdrop-blur-md border-t border-0">
            <div className="container mx-auto px-4 py-4">
              <a
                href="/signup"
                className="block w-full text-center bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
              >
                <span className="text-white">Get Started</span>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ✅ Hero Section */}
      <main className="relative bg-midnight min-h-screen">
        <div className="relative min-h-[600px] h-screen">
          <img
            className="w-full h-full object-cover object-center max-[900px]:object-left "
            src="https://img.freepik.com/free-photo/flat-lay-baseball-bat-with-ball-gloves_23-2148523182.jpg"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent" />

          <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="text-start sm:text-midnight text-lightest">
              <h1 className="text-4xl sm:text-3xl md:text-6xl font-bold mb-6 text-lightest text-center">
                Welcome to Sports League
              </h1>
              <p className="text-lg sm:text-xl text-gray-200 mb-8 text-center mx-auto">
                Join the ultimate sports community and showcase your talent
              </p>
              <div className="flex items-center justify-center">
                <a
                  href="/signup"
                  className=" bg-dark px-5 py-3 rounded-md text-light font-bold hover:bg-lightest hover:text-dark transition-colors duration-200"
                >
                  Get Started Today
                </a>
              </div>
            </div>
          </div>
        </div>

{/*         <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-light">
              THE PROCESS
            </h2>
            {[1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className="xl:w-[60%] md:w-[80%] w-full mx-auto mb-10 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-5 bg-gray-500/40 px-8 py-5 rounded-lg text-white">
                    <div className="flex items-center justify-start  gap-5">
                      <img
                        src={signupSvg}
                        className="sm:[w-10 h-10] w-7 h-7"
                        alt="React logo"
                      />
                      <span className="sm:text-2xl text-base font-semibold">
                        Sign up and find out if you qualify
                      </span>
                    </div>
                    <span className="sm:text-4xl text-2xl align-middle text-orange-500 items-end">
                      <IoIosAddCircle />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section> */}

        <div className="relative min-h-[700px] h-Screen">
          <img
            className="w-full h-full object-cover object-center min-h-[700px] max-[900px]:object-left"
            src="https://img.freepik.com/premium-photo/medium-shot-man-playing-basketball_23-2150903117.jpg?ga=GA1.1.482852627.1738911374&semt=ais_authors_boost"
            alt="Hero Background"
          />
          <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-midnight via-midnight/40 to-midnight " />

          <div className="absolute inset-0 flex flex-col justify-between px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto px-4 text-light">
              <h2 className="text-4xl font-bold text-center mb-12">
                Our Athletes
              </h2>
            </div>
            <div className=" container mx-auto px-4">
              <ResponsiveSlider
                slides={athleteSlides}
                renderSlide={renderAthleteSlide}
              />
            </div>
            <div></div>
          </div>
        </div>

        <section className="py-20 ">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-light mb-6">
              Ready to Join Our Sports Community?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Start your journey today and become part of something great.
            </p>
            <a
              href="/signup"
              className="inline-block bg-light px-8 py-4 rounded-md text-dark font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Join Now
            </a>
          </div>
        </section>

        <div className="flex justify-center w-full space-x-4 py-10">
          <div className="w-[60%] py-[1px] bg-gray-800 rounded-full"></div>
        </div>

        {/* ✅ Footer */}
        <footer className="bg-midnight text-white p-5 sm:p-12 w-full min-h-[200px] justify-center items-center">
          <div className="md:w-full flex flex-col md:flex-row justify-center items-start md:items-center mx-auto space-y-8 md:space-y-0">
            <div className="flex md:flex-row flex-col md:w-1/3 text-left items-start justify-start gap-5">
              <img src={Logo} alt="" className="h-1/4 w-1/4" />
              <div className="flex flex-col md:w-1/2 text-left gap-5">
                <h3 className="font-bold text-3xl sm:text-4xl responsive-heading">
                  College Sports Tracker
                </h3>
                <p className="text-gray-400 text-xl sm:text-2xl">
                  Track and manage college sports teams and players. Get
                  real-time updates, statistics, and performance analytics.
                </p>

                {/* <div className="flex gap-3">
                  <a href="#" className="text-gray-400 hover:text-white">
                    <FaInstagram className="h-10 w-10 text-black" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <FaXTwitter className="h-10 w-10 text-black" />
                  </a>
                  <a href="#" className="text-midnight hover:text-white">
                    <FaFacebookF className="h-9 w-9 text-black" />
                  </a>
                </div> */}
              </div>
            </div>
            <ul className="w-full md:w-1/2 flex flex-col items-start space-y-2 text-left md:items-end text-xl">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Players
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Teams
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Matches
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Analytics
                </a>
              </li>
            </ul>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Landing;
