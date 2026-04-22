export interface ICashManagement {
  id: number;
  userId: number;
  assignedById: number;
  counterId?: number;
  initialCashIssued: number;
  cashReceivable: number;
  expectedAmount: number;
  shortExcess: number;
  cashSales: number;
  returnSales: number;
  cashDropAmount: number;
  type: 'SOD' | 'EOD' | 'CASH_DROP';
  remarks?: string;
  isVerified?: boolean;
  verifiedAt?: Date;
}

export interface IGraphQLResponse {
  data: any;
  errors?: any[];
}
