import { ApiCall } from "../index";
import { GET_BALANCE } from "../api/url";

export const getBalance = () => {
  let data = {
    accountNo: "rBXxrpmwd4xKVy6fTrifQ2ELo6WYBjZBbG",
  };
  return new Promise((resolve, reject) => {
    ApiCall(GET_BALANCE, "post", data)
      .then((res) => {
        console.log("res in API", res);
        resolve(res);
      })
      .catch(reject);
  });
};
