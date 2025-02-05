import ModalConfirmShowReviews from "@/components/modal/ModalConfirmShowReviews";
import { useDeleteReview } from "@/hooks/use-delete-review";
import { Review, User } from "@/utils/types";
import {
  Chip,
  Selection,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { TrashIcon } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";

interface ReviewDetailsOfCustomerProps {
  reviews: Review[];
  userId: string;
}

const columns = [
  { name: "DATE TIME", uid: "date" },
  { name: "RATINGS NUMBER", uid: "rating_number" },
  { name: "COMMENT DETAILS", uid: "comment" },
  { name: "IN HOME PAGE", uid: "is_featured" },
  { name: "OPTIONS", uid: "options" },
];

const ReviewDetailsOfCustomer: React.FC<ReviewDetailsOfCustomerProps> = ({
  reviews,
  userId,
}) => {
  const query = useQueryClient();
  const { mutate: mutateDeleteReview } = useDeleteReview(userId);
  const [customer, setCustomer] = useState<User | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

  const cachedCustomerData = query.getQueryData(["customer"]);

  useEffect(() => {
    if (cachedCustomerData) {
      setCustomer(cachedCustomerData as User);
    }
  }, [cachedCustomerData]);

  const handleClick = useCallback(
    (userId: string, reviewId: string) => {
      mutateDeleteReview({ userId, reviewId });
    },
    [mutateDeleteReview]
  );

  const handleCheckboxChange = (keys: Selection) => {
    setSelectedKeys(keys);
  };

  const renderCell = (review: Review, columnKey: React.Key) => {
    const cellValue = review[columnKey as keyof Review];

    switch (columnKey) {
      case "options": {
        return (
          <div>
            <Tooltip content="Delete" className="dark:text-white text-black">
              <TrashIcon
                className="cursor-pointer opacity-50 hover:opacity-100 duration-300
                 ease-in-out transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedKeys(new Set());
                  handleClick(customer?.id!, review.id);
                }}
              />
            </Tooltip>
          </div>
        );
      }

      case "rating_number": {
        return <p>{review.rating_number}⭐</p>;
      }

      case "comment": {
        return (
          <p className="max-w-[600px] break-words">{cellValue as string}</p>
        );
      }

      case "date": {
        return (
          <p className="max-w-full">
            {format(
              review?.date ? review.date : new Date(),
              "EEEE, dd/MM/yyyy HH:mm:yy"
            )}
          </p>
        );
      }

      case "is_featured": {
        return (
          <Chip
            variant="dot"
            color={review.is_featured ? "success" : "warning"}
            className="border-none"
          >
            {review.is_featured === true ? "Displayed" : "Not Displayed"}
          </Chip>
        );
      }
      default:
        return <p>{cellValue as string | number}</p>;
    }
  };

  return (
    <section className="container mx-auto px-2 py-4 flex flex-col gap-4">
      <div
        className="relative lg:flex-row flex-col container px-6 
      py-4 flex lg:items-center gap-2 lg:justify-start justify-center items-center 
      lg:text-left text-center"
      >
        <div
          className="relative w-[50px] h-[50px] select-none rounded-full flex 
          lg:justify-start lg:items-start justify-center items-center"
        >
          {customer && customer.image && (
            <Image
              src={customer.image}
              alt="avatar"
              priority
              fill
              sizes="(max-width:600px) 100vw, 50vw"
              className="object-cover rounded-full select-none"
            />
          )}
        </div>

        <div className="relative flex flex-col">
          <h1 className="lg:text-base text-[15px] font-medium">
            {customer?.name ? customer.name : customer?.username}
          </h1>

          <p
            className="lg:text-[15px] text-[14px]
           dark:text-white/70 text-black/70"
          >
            {customer?.username
              ? "Username: " + customer.username
              : "Username: Null"}
          </p>
        </div>
      </div>

      <Table
        aria-label="Table of all reviews"
        selectionMode="multiple"
        showSelectionCheckboxes={false}
        onSelectionChange={handleCheckboxChange}
        selectedKeys={selectedKeys}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={reviews}
          emptyContent="This customer doesn't have any reviews."
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {(selectedKeys === "all" || selectedKeys.size > 0) && (
        <div className="relative lg:items-end lg:justify-end items-center justify-center flex flex-col">
          <ModalConfirmShowReviews
            reviewsId={
              selectedKeys === "all"
                ? reviews.map((r) => r.id)
                : Array.from(selectedKeys as Set<string>)
            }
            userId={customer?.id ? customer.id : ""}
            setReviewsId={setSelectedKeys}
          />
        </div>
      )}
    </section>
  );
};

export default ReviewDetailsOfCustomer;
