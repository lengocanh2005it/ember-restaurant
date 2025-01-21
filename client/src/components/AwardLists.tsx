import AwardPhoto from "@/components/Photos/AwardPhoto";

const awards = [
  {
    title: "World's 50 Best Restaurants (2010)",
    description:
      "An annual list and awards ceremony for the finest dining establishments worldwide.",
  },
  {
    title: "AAA Five Diamond Award (2014)",
    description:
      "Given by the American Automobile Association to restaurants offering premier dining experiences.",
  },
  {
    title: "Michelin Star (2017)",
    description:
      "A prestigious culinary award given by the Michelin Guide to exceptional restaurants.",
  },
  {
    title: "James Beard Award (2020)",
    description:
      "Recognizes excellence in cuisine, culinary writing, and culinary education in the United Kingdom.",
  },
  {
    title: "Tatler Restaurant Awards (2023)",
    description:
      "The annual Tatler Restaurant Awards honor the finest restaurants in the United Kingdom.",
  },
];

const AwardLists = () => {
  return (
    <div className="flex justify-between lg:gap-12 gap-8">
      <ul
        className="xl:w-[45%] xl:flex xl:flex-col gap-4 lg:text-left text-center
      grid grid-cols-1 relative w-full"
      >
        {awards.map((award, index) => {
          return (
            <li
              key={index}
              className="border border-white/50 p-3 rounded-[12px] 
              cursor-pointer hover:border-white/90
              transition-all xl:w-full lg:text-left 
              text-center flex flex-col items-center justify-center"
            >
              <h1 className="font-bold lg:text-2xl text-xl">{award.title}</h1>

              <p className="text-[12px] text-white/70">{award.description}</p>
            </li>
          );
        })}
      </ul>

      <div className="xl:w-[60%] xl:block hidden">
        <AwardPhoto />
      </div>
    </div>
  );
};

export default AwardLists;
