import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import generalReducers from "./reducers/generalReducers"
import { combineReducers } from "redux";
const middleware = [thunk]

const rootreducer = combineReducers({
    generalReducers,
    //rfidReducers,
  });

const store = createStore(
    rootreducer,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store