import { useEffect, useState } from "react";
import useRequest from "./use-request";

export type Amenity = {
  id: number;
  name: string;
  description: string;
};

const useAmenities = () => {
  const {
    loading: amentiyLoad,
    error: amentiyError,
    makeRequest,
  } = useRequest("properties/amenities");

  const [amenities, setAmenities] = useState<null | Amenity[]>(null);

  const fetchAmenities = async () => {
    const res = await makeRequest();
    if (res.status === 200) {
      setAmenities([...res.result]);
    }
  };

  const getAmenitiesById = async (ids: number[]): Promise<Amenity[]> => {
    // Ensure amenities are available
    if (!amenities) {
      await fetchAmenities();
    }

    // After fetch, amenities might still be null due to failure
    if (!amenities) return [];

    return amenities.filter((a) => ids.includes(a.id));
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  return {
    amenities,
    amentiyError,
    amentiyLoad,
    fetchAmenities,
    getAmenitiesById,
  };
};

export default useAmenities;
