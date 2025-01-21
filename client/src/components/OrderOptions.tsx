import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "@/components/icons/VerticalDotsIcon";

const OrderOptions = () => {
  const items = [
    { key: "view", label: "View" },
    { key: "message", label: "Message" },
    { key: "delete", label: "Delete" },
  ];

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly radius="full" size="sm" variant="light">
          <VerticalDotsIcon className="text-default-400" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu items={items} disabledKeys={["message"]}>
        {(item) => (
          <DropdownItem
            key={item.key}
            color={item.key === "delete" ? "danger" : "default"}
            className={item.key === "delete" ? "text-danger" : ""}
          >
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default OrderOptions;
