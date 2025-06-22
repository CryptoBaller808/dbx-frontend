const envData = (ENV, local, test, production) => {
  if (ENV === "local") {
    return local;
  } else if (ENV === "test") {
    return test;
  } else if (ENV === "production") {
    return production;
  } else {
    console.log(new Error("Something went wrong with credentials"));
  }
};

export const ENV_TYPE = "production"; // local // test // production

export const BASE_URL = envData(
  ENV_TYPE,
  `${process.env.REACT_APP_API_URL}/api/v1/`,
  `${process.env.REACT_APP_API_URL}/api/v1/`,
  `${process.env.REACT_APP_API_URL}/api/v1/`,
);

export const LOCAL_SOCKET_SERVER = envData(
  ENV_TYPE,
  `${process.env.REACT_APP_API_URL}`,
  `${process.env.REACT_APP_API_URL}/`,
  `${process.env.REACT_APP_API_URL}`,
);
