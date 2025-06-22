// import { createStore, combineReducers, applyMiddleware, compose } from "redux";
// import thunk from "redux-thunk";
// import rootReducer from "./reducers";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";

// const middlewares = [thunk];

// const store = createStore(
//   rootReducer,
//   compose(
//     compose(
//       applyMiddleware(...middlewares),
//       window.__REDUX_DEVTOOLS_EXTENSION__ &&
//         process.env.NODE_ENV === "development"
//         ? window.__REDUX_DEVTOOLS_EXTENSION__()
//         : (f) => f
//     )
//   )
// );

// const persistConfig = {
//   key: "root",
//   storage,
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = createStore(
//   persistedReducer,
//   composeEnhancers(applyMiddleware(thunk))
// );

// export const persistor = persistStore(store);

import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import rootReducer from "./reducers";

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export const persistor = persistStore(store);
