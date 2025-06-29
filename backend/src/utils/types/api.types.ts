export type TApiResponse<T> =
  | {
      ok: false;
      message: string;
      statusCode: number;
      error: string;
    }
  | { ok: true; message: string; statusCode: number; data?: T };

export type TServiceResponse = {
  message: string;
};

export function isTServiceResponse(obj: any): obj is TServiceResponse {
  return (
    typeof obj === 'object' && obj !== null && typeof obj.message === 'string'
  );
}
