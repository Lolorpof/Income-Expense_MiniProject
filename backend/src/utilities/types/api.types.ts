export type TApiResponse =
  | {
      message: string;
      statusCode: number;
      error: string;
    }
  | { message: string; statusCode: number; data?: object };
