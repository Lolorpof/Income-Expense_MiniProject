export type TUser = {
  id: string;
  username: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type TFormUser = {
  username: string;
  password: string;
};
