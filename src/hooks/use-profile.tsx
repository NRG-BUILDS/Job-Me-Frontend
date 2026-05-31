import { useEffect, useState } from "react";
import useRequest from "./use-request";
import { ProfileData } from "@/pages/profile";

interface Props {
  options?: {
    autoFetch?: boolean;
  };
}

const defaultOptions = { autoFetch: true };

const useProfile = (props?: Props) => {
  const options = props?.options || defaultOptions;
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const {
    loading: profileLoad,
    error: profileError,
    data,
    makeRequest: profileRequest,
  } = useRequest("users/profile/");

  // Separate effect to handle data updates
  useEffect(() => {
    if (data && data.data) {
      setProfileData({ ...data.data });
    }
  }, [data]);

  useEffect(() => {
    if (options.autoFetch) {
      profileRequest();
    }
  }, [options.autoFetch]);

  return { profileData, profileLoad, profileError, profileRequest };
};

export default useProfile;
