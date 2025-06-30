export type TIncExpDaily = {
  date: string;
  id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  totalSpent: number;
  totalEarned: number;
  netTotal: number;
  userId: string | null;
};

export type TIncExpDateId = { date: string; id: string };
