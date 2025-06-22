import React, { useEffect } from "react";
import "./style.scss";

const ContactUs = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="contact-up-page flex">
      <div class="wrap wrapWidth flex justify-center">
        <div className="page_block flex">
          <div className="form_block flex flex-col">
            <img src="./DBX-horizontal1.svg" className="logo" />
            <h1 className="title mb-8">Contact Us</h1>
            <div className="input-field flex flex-col mb-3">
              <div className="field-lbl">Name:</div>
              <input type="text" className="txt w-full" />
            </div>
            <div className="input-field flex flex-col mb-3">
              <div className="field-lbl">Your email address:</div>
              <input type="email" className="txt w-full" />
            </div>
            <div className="input-field flex flex-col mb-3">
              <div className="field-lbl">Subject:</div>
              <input type="text" className="txt w-full" />
            </div>
            <div className="input-field flex flex-col mb-4">
              <div className="field-lbl">Description:</div>
              <textarea type="text" className="txt w-full min-h-[110px]" />
            </div>
            <div className="action flex items-center justify-center">
              <button className="btn-submit button">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
