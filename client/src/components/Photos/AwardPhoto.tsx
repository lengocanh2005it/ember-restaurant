import Image from "next/image";
import "swiper/swiper-bundle.css";

const images = [
  { key: 1, image: "/awards/award-1.jpg" },
  { key: 2, image: "/awards/award-2.jpeg" },
  { key: 3, image: "/awards/award-3.jpg" },
];

const AwardPhoto = () => {
  return (
    <div className="flex flex-col gap-6 relative w-full h-full">
      <div className="flex gap-6 w-full h-[50%]">
        {images.slice(0, 2).map((image) => (
          <div
            key={image.key}
            className="w-1/2
        h-full relative cursor-pointer 
        opacity-70 hover:opacity-100 transition-all duration-300"
          >
            {image && image.image && (
              <Image
                src={image.image}
                alt="image"
                fill
                priority
                sizes="(max-width:600px) 100vw, 50vw"
                className="rounded-lg bg-blend-lighten object-cover"
              />
            )}
          </div>
        ))}
      </div>

      <div
        className="flex items-center justify-center w-2/3 relative h-2/3 mx-auto
      cursor-pointer opacity-80 hover:opacity-100 transition-all duration-300"
      >
        {images[2] && images[2].image && (
          <Image
            src={images[2].image}
            alt="image"
            sizes="(max-width: 600px) 100vw, 50vw"
            priority
            fill
            className="rounded-lg bg-blend-lighten object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default AwardPhoto;
