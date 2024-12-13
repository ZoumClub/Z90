export interface Dealer {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
}

export interface DealerBid {
  id: string;
  amount: number;
  dealer: Dealer;
}