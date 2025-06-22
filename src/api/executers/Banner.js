import { httpClient } from "../client/CommonApi";

export const getBanners = async type => {
  return await httpClient.get(`/admindashboard/banner/get?type=${type}`);
};
 