import { scrollToElementById } from "../../lib/utils";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <>
      <img
        src="./waves.png"
        alt="waves"
        className="absolute top-[100px] left-0 right-0 h-[400px] w-full object-cover -z-10"
      />

      <div className="relative text-white h-64 md:h-96">
        <div className="hidden md:flex absolute top-8 right-20 gap-6">
          <div
            className="p-8 bg-radial flex flex-col justify-between text-dark h-[400px] w-[300px] 
                        border-2 border-primary rounded-lg shadow-xl hover:scale-[102%] transition-transform duration-300 ease-in-out"
          >
            <div className="h-1/2">
              <h3>Customer Story 1</h3>
              <p className="text-darkgray">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex
                dolor a commodi, hic temporibus quia eaque tempore assumenda?
                Illo odit ex et autem ipsam asperiores deleniti doloribus?
              </p>
              <Link to="/dashboard">
                <button className="bg-primary text-white">Read More</button>
              </Link>
            </div>
            <div className="-space-y-2">
              <h4>DNB</h4>
              <div>
                <p className="text-darkgray">Corporate Banking</p>
                <p className="text-darkgray">Section Manager</p>
              </div>
            </div>
          </div>
          <div
            className="-translate-y-12 p-8 bg-darkgray flex flex-col justify-between text-white h-[450px] w-[340px] 
                        border-2 border-primary rounded-lg shadow-xl hover:scale-[102%] transition-transform duration-300 ease-in-out"
          >
            <div className="h-1/2">
              <h3>Customer Story 2</h3>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Id in,
                sint molestias veniam blanditiis quis libero cumque praesentium
                officiis et mollitia facilis fugiat hic excepturi quasi cum
                quisquam asperiores at.
              </p>
            </div>
            <div className="-space-y-2">
              <h4>Digit AS</h4>
              <p>CEO</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-radial border-y-[0.5px] border-dark md:pt-32 -mb-4 flex flex-col items-center gap-2">
        <h2 className="font-bold text-dark text-5xl sm:text-6xl lg:text-7xl text-center mb-6">
          Realize your dream with <span className="text-primary">BEER</span>{" "}
          <span className="underline">Today</span>
        </h2>
        <div className="text-center text-xl sm:text-2xl space-y-2 sm:mx-5 lg:space-y-0 lg:text-3xl">
          <p className="text-darkgray font-semibold">
            <span className="text-primary">Seamlessly</span> customize your
            product with the features you need.
          </p>
          <p className="text-darkgray font-semibold">
            <span className="text-primary">Transparent</span> price estimate at
            the end of the process.
          </p>
          <p className="text-darkgray font-semibold">
            Get in touch with the team{" "}
            <span className="text-primary">instantly</span>.
          </p>
        </div>
        <button
          onClick={() => scrollToElementById("features")}
          className="mt-8 lg:mt-16 scale-110 lg:scale-125 hover:bg-offwhite hover:text-dark transition-colors duration-300 ease-in-out"
        >
          Get Started
        </button>
      </div>
    </>
  );
}
