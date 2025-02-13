"use client";
import Categories from "@/components/Categories";
import LoadingPage from "@/components/LoadingPage";
import MenuItems from "@/components/MenuItems";
import { useProducts } from "@/hooks/use-products";
import { useAppStore } from "@/store";
import { Product } from "@/utils";
import { Button, Input, Pagination } from "@heroui/react";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const MenuList: React.FC = () => {
  const { isAdmin, category } = useAppStore();
  const [products, setProducts] = useState<Product[]>([]);

  const router = useRouter();

  const { data, isLoading, isError } = useProducts();

  useEffect(() => {
    if (data) {
      setProducts(data as Product[]);
    }
  }, [data]);

  const handleClick = () => {
    router.push("/home/admin/menu/add");
  };

  const handleEditClick = () => {
    router.push("/home/admin/menu");
  };

  const [page, setPage] = useState<number>(1);
  const [searchName, setSearchName] = useState<string>("");
  const itemsPerPage = 3;

  const filteredItems = React.useMemo(() => {
    return (
      products.filter((item: Product) => {
        const matchesSearchName = item.name
          .toLowerCase()
          .includes(searchName.toLowerCase());

        const matchesCategory =
          category.toLowerCase() === "all" ||
          item.category.toLowerCase() === category.toLowerCase();

        return matchesSearchName && matchesCategory;
      }) ?? []
    );
  }, [searchName, category, products]);

  const totalPages = React.useMemo(() => {
    return Math.ceil((filteredItems.length ?? 0) / itemsPerPage);
  }, [filteredItems]);

  const currentItems = React.useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems]);

  useEffect(() => {
    setPage(1);
  }, [filteredItems]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <>
      {products.length !== 0 ? (
        <>
          <div className="lg:container mx-auto lg:px-3 py-6 flex flex-col lg:gap-8 gap-4">
            <div className="flex md:flex-row flex-col items-center justify-between md:gap-6 gap-4">
              <div
                className="relative flex flex-col lg:items-start lg:justify-start lg:text-left
           items-center justify-center text-center"
              >
                <div
                  className="flex items-center lg:gap-3 gap-1 lg:text-left text-center 
                lg:flex-row flex-col"
                >
                  <h1 className="lg:text-3xl text-2xl font-bold lg:text-left text-center">
                    EMBER&apos;S MENU
                  </h1>

                  {isAdmin && (
                    <>
                      <Button
                        color="primary"
                        className="dark:bg-white dark:text-black w-fit"
                        onPress={handleEditClick}
                      >
                        Edit Menu
                      </Button>
                    </>
                  )}
                </div>

                <p className="lg:text-base text-[14px] dark:text-white/70 text-black/80">
                  Explore Ember&apos;s menu, featuring a range of mouthwatering
                  dishes made with the freshest ingredients.
                </p>
              </div>

              <div
                className="md:w-[40%] w-full relative flex 
        items-center justify-between lg:gap-5 gap-2 xl:flex-row flex-col"
              >
                <Categories />

                <Input
                  label="Search Dish"
                  className="lg:w-full"
                  startContent={
                    <SearchIcon className="text-gray-500 w-5 h-5" />
                  }
                  placeholder="Enter name..."
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>
            </div>

            {currentItems.length !== 0 ? (
              <>
                <div className="grid grid-cols-1 xl:grid-cols-3 lg:gap-6 gap-4">
                  {currentItems.map((item: Product) => (
                    <MenuItems key={item.id} item={item} />
                  ))}
                </div>

                <div className="flex justify-center lg:mt-4 mt-2">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="secondary"
                    classNames={{
                      cursor: "bg-foreground text-background",
                    }}
                    total={totalPages}
                    page={page}
                    onChange={(page) => setPage(page)}
                  />
                </div>
              </>
            ) : (
              <div className="flex justify-center">
                <h1
                  className="text-center lg:p-4 p-2 
                lg:text-4xl text-2xl"
                >
                  Dish Not Found.
                </h1>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div
            className="flex flex-col gap-4 text-base items-center 
          justify-center h-[50vh] text-center"
          >
            {isAdmin ? (
              <>
                <div className="flex flex-col items-center relative">
                  <h1 className="lg:text-2xl text-xl font-bold dark:text-white text-black uppercase">
                    The Menu Is Empty!
                  </h1>

                  <p className="lg:text-[15px] text-[13px] dark:text-white/60 text-black/70">
                    Currently, your restaurant&apos;s menu is empty. Please add
                    new dishes to update the menu!
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center relative">
                  <h1 className="lg:text-2xl text-xl font-bold dark:text-white text-black uppercase">
                    Sorry for the inconvenience!
                  </h1>

                  <p className="lg:text-[15px] text-[13px] dark:text-white/60 text-black/70">
                    The restaurant menu is currently under maintenance. Please
                    check back later!
                  </p>
                </div>
              </>
            )}

            {isAdmin && (
              <Button
                color="primary"
                className="dark:bg-white dark:text-black"
                onPress={handleClick}
              >
                Create New Dish
              </Button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default MenuList;
