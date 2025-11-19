// Импортиране на необходимите модули за Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import logo from "../../../assets/images/brand-logos/logo_large.svg";
import logoDark from "../../../assets/images/brand-logos/logo_large_dark.svg";

// Импортиране на стиловете за Swiper
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const SwiperComponent: React.FC = () => {
  return (
    <div className="xxl:col-span-5 xl:col-span-5 lg:col-span-5 col-span-12 xl:block hidden px-0">
      <div className="authentication-cover">
        <div className="aunthentication-cover-content rounded">
          <div className="swiper keyboard-control">
            <Swiper
              spaceBetween={30}
              navigation={true}
              centeredSlides={true}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              modules={[Pagination, Autoplay, Navigation]}
              className="mySwiper"
            >
              <SwiperSlide>
                <div className="text-white text-center p-[2rem] flex items-center justify-center flex-col lg:space-y-8 md:space-y-4 sm:space-y-2 space-y-2">
                  <div>
                    <div className="mb-[5rem] dark:hidden">
                      <img
                        src={logo}
                        className="authentication-image"
                        alt="Logo"
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                    <div className="mb-[6rem] hidden dark:block">
                      <img
                        src={logoDark}
                        className="authentication-image"
                        alt="Logo"
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                    <p className="font-normal text-[0.875rem] opacity-[0.7] lg:mt-6 sm:text-[1rem]">
                      Това е вашият гид за откриване на изкуство за всяко
                      настроение. Независимо дали имате нужда от сън и
                      спокойствие, или пък имате нужда от нещо, което да обостри
                      вашето внимание и да сте по-концентрирани, ние ще
                      предоставим лекарството за вашето състояние!
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwiperComponent;
