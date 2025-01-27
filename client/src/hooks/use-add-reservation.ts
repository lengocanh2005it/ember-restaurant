import { handleCreatePayment } from "@/api/payments/create-payment";
import { handleCreateReservation } from "@/api/reservation/create-reservation";
import { handleFetchProfileOfUser } from "@/api/users/fetch-profile-of-user";
import { handleFetchReservationOfUser } from "@/api/users/fetch-reservations-of-user";
import { useUserStore } from "@/store";
import { Reservation, showErrorToast, showSuccessToast, User } from "@/utils";
import { subscribeToPaymentStatus } from "@/utils/socket";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddReservation = (userId: string) => {
  const query = useQueryClient();
  const { setUser } = useUserStore();

  return useMutation({
    mutationFn: handleCreateReservation,
    onSuccess: async (data: any, variables) => {
      const newReservation = data.reservations
        .currentReservations[0] as Reservation;

      const { total_price, id } = newReservation;

      const response = await handleCreatePayment({
        amount: Number(total_price),
        payment_method: variables.payment_method,
        currency: "usd",
        type: "reservation",
        userId,
        reservationId: id,
        ...(variables.payment_method_id && {
          payment_method_id: variables.payment_method_id,
        }),
        ...(variables.payment_description && {
          description: variables.payment_description,
        }),
      });

      query.setQueryData(["reservations", userId], response.reservations);
      query.setQueryData(["discounts", userId], response.discounts);

      showSuccessToast("Add new reservation successfully!", "top-right", {
        backgroundColor: "#28a745",
        color: "#fff",
      });

      subscribeToPaymentStatus(async (data) => {
        if (data) {
          const result = await handleFetchReservationOfUser(variables.userId);
          const profile = await handleFetchProfileOfUser();

          query.setQueryData(["profile"], profile);
          setUser(profile as User);
          query.setQueryData(["reservations", userId], result);
        }
      });
    },
    onError: (error: any) => {
      console.error(error);
      showErrorToast(error.response.data.message, "bottom-right", {
        backgroundColor: "#dc3545",
        color: "#fff",
      });
    },
  });
};
