export interface Currency {
    id: string;
    name: string;
    symbol: string;
}

export interface CreateCurrencyRequest {
    name: string;
    symbol: string;
}

export interface UpdateCurrencyRequest {
    id: string;
    name: string;
    symbol: string;
}

export interface GetAllCurrencyResponse {
    data: Currency[];
    total: number;
    page: number;
    limit: number;
}

export interface CurrencyQuery {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: number;
    sortBy?: 'name' | 'price' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
  }

export interface ConvertCurrencyRequest {
    to: string,
    amount: number,
}

