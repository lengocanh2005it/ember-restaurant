import ModalViewVoucher from "@/components/modal/ModalViewVoucher";
import { DiscountWithQuantity } from "@/utils";
import { format } from "date-fns";
import { Calendar, GemIcon } from "lucide-react";
import React from "react";

interface VouchersListProps {
  vouchers: DiscountWithQuantity[];
}

const VouchersList: React.FC<VouchersListProps> = ({ vouchers }) => {
  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-4 gap-2">
      {vouchers.map((voucher) => {
        const { id, value, type, end_date, start_date } = voucher.discount;

        return (
          <div
            key={id}
            className="lg:p-4 p-2 border cursor-pointer
           dark:border-white/20 rounded-lg flex-1 flex flex-col gap-2
           ease-in-out duration-300 transition-all
            hover:dark:border-white/40 shadow-custom"
          >
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <h5 className="lg:text-xl text-base font-semibold lg:text-left text-center">
                Voucher
              </h5>

              <p className="lg:text-[14px] text-[13px]">
                Quantity: <span className="font-bold">{voucher.quantity}</span>
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <GemIcon className="text-black/70 dark:text-white/60" />
                <p className="text-black dark:text-white text-[16px]">
                  Value:{" "}
                  <span className="font-bold">
                    {value}
                    {type === "percentage"
                      ? "%"
                      : type === "usd"
                      ? " USD"
                      : " VND"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="text-black/70  dark:text-white/60" />
              <p className="text-black dark:text-white text-[16px]">
                Start Date:{" "}
                <span className="font-semibold">
                  {format(start_date, "dd/MM/yyyy")}
                </span>
              </p>
            </div>

            <div className="flex lg:items-center lg:justify-between gap-2 lg:flex-row flex-col">
              <div className="flex items-center gap-2">
                <Calendar className="text-black/70  dark:text-white/60" />
                <p className="text-black dark:text-white text-[16px]">
                  End Date:{" "}
                  <span className="font-semibold">
                    {format(end_date, "dd/MM/yyyy")}
                  </span>
                </p>
              </div>

              <ModalViewVoucher voucher={voucher.discount} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VouchersList;
