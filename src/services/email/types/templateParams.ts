// Define specific parameter types for each template
export interface BidAcceptedParams {
  itemTitle: string;
  bidAmount: number;
  sellerName: string;
  paymentLink: string;
}

export interface EmailTemplateParams {
  bidAccepted: BidAcceptedParams;
  // Add other template params here
}

// Template names as a type
export type TemplateName = keyof EmailTemplateParams;