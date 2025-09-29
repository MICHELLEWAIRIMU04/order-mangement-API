export interface CreateCustomerData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface UpdateCustomerData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface CustomerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}
