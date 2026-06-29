export interface GoalTransaction {
  hash: string;
  amount: number;
  date: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  destinationAddress: string;
  transactions: GoalTransaction[];
  createdAt: string;
  isPublic: boolean;
  allowContributions: boolean;
}
