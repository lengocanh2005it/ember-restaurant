import { handleCreateOrder } from "@/api/orders/create-order";
import { handleCreatePayment } from "@/api/payments/create-payment";
import { handleFetchOrdersOfUsers } from "@/api/users/fetch-orders-of-user";
import { handleFetchProfileOfUser } from "@/api/users/fetch-profile-of-user";
import { useOrderStore, useUserStore } from "@/store";
import { Order, showErrorToast, showSuccessToast, User } from "@/utils";
import { subscribeToPaymentStatus } from "@/utils/socket";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddOrder = (userId: string) => {
  const query = useQueryClient();
  const { setOrder } = useOrderStore();
  const { setUser } = useUserStore();

  return useMutation({
    mutationFn: handleCreateOrder,
    onSuccess: async (data: any, variables) => {
      try {
        const newOrder = (data.orders.currentOrders as Order[])[0];
        setOrder((data.orders.currentOrders as Order[])[0]);

        const { total_price, id } = newOrder;

        const response = await handleCreatePayment({
          amount: Number(total_price),
          payment_method: variables.order.payment_method as
            | "cash"
            | "card"
            | "paypal"
            | "apple-pay",
          currency: "usd",
          type: "order",
          userId,
          orderId: id,
          ...(variables.payment_method_id && {
            payment_method_id: variables.payment_method_id,
          }),
          ...(variables.payment_description && {
            description: variables.payment_description,
          }),
        });

        query.setQueryData(["orders", userId], response.orders);
        query.setQueryData(["discounts", userId], response.discounts);

        showSuccessToast(
          "Create order successfully. Check in orders page.",
          "top-right",
          { backgroundColor: "#28a745", color: "#fff" }
        );

        subscribeToPaymentStatus(async (data) => {
          if (data) {
            const result = await handleFetchOrdersOfUsers(variables.userId);
            const profile = await handleFetchProfileOfUser();

            query.setQueryData(["profile"], profile);
            setUser(profile as User);
            query.setQueryData(["orders", userId], result);
          }
        });
      } catch (err: any) {
        console.error(err);
        showErrorToast(err.response.data.message, "bottom-right", {
          backgroundColor: "#dc3545",
          color: "#fff",
        });
      }
    },
    onError: (err: any) => {
      console.error(err);
      showErrorToast(err.response.data.message, "bottom-right", {
        backgroundColor: "#dc3545",
        color: "#fff",
      });
    },
  });
};
