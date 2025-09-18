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

export type TCreatedEntryForDate = {
  id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  moneyDailyId: string | null;
  time: string;
  action: string;
  spentOrEarned: number;
  isSpent: boolean;
};

export type TListingEntriesComb = {
  id: string;
  listingId: string;
  userId: string | null;
  date: string;
  totalSpent: number;
  totalEarned: number;
  action: string;
  time: string;
  spentOrEarned: number;
  isSpent: boolean;
}[];

export type TIncExpDateId = { date: string; id: string };

export type TInsertListingDayForm = {
  moneyDailyId: string;
  time: string;
  action: string;
  spentOrEarned: number;
};
