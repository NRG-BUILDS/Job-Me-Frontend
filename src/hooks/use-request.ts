import { useState } from "react";
import {
  convertToFormData,
  convertToFormDataDjangoStyle,
  convertToFormDataFlattened,
  convertToFormDataWithJSON,
  debugFormData,
} from "@/lib/utils";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { RootState } from "@/store/store";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { logout, updateToken } from "@/store/authSlice";

// Define a general shape for request data
interface RequestData {
  [key: string]: any;
}

// Define a general type for the return type of the request
interface UseRequestReturn<T> {
  data: T | null;
  loading: boolean;
  error: any | null;
  makeRequest: (
    requestData?: RequestData | null,
    method?: string,
    contentType?: string,
    url_with_slug?: string | null,
  ) => Promise<T | undefined>;
}

// Module-level variables to handle token refreshing
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
let refreshSubscribers: Array<(token: string | null) => void> = [];

// Process all waiting subscribers
const onRefreshComplete = (newToken: string | null): void => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

// Add the useAuth parameter with a default value of true
const useRequest = <T = any>(
  route: string,
  useAuth: boolean = true,
): UseRequestReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any | null>(null);
  //@ts-ignore
  // const BASE_URL = import.meta.env.VITE_BASE_URL as string;
  const BASE_URL = import.meta.env.VITE_API_HOST as string;

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const token = useSelector((state: RootState) => state.auth.token);
  const refreshToken = useSelector((state: RootState) => state.auth.refresh);
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  const location = useLocation();

  const refreshAccessToken = async (): Promise<string | null> => {
    // If a refresh is already in progress, return the existing promise
    if (isRefreshing && refreshPromise) {
      return refreshPromise;
    }

    // Start a new refresh process
    isRefreshing = true;
    refreshPromise = new Promise<string | null>(async (resolve) => {
      try {
        // Make sure we have a refresh token before proceeding
        if (!refreshToken) {
          toast.error("Session expired", {
            description: "Please log in again.",
          });
          // navigate("/auth/login", { state: { from: location.pathname } });
          resolve(null);
          dispatch(logout());
          return;
        }

        const response = await fetch(`${BASE_URL}users/token/refresh/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        const result = await response.json();
        const isSuccess = response.ok;

        if (isSuccess) {
          const newToken = result.access as string;
          const payload = {
            token: newToken,
          };

          dispatch(updateToken(payload)); // Update the Redux store
          onRefreshComplete(newToken); // Notify all waiting subscribers
          resolve(newToken);
          return;
        }

        if (result?.status !== 200) {
          toast.error("Session Expired", {
            description: "Please log in again.",
          });
          dispatch(logout());
          // navigate("/auth/login", { state: { from: location.pathname } });
          onRefreshComplete(null); // Notify with null token
          resolve(null);
          return;
        }

        throw new Error("No new token received");
      } catch (err) {
        console.error("Error refreshing token:", err);
        onRefreshComplete(null); // Notify with null token
        resolve(null);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    });

    return refreshPromise;
  };

  // Subscribe to the token refresh
  const addRefreshSubscriber = (
    callback: (token: string | null) => void,
  ): void => {
    refreshSubscribers.push(callback);
  };

  const makeFetch = async (
    authToken: string | null | undefined,
    url: string,
    method: string,
    contentType: string,
    requestData?: RequestData | null,
  ): Promise<Response> => {
    setLoading(true);
    setError(null); // Reset error state before making the request

    const headers: Record<string, string> = {
      ...(contentType !== "multipart/form-data" && {
        "Content-Type": contentType,
      }),
    };

    if (useAuth && authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    // Append query parameters for GET requests
    let requestUrl = url;
    if (method === "GET" && requestData) {
      const queryParams = new URLSearchParams(
        requestData as Record<string, string>,
      ).toString();
      requestUrl += `?${queryParams}`;
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (method !== "GET" && requestData) {
      options.body =
        contentType === "application/json"
          ? JSON.stringify(requestData)
          : convertToFormData(requestData);
    }

    return fetch(`${BASE_URL}${requestUrl}`, options);
  };

  const makeRequest = async (
    requestData: RequestData | null = null,
    method: string = "GET",
    contentType: string = "application/json",
    url_with_slug: string | null = null,
  ): Promise<T | undefined> => {
    const requestUrl = url_with_slug || route;

    try {
      // Handle authentication if useAuth is true
      if (useAuth) {
        if (!isAuthenticated) {
          toast.error("Unauthorized access", {
            description: "Please log in to continue.",
          });
          navigate("/auth/login", { state: { from: location.pathname } });
          throw new Error("User is not authenticated");
        }

        if (!token) {
          throw new Error("Token is not available");
        }
      }

      let response = await makeFetch(
        useAuth ? token : null,
        requestUrl,
        method,
        contentType,
        requestData,
      );

      // Handle token refresh for authenticated requests
      if (useAuth && response.status === 401) {
        // If a refresh is already in progress, wait for it to complete
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            addRefreshSubscriber(async (newToken) => {
              if (newToken) {
                try {
                  // Retry the request with the new token
                  response = await makeFetch(
                    newToken,
                    requestUrl,
                    method,
                    contentType,
                    requestData,
                  );
                  if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                  }
                  const result = await response.json();
                  setData(result);
                  resolve(result);
                } catch (error) {
                  reject(error);
                }
              } else {
                reject(new Error("Failed to refresh token"));
              }
            });
          });
        } else {
          // Start a new token refresh process
          const newToken = await refreshAccessToken();

          if (newToken) {
            response = await makeFetch(
              newToken,
              requestUrl,
              method,
              contentType,
              requestData,
            );
          } else {
            throw new Error("Failed to refresh token");
          }
        }
      }

      if (!response.ok) {
        const result = await response.json();
        throw result;
      }

      const isDeleteOrLogoutResponse =
        response.status === 204 || response.status === 205;
      const result = isDeleteOrLogoutResponse
        ? { status: response.status, data: "Success" }
        : await response.json();
      setData({ ...result, status: response.status }); // Store the result in state
      return { ...result, status: response.status };
    } catch (err) {
      setError(err);
      throw err; // Re-throw the error to handle it in the calling component
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, makeRequest };
};

export default useRequest;
