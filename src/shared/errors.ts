export interface ApiErrorResponse {
  statusCode: number;
  error: string;
  message: string;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public error: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }

  static async fromResponse(response: Response): Promise<ApiError> {
    try {
      const data: ApiErrorResponse = await response.json();
      return new ApiError(data.statusCode, data.error, data.message);
    } catch {
      return new ApiError(
        response.status,
        response.statusText,
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }
  }
}
