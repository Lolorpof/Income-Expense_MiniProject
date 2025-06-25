export type TApiResponse<T> =
  | {
      message: string;
      statusCode: number;
      error: string;
    }
  | { message: string; statusCode: number; data: T };

export type TServiceResponse = {
  message: string;
};

export function isTServiceResponse(obj: any): obj is TServiceResponse {
  return (
    typeof obj === 'object' && obj !== null && typeof obj.message === 'string'
  );
}
