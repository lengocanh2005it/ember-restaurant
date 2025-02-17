import axios from "@/lib/axios";

export const handleDeleteTicketMessage = async (
  ticketMessageId: string
): Promise<any> => {
  try {
    const response = await axios.delete(`ticket_messages/${ticketMessageId}`);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
