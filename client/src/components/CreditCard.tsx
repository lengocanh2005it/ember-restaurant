import React from "react";
import InputCreditCard from "@/components/InputCreditCard";
import ApplePay from "@/components/ui/apple-pay";
import PayPal from "@/components/ui/paypal";
import Visa from "@/components/ui/visa";
import { Card, CardBody, RadioGroup, Radio } from "@nextui-org/react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

interface CreditCardProps {
  onClose: () => void;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const CreditCard: React.FC<CreditCardProps> = ({ onClose }) => {
  const [selected, setSelected] = React.useState<string>("");

  return (
    <Card className="w-full relative">
      <CardBody className="gap-2 w-full relative">
        <RadioGroup
          label="Select your bank"
          className="dark:text-white/80 text-black/80"
          value={selected}
          onValueChange={setSelected}
        >
          <div
            className="flex md:flex-row flex-col w-full md:items-center 
        md:justify-between gap-3 relative overflow-hidden dark:text-white/80 text-black/80"
          >
            <Radio value="apple-pay" color="success" isDisabled>
              <ApplePay />
            </Radio>

            <Radio value="pay-pal" color="success" isDisabled>
              <PayPal />
            </Radio>

            <Radio value="visa" color="success">
              <Visa />
            </Radio>
          </div>
        </RadioGroup>
      </CardBody>

      {selected !== "" && (
        <CardBody>
          <Elements stripe={stripePromise}>
            <InputCreditCard onClose={onClose} />
          </Elements>
        </CardBody>
      )}
    </Card>
  );
};

export default CreditCard;
