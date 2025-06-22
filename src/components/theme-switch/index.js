import React from "react";
import { SunIcon } from "../../Icons";
import { useDispatch, useSelector } from "react-redux";

const ThemeSwitch = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector(state => state.themeReducer);
  const handleCheckboxChange = () => {
    dispatch({
      type: "SET_THEME",
      payload: !isDarkMode,
    });
  };

  return (
    <div onClick={handleCheckboxChange}>
      <SunIcon />
    </div>
  );
};

export default ThemeSwitch;
