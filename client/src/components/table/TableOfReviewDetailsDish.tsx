"use client";
import { DeleteReviewOfProductDto } from "@/api/products/utils/types";
import { useDeleteReviewOfProduct } from "@/hooks/use-delete-reviews-of-product";
import { ReviewsDetails } from "@/utils";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
import { format } from "date-fns";
import { TrashIcon } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useMemo, useState } from "react";

const columns = [
  { name: "DATE", uid: "date" },
  { name: "CUSTOMER", uid: "user" },
  { name: "RATINGS NUMBER", uid: "rating_number" },
  { name: "COMMENT", uid: "comment" },
  { name: "OPTIONS", uid: "options" },
];

interface TableOfReviewDetailsDishProps {
  reviewsDetails: ReviewsDetails[];
  productId: string;
}

const TableOfReviewDetailsDish: React.FC<TableOfReviewDetailsDishProps> = ({
  reviewsDetails,
  productId,
}) => {
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 3;

  const totalPages = useMemo(() => {
    return Math.ceil(reviewsDetails?.length / itemsPerPage) ?? 0;
  }, [reviewsDetails]);

  const items = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return reviewsDetails?.slice(start, end) ?? [];
  }, [page, reviewsDetails]);

  const { mutate: mutateDeleteReviewOfDish } = useDeleteReviewOfProduct();

  const renderCell = useCallback(
    (reviewDetail: ReviewsDetails, columnKey: React.Key) => {
      const cellValue = reviewDetail[columnKey as keyof ReviewsDetails];

      switch (columnKey) {
        case "date": {
          return <p>{format(reviewDetail.date, "dd/MM/yyyy")}</p>;
        }

        case "rating_number": {
          return (
            <p className="flex items-center gap-1">
              {cellValue as number}{" "}
              <span className="text-yellow-500 text-xl">★</span>
            </p>
          );
        }

        case "user": {
          const { name, image, username, phone } = cellValue as {
            name: string;
            image: string;
            username: string;
            phone: string;
          };

          return (
            <div className="relative flex items-center gap-2">
              <div
                className="relative w-[45px] h-[45px] 
              rounded-full lg:block hidden"
              >
                {image && (
                  <Image
                    src={image}
                    alt=""
                    fill
                    priority
                    sizes="(max-width:600px) 100vw, 50vw"
                    className="object-cover select-none rounded-full"
                  />
                )}
              </div>

              <div className="flex flex-col relative max-w-full truncate">
                <h1 className="lg:text-[14px] text-[12px] font-semibold">
                  {name ? name : username}
                </h1>

                <p>{"Phone number: " + (phone ? phone : "Null")}</p>
              </div>
            </div>
          );
        }

        case "options": {
          return (
            <Tooltip
              content="Delete"
              showArrow
              className="dark:text-white dark:bg-black"
            >
              <TrashIcon
                className="cursor-pointer opacity-60 hover:opacity-100 ease-in-out duration-250
                transition-opacity"
                onClick={() => {
                  const data: DeleteReviewOfProductDto = {
                    productId,
                    reviewId: reviewDetail.id,
                    option: "reviews",
                  };
                  mutateDeleteReviewOfDish(data);
                }}
              />
            </Tooltip>
          );
        }

        case "comment": {
          return <p className="max-w-full truncate">{cellValue as string}</p>;
        }

        default: {
          return <p>{cellValue as string | number}</p>;
        }
      }
    },
    [productId, mutateDeleteReviewOfDish]
  );

  return (
    <div className="flex flex-col gap-3">
      <Table aria-label="table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={items} emptyContent="Empty reviews.">
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {reviewsDetails.length !== 0 && (
        <>
          <Pagination
            initialPage={page}
            total={totalPages}
            onChange={(page) => setPage(page)}
            showControls
            showShadow
            isCompact
            classNames={{
              cursor: "bg-white text-black",
            }}
          />
        </>
      )}
    </div>
  );
};

export default TableOfReviewDetailsDish;
