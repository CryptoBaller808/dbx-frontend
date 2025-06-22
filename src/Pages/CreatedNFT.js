import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowBackIcon, DropDownIcon, PlusIcon } from "../Icons";
import Toggle from "../components/Toggle";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const CreatedNFT = () => {
  const { id } = useParams();

  const [is_unlockable_content, setis_unlockable_content] = useState(false);
  const [unlockable_content, setunlockable_content] = useState("");
  const [is_explicit_content, setis_explicit_content] = useState(false);
  const [explicit_content, setexplicit_content] = useState("");
  const { user } = useSelector(state => state.generalReducers);
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [img, setImg] = useState();
  console.log("img", img);
  const [hide, setHide] = useState(false);
  const [hide2, setHide2] = useState(false);


  let navigate = useNavigate();
  const [addProp, setAddProp] = useState([{ key: "", value: "" }]);
  const [nftdata, setnftdata] = useState({
    // name : '',
    description: description,
    collection: "",
    properties: "",
    collection_id: "",
    user_id: user?.id,
    nft_property: addProp,
    nftimage: "",
    is_unlockable_content: "",
    unlockable_content: "",
    is_explicit_content: "",
    explicit_content: "",
    title,
    description: "",
    external_link: "",
  });

  const [api_loading, setapi_loading] = useState(false);

  const [selectioncollection, setselectioncollection] = useState();
  const [xrp, setxrp] = useState();

  const getNFTDetail = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}//mint/getNftById/${id}`);
      console.log("resp1", res?.data);
      if (res?.data) {
        setImg(res?.data?.image_uri);
        settitle(res?.data?.title);
        setdescription(res?.data?.description);
        setis_unlockable_content(res?.data?.is_unlockable_content);
        setis_explicit_content(res?.data?.is_expilict_content);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    document.addEventListener("click", () => {
      setHide(false);
      setHide2(false);
    });
    getNFTDetail();
  }, []);

  return (
    <div className="single-nft flex">
      <div className="wrapWidth wrap flex flex-col aic">
        <div className="pg-hdr flex">
          <Link to="/nft-create" className="back-btn flex aic">
            <ArrowBackIcon />
            <div className="lbl">Go Back</div>
          </Link>
        </div>
        <div className="meta flex flex-col">
          <div className="pg-tag">Created NFT</div>
          <div className="blk flex flex-col">
            <div className="row flex flex-col items-center justify-center w-full">
              <div className="select-img flex aic jc justify-center">
                <div className={`img-box flex flex-col aic jc ${img ? "" : "bdr"}`}>
                  {img ? (
                    <img src={img} className="img" />
                  ) : (
                    <>
                      <img src="./images/upload-icon.svg" className="icon" />
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="row flex flex-col">
              <div className="r-lbl flex flex-col">
                <div className="lbl-1">Name</div>
              </div>
              <input type="text" className="txt cleanbtn" placeholder="Item name" value={title} disabled />
            </div>
            <div className="row flex flex-col">
              <div className="r-lbl flex flex-col">
                <div className="lbl-1">Description</div>
              </div>
              <textarea type="text" className="txt cleanbtn h100" placeholder="Description..." value={description} disabled />
            </div>

            <div className="row flex aic">
              <div className="left flex flex-col">
                <div className="lbl1">Unlockable Content</div>

                {is_unlockable_content && <textarea disabled value={unlockable_content} className="txt-area cleanbtn" />}
              </div>
              <div className="right flex aic">
                <Toggle setToggle={setis_unlockable_content} />
              </div>
            </div>
            {/* <div className="row flex aic">
              <div className="left flex flex-col">
                <div className="lbl1">Explicit and sensitive content</div>
              </div>
              <div className="right flex aic">
                <Toggle setToggle={setis_explicit_content} />
              </div>
            </div> */}
            {/* <div className="row flex flex-col">
              <div className="r-lbl flex flex-col">
                <div className="lbl-1">Supply</div>
                <div className="lbl-2">The number of items that can be minted. ".00001 XRP"</div>
              </div>
              <input disabled type="text" className="txt cleanbtn w-1/2" placeholder="1" />
            </div> */}
          </div>
          {/* <div className="action flex aic jc">
            <div className="btn button">{api_loading ? "Loading..." : "Create NFT"}</div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default CreatedNFT;
