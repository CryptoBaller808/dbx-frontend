import React, { useEffect } from "react";
import "./style.scss";

const ListingApplication = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="listing-application-page flex">
      <div class="wrap wrapWidth flex justify-center">
        <div className="page_block flex">
          <div className="form_block flex flex-col">
            <img src="./DBX-horizontal1.svg" className="logo" />
            <h1 className="title mb-8">Listing Application</h1>
            <div className="row2 mb-6">
              <div className="row1">
                <div className="section-title">Contact Information</div>
                <div className="input-field flex flex-col">
                  <div className="flex flex-col">
                    <div className="field-lbl">Contact Name</div>
                  </div>
                  <input type="text" className="txt w-full" />
                </div>
                <div className="input-field flex flex-col">
                  <div className="flex flex-col">
                    <div className="field-lbl">Contact Title</div>
                  </div>
                  <input type="text" className="txt w-full" />
                </div>
                <div className="input-field flex flex-col">
                  <div className="flex flex-col">
                    <div className="field-lbl">Contact Email</div>
                  </div>
                  <input type="text" className="txt w-full" />
                </div>
                <div className="input-field flex flex-col">
                  <div className="flex flex-col">
                    <div className="field-lbl">Contact Phone Number</div>
                  </div>
                  <input type="text" className="txt w-full" />
                </div>
              </div>
              <div className="row1">
                <div className="section-title">Company Information</div>
                <div className="input-field flex flex-col">
                  <div className="flex flex-col">
                    <div className="field-lbl">Brief introduction of the company</div>
                  </div>
                  <textarea type="text" className="txt w-full min-h-[100px]" />
                </div>
                <div className="input-field flex flex-col">
                  <div className="flex flex-col">
                    <div className="field-lbl">Company Name</div>
                  </div>
                  <input type="text" className="txt w-full" />
                </div>
                <div className="input-field flex flex-col">
                  <div className="flex flex-col">
                    <div className="field-lbl">Company Address</div>
                  </div>
                  <input type="text" className="txt w-full" />
                </div>
                <div className="input-field flex flex-col">
                  <div className="flex flex-col">
                    <div className="field-lbl">Core Executive Name and Background (include LinkedIn profile, if available)</div>
                  </div>
                  <input type="text" className="txt w-full" />
                </div>
              </div>
            </div>
            <div className="row2 mb-6">
              <div className="row1">
                <div className="section-title">Token Information</div>
                <div className="input-field flex flex-col">
                  <div className="flex flex-col">
                    <div className="field-lbl">Full Name of Token</div>
                  </div>
                  <input type="text" className="txt w-full" />
                </div>
                <div className="input-field flex flex-col">
                  <div className="flex flex-col">
                    <div className="field-lbl">Ticker symbol</div>
                  </div>
                  <input type="text" className="txt w-full" />
                </div>
                <div className="input-field flex flex-col">
                  <div className="flex flex-col">
                    <div className="field-lbl">Token contract address</div>
                  </div>
                  <input type="text" className="txt w-full" />
                </div>
                <div className="input-field flex flex-col">
                  <div className="flex flex-col">
                    <div className="field-lbl">Total Supply</div>
                  </div>
                  <input type="text" className="txt w-full" />
                </div>
                <div className="input-field flex flex-col">
                  <div className="flex flex-col">
                    <div className="field-lbl">Total tokens in circulation</div>
                  </div>
                  <input type="text" className="txt w-full" />
                </div>
                <div className="input-field flex flex-col">
                  <div className="flex flex-col">
                    <div className="field-lbl">Link to Tokenomics</div>
                  </div>
                  <input type="text" className="txt w-full" />
                </div>
              </div>
              <div className="row1">
                <div className="section-title">Project Information</div>
                <div className="input-field flex flex-col">
                  <div className="flex flex-col">
                    <div className="field-lbl">Description of the project</div>
                  </div>
                  <textarea type="text" className="txt w-full min-h-[100px]" />
                </div>
                <div className="input-field flex flex-col">
                  <div className="flex flex-col">
                    <div className="field-lbl">Link to Roadmap</div>
                  </div>
                  <input type="text" className="txt w-full" />
                </div>
                <div className="input-field flex flex-col">
                  <div className="flex flex-col">
                    <div className="field-lbl">Current stage of project</div>
                  </div>
                  <input type="text" className="txt w-full" />
                </div>
                <div className="input-field flex flex-col">
                  <div className="flex flex-col">
                    <div className="field-lbl">White Paper link</div>
                  </div>
                  <input type="text" className="txt w-full" />
                </div>
                <div className="input-field flex flex-col">
                  <div className="flex flex-col">
                    <div className="field-lbl">Is it open source? If yes, please provide github link</div>
                  </div>
                  <input type="text" className="txt w-full" />
                </div>
              </div>
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

export default ListingApplication;
