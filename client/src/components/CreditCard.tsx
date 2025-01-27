import InputCreditCard from "@/components/InputCreditCard";
import PayPal from "@/components/ui/paypal";
import Visa from "@/components/ui/visa";
import { Radio, RadioGroup } from "@heroui/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";

interface CreditCardProps {
  onClose: () => void;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const CreditCard: React.FC<CreditCardProps> = ({ onClose }) => {
  const [selected, setSelected] = React.useState<string>("");

  return (
    <>
      <div className="w-full relative shadow-md border dark:border-white/20 rounded-lg p-3">
        <RadioGroup
          label="Select your bank"
          className="dark:text-white/80 text-black/80 text-center"
          value={selected}
          onValueChange={setSelected}
        >
          <div
            className="flex sm:flex-row flex-col w-full sm:items-center 
        sm:justify-between lg:gap-3 gap-1 relative overflow-hidden dark:text-white/80 text-black/80"
          >
            <Radio value="pay-pal" color="success" isDisabled>
              <PayPal />
            </Radio>

            <Radio value="visa" color="success">
              <Visa />
            </Radio>
          </div>
        </RadioGroup>
      </div>

      {selected !== "" && (
        <Elements stripe={stripePromise}>
          <InputCreditCard onClose={onClose} />
        </Elements>
      )}
    </>
  );
};

export default CreditCard;
