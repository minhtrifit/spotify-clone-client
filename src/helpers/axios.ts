import axios from "axios";

export const axiosInterReq = axios.interceptors.request.use(
  async (config: any) => {
    if (config.url.includes("/auth/verify")) {
      const accessToken = sessionStorage
        .getItem("accessToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      if (accessToken) {
        const newHeaders = {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`,
        };
        config.headers = newHeaders;
      }

      //   console.log("Bearer " + accessToken === config.headers.Authorization);
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export const axiosInterRes = axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (originalRequest.url.includes("/auth/refresh")) {
      console.log("Login time out");
      sessionStorage.clear();
    }

    if (originalRequest.url.includes("/auth/verify")) {
      const refreshToken = sessionStorage
        .getItem("refreshToken")
        ?.toString()
        .replace(/^"(.*)"$/, "$1");

      const rs = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      // Get token from response
      error.response.config.headers.Authorization = `Bearer ${rs.data.tokens?.accessToken}`;

      const payload: { accessToken: string; refreshToken: string } =
        rs.data.data;

      // Set new token
      sessionStorage.setItem(
        "accessToken",
        JSON.stringify(payload.accessToken)
      );

      sessionStorage.setItem(
        "refreshToken",
        JSON.stringify(payload.refreshToken)
      );

      return axios(error.response.config);
    }
    return Promise.reject(error);
  }
);
