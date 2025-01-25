import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateStripeIntent } from 'src/utils';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-11-20.acacia',
    });
  }

  checkValidWebhooks(payload: any, sig: string, endpointSecret: string) {
    return this.stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  }

  public createStripeIntent = async (
    createStripeIntent: CreateStripeIntent,
  ) => {
    const { user, ...res } = createStripeIntent;

    if (!user || !user.email)
      throw new BadRequestException('User information is missing.');

    const customer = await this.stripe.customers.create({
      email: user?.email ? user.email : 'Null',
      name: user?.name ? user.name : user.username,
    });

    const newStripe = await this.stripe.paymentIntents.create({
      ...res,
      confirm: false,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      customer: customer.id,
      receipt_email: user.email,
    });

    if (res.payment_method)
      return await this.stripe.paymentIntents.confirm(newStripe.id, {
        payment_method: res.payment_method,
      });

    return newStripe;
  };
}
