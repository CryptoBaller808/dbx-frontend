import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import "./style.css";

function AccountComponent() {
  const [inputData, setInputData] = useState({ email: "" });

  const handleData = e => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/mail/subscribeEmail`,
      data: inputData,
    });
    toast.success("Email Submitted successfully");
    if (res.status === 200) {
      window.location.reload();
    }
  };
  return (
    <div className="subscribed-block flex">
      <div className="bg-layer flex items-center justify-between " style={{ backgroundImage: `url("acc.png")` }}>
        <div className="wrap wrapWidth flex w-full flex-col md:!flex-row items-center justify-between gap-36 ">
          <h1 className="text-white font-medium text-6xl text-center">
            Subscribe to DBX
            <br /> Newsletter
          </h1>
          <form onSubmit={handleSubmit} className="flex bg-[#f2f2f2] w-full  sm:w-[460px] h-24 py-3 px-3 gap-3 rounded-full">
            <input
              type="text"
              required
              name="email"
              value={inputData.email}
              onChange={handleData}
              placeholder="Enter your email address"
              className="cleanbtn w-full text-[#87a17c] font-medium text-xl"
            />
            <button type="submit" className="button min-w-max font-semibold text-lg rounded-full w-[260px]">
              Sign up Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AccountComponent;
