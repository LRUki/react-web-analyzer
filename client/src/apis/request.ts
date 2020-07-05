import axios from "axios";
export type RequestOption = {
  url: string;
  params?: any;
  headers?: any;
};

export type Response<T> = {
  data: T;
  status: number;
};

const handleError = (error: any) => {
  if (!error.response || !error.response.status) {
    return { message: "no connection to the internet", original: error };
  }

  let message = `something went wrong... please try agian`;

  return {
    message,
    original: error,
  };
};

export const getRequest = async <Data>(
  option: RequestOption
): Promise<Response<Data>> => {
  const { url, params, headers } = option;
  try {
    const response = await axios.get<Data>(url, { headers: headers, params });
    return { data: response.data, status: response.status };
  } catch (error) {
    throw handleError(error);
  }
};
