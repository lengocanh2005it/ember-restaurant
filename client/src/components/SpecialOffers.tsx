import React from "react";
import { Image } from "@nextui-org/react";

const SpecialOffers: React.FC = () => {
  const offers = [
    {
      id: 1,
      description: "50% off on your next order!",
      image: "/promotions/promotion-3.jpg",
    },
    {
      id: 2,
      description: "Free dessert with orders over $50!",
      image: "/promotions/promotion-5.jpg",
    },
  ];

  return (
    <div
      className="dark:bg-primary pb-6 dark:text-white border-b dark:border-b-white/40
     border-b-black/30 flex flex-col lg:gap-4 gap-2"
    >
      <div
        className="flex flex-col relative lg:justify-start justify-center lg:text-left
       text-center"
      >
        {" "}
        <h2 className="lg:text-2xl text-xl font-bold text-black dark:text-white">
          Special Offers
        </h2>
        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/70">
          Exclusive deals designed to make your dining experience even more
          delightful.
        </p>
      </div>

      {offers.length > 0 ? (
        <div className="flex flex-col gap-4">
          <div
            className="flex items-center lg:flex-row flex-col justify-between gap-8 
       lg:w-[80%] w-full mx-auto"
          >
            {offers.slice(0, 3).map((offer) => (
              <div
                key={offer.id}
                className="flex flex-col items-center relative md:w-1/2 w-full h-full
               gap-4 p-4 dark:bg-gray-700 rounded-lg dark:text-white shadow-custom"
              >
                <Image
                  src={offer.image}
                  isZoomed
                  alt=""
                  sizes="(max-width:600px)"
                  className="w-full xl:h-[40vh] h-[30vh] select-none cursor-pointer"
                />

                <h1
                  className="text-gray-700 xl:text-xl md:text-xl text-base uppercase
                 dark:text-white text-center font-medium"
                >
                  {offer.description}
                </h1>
              </div>
            ))}
          </div>

          <div
            className="flex flex-col items-center relative lg:w-fit w-full h-full
               gap-4 md:w-[50%] p-4 xl:px-16 dark:bg-gray-700 rounded-lg dark:text-white
                shadow-custom mx-auto"
          >
            <Image
              src="/promotions/promotion-4.jpg"
              isZoomed
              alt=""
              sizes="(max-width:600px)"
              className="w-full xl:h-[40vh] h-[30vh] select-none cursor-pointer"
            />

            <h1
              className="text-gray-700 uppercase dark:text-white md:text-xl 
            text-base text-center font-medium"
            >
              20% off on your next order!
            </h1>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No special offers available.</p>
      )}
    </div>
  );
};

export default SpecialOffers;
