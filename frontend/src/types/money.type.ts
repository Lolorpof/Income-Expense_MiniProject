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

export type TDeletedListing = TCreatedEntryForDate & { entryEmpty: boolean };

export type TListingEntriesComb = {
  entry: {
    id: string;
    date: string;
    totalSpent: number;
    totalEarned: number;
    netTotal: number;
    createdAt: Date | null;
    updatedAt: Date | null;
    userId: string | null;
  };
  listings: {
    id: string;
    time: string;
    action: string;
    spentOrEarned: number;
    isSpent: boolean;
    createdAt: Date | null;
    updatedAt: Date | null;
    moneyDailyId: string | null;
  }[];
};

export type TListingsOnly = Omit<TListingEntriesComb, "entry">;

export type TIncExpDateId = { date: string; id: string };

export type TInsertListingDayForm = {
  moneyDailyId: string;
  time: string;
  action: string;
  spentOrEarned: number;
};
