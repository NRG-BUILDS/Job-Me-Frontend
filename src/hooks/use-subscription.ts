import { useState, useEffect } from "react";
import useRequest from "./use-request";

type SubscriptionInfo = {
  lastChecked: string;
  subscriptionStatus: string;
};
export function useSubscription() {
  const { makeRequest, loading: isCheckingSubscription } =
    useRequest("/creators/profile");
  const [subscriptionInfo, setSubscriptionInfo] =
    useState<SubscriptionInfo | null>(() => {
      const savedInfo = JSON.parse(
        localStorage.getItem("subscription-info") || "{}"
      );
      return (savedInfo as SubscriptionInfo) || null;
    });
  const fetchUserStatus = async () => {
    try {
      const res = await makeRequest();
      if (res.status === "success") {
        const subscriptionInfo = {
          lastChecked: new Date().toISOString(),
          subscriptionStatus: res.data.subscriptionStatus,
        };
        localStorage.setItem(
          "subscription-info",
          JSON.stringify(subscriptionInfo)
        );
        setSubscriptionInfo(subscriptionInfo);
      }
    } catch (error) {
      console.error("Error fetching user status:", error);
    }
  };
  useEffect(() => {
    const isOutdated =
      new Date(subscriptionInfo.lastChecked).getTime() <
      Date.now() - 1 * 60 * 1000;
    if (!subscriptionInfo || isOutdated) {
      fetchUserStatus();
    }
  }, []);

  return {
    tier: subscriptionInfo?.subscriptionStatus,
    isPremium: subscriptionInfo?.subscriptionStatus === "active",
    isCheckingSubscription,
  };
}
