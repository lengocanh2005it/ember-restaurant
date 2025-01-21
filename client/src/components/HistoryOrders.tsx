import { Button } from "@nextui-org/react";
import React from "react";
import { MousePointerIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Swiper, SwiperSlide } from "swiper/react";

const orders = [
  { name: "Fried Chicken", number: 2, date: "2024-07-10" },
  { name: "Grilled Salmon", number: 1, date: "2024-07-02" },
  { name: "Grilled Salmon", number: 1, date: "2024-07-02" },
  { name: "Fried Chicken", number: 2, date: "2024-07-10" },
  { name: "Beef Wellington", number: 2, date: "2024-07-01" },
];

const HistoryOrders = () => {
  return (
    <div className="space-y-3">
      <h1>History Orders</h1>
      <p className="text-gray-600 mb-2">
        Below are your previous orders. You can reorder any of them with just
        one click.
      </p>

      <Swiper
        spaceBetween={20}
        slidesPerView={3}
        direction="vertical"
        className="h-[400px] overflow-y-hidden w-[50%]"
        freeMode
        wrapperClass="flex flex-col"
      >
        {orders.map((order, index) => (
          <SwiperSlide key={index} className="mb-4">
            <div className="relative pt-1">
              <Card className="cursor-pointer">
                <CardContent className="p-2">
                  <div className="space-y-2">
                    <div>
                      <h3 className="font-medium">
                        <span className="text-xl font-semibold text-green-400">
                          {order.name}
                        </span>{" "}
                        - {order.number}{" "}
                        {order.number > 1 ? `portions` : `portion`}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Ordered on: {order.date}
                      </p>
                    </div>
                    <Button color="primary">
                      Re order <MousePointerIcon size={15} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Button color="primary">New order</Button>
    </div>
  );
};

export default HistoryOrders;
