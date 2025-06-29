export type TApiResponse<T> =
  | {
      ok: false;
      message: string;
      statusCode: number;
      error: string;
    }
  | { ok: true; message: string; statusCode: number; data: T };
