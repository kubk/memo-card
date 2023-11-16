import { getCloudValue, setCloudValue } from "../lib/telegram/cloud-storage.ts";

export const persistSkeletonLoaderData = (
  publicCount: number,
  myDeckCount: number,
) => {
  setCloudValue("publicCount", publicCount.toString());
  setCloudValue("myDecksCount", myDeckCount.toString());
};

const isNumeric = (value: any): value is string => /^\d+$/.test(value);

const defaultValues = { publicCount: 3, myDecksCount: 3 };

export const getSkeletonLoaderData = async () => {
  try {
    const [publicCount, myDecksCount] = await Promise.all([
      getCloudValue("publicCount"),
      getCloudValue("myDecksCount"),
    ]);

    if (isNumeric(publicCount) && isNumeric(myDecksCount)) {
      return {
        publicCount: parseInt(publicCount),
        myDecksCount: parseInt(myDecksCount),
      };
    }
  } catch (e) {
    return defaultValues;
  }

  return defaultValues;
};
