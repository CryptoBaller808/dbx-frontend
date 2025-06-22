import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowBackIcon, CollectiblesIcon, DropDownIcon, SearchIcon } from "../Icons";
import Toggle from "../components/Toggle";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
const CollectionNft = () => {
  const [img, setImg] = useState();
  const [featImg, setFeatImg] = useState();
  const [bannerImg, setBannerImg] = useState();
  const [royalties, setRoyalties] = useState();
  const { user } = useSelector(state => state.generalReducers);
  const [hide, setHide] = useState(false);
  const [hide2, setHide2] = useState(false);
  const [statusData, setStatusData] = useState([
    { id: 1, title: "XRP" },

  ]);
  const [selectedcompany, setselectedcompany] = useState('');
  const [collection_custom_url, setCollection_custom_url] = useState("");
  const [discord_url, setdiscord_url] = useState("");
  const [insta_url, setinsta_url] = useState("");
  const [fb_url, setfb_url] = useState("");
  const [twitter_url, settwitter_url] = useState("");
  const [name, setname] = useState("");
  const [category_id, setcategory_id] = useState("");
  const [description, setdescription] = useState("");
  const [categories, setcategories] = useState([]);
  const [loading, setloading] = useState(false);
  const [customUrlCheck, setCustomUrlCheck] = useState(false);
  const [selectioncategory, setselectioncategory] = useState("");
  const api_getcatogories = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/getCategories`);
    setcategories(res?.data);
  };

  let currentUrl = window.location.origin;
  console.log(currentUrl);


  // handle custom url 
  const handleCustomUrl = (e) => {
    setCollection_custom_url((e.target.value).trim());
  }

  // handle copy url
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`${currentUrl}/collection/${collection_custom_url}`);
    alert('Url Copied')
  }

  // verify the custom url 
  const verifyCustomUrl = async () => {
    if(collection_custom_url === ""){
      toast.error("Enter the custom url");
    }else {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/collection/checkCustomUrl/${collection_custom_url}`);
        const data = res.data;
        console.log(data);
        if(data?.available){
          setCustomUrlCheck(true);
          toast.success("custom url is available");
        }else {
          setCustomUrlCheck(false);
          setCollection_custom_url('');
          toast.error("Custom URL does not exist, please select another name");
        }
      }catch(e) {
        console.log(e);
        toast.error(e.message);
      }
    }
  }

  const create_collectionnft = async () => {

    if(!customUrlCheck) return toast.error('Please verify custom url'); 
    let thedata = {
      // profile_image,
      // cover_image,
      collection_custom_url,
      fb_url,
      discord_url: discord_url,
      insta_url: insta_url,
      twitter_url: twitter_url,
      user_id: user.id,
      name: "adasd",
      category_id: selectioncategory?.id,
      royalty: royalties,
    };

    let formData = new FormData();
    formData.append("profile_image", img);
    formData.append("cover_image", bannerImg);
    formData.append("name", name);
    formData.append("collection_custom_url", thedata.collection_custom_url);
    formData.append("discord_url", thedata.discord_url);
    formData.append("insta_url", thedata.insta_url);
    formData.append("twitter_url", thedata.twitter_url);
    formData.append("user_id", thedata.user_id);
    formData.append("category_id", thedata.category_id);
    formData.append("royalty", thedata.royalty);

    setloading(true);
    //toast.info("Please accept request from your app")
    try {
      console.log("reached");
      const res = await axios({
        method: "post",
        url: `${process.env.REACT_APP_API_URL}/collection/createCollection`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      //window.location.href = "./nft";
      //const res = await axios.post(`${process.env.REACT_APP_API_URL}/collection/createCollection`,formData)
      setdiscord_url("");
      setinsta_url("");
      setCollection_custom_url("");
      setfb_url("");
      settwitter_url("");
      setname("");
      setcategory_id("");
      setdescription("");
      toast("Collection added successfully");
      console.log("res", res);
      if (res?.data) {
        console.log("res", res);
        window.location.href = "./nft";
      }
    } catch (error) {
      console.log("error", error.response);
      if (error?.response?.data) {
        toast.error(`${error?.response?.data}`);
      }
    }
  };
  useEffect(() => {
    api_getcatogories();
    document.addEventListener("click", () => {
      setHide(false);
      setHide2(false);
    });
  }, []);

  return (
    <div className="collection-nft flex">
      <div className="wrapWidth wrap flex flex-col aic">
        <div className="pg-hdr flex">
          <Link to="/nft-create" className="back-btn flex aic">
            <ArrowBackIcon />
            <div className="lbl">Go Back</div>
          </Link>
        </div>
        <div className="meta flex flex-col">
          <div className="pg-tag">Create Your Collection</div>
          <div className="blk flex flex-col">
            <div className="req-lbl flex aic">
              <span className="star">*</span>Required field.
            </div>
            <div className="row flex flex-col">
              <div className="r-lbl flex flex-col">
                <div className="lbl-1">
                  Logo Image
                  <span className="star">*</span>
                </div>
                <div className="lbl-2">This image will also be used for navigation. 350 x 350 recommended.</div>
              </div>
              <div className="select-img flex aic jc">
                <div
                  className={`img-box flex flex-col aic jc round ${img ? "" : "bdr"}`}
                  onClick={() => document.getElementById("upload_img").click()}>
                  {img ? (
                    <img src={URL.createObjectURL(img)} className="img round" />
                  ) : (
                    <>
                      <img src="./images/upload-icon.svg" className="icon " />
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    title=""
                    id="upload_img"
                    className="select-file cleanbtn"
                    onChange={e => {
                      let file = e.target.files[0];
                      //setImg(e.target.files[0]);
                      setImg(file);
                    }}
                  />
                </div>
              </div>
            </div>
            {/* <div className="row flex flex-col">
              <div className="r-lbl flex flex-col">
                <div className="lbl-1">
                  Featured Image
                  <span className="star"></span>
                </div>
                <div className="lbl-2">
                  This image will be used for featuring your collection on the homepage, category pages, or other promotional areas of
                  Digital Block Exchange NFT Marketplace. 600 x 400 recommended.
                </div>
              </div>
              <div className="select-img flex aic jc">
                <div
                  className={`img-box flex flex-col aic jc ${featImg ? "" : "bdr"}`}
                  onClick={() => document.getElementById("feature_img").click()}>
                  {featImg ? (
                    <img src={URL.createObjectURL(featImg)} className="img" />
                  ) : (
                    <>
                      <img src="./images/upload-icon.svg" className="icon" />
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    title=""
                    id="feature_img"
                    className="select-file cleanbtn"
                    onChange={e => {
                      let file = e.target.files[0];
                      setFeatImg(file);
                    }}
                  />
                </div>
              </div>
            </div> */}
            <div className="row flex flex-col">
              <div className="r-lbl flex flex-col">
                <div className="lbl-1">
                  Banner Image
                  <span className="star"></span>
                </div>
                <div className="lbl-2">
                  This image will appear at the top of your collection page. Avoid including too much text in this banner image, as the
                  dimensions change on different devices. 1400 x 400 recommended.
                </div>
              </div>
              <div className="select-img flex aic jc">
                <div
                  className={`img-box flex flex-col aic jc img-box-c ${bannerImg ? "" : "bdr"}`}
                  onClick={() => document.getElementById("banner_img").click()}>
                  {bannerImg ? (
                    <img src={URL.createObjectURL(bannerImg)} className="img " />
                  ) : (
                    <>
                      <img src="./images/upload-icon.svg" className="icon" />
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    title=""
                    id="banner_img"
                    className="select-file cleanbtn"
                    onChange={e => {
                      let file = e.target.files[0];
                      setBannerImg(file);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="row flex flex-col">
              <div className="r-lbl flex flex-col">
                <div className="lbl-1">
                  Name
                  <span className="star">*</span>
                </div>
              </div>
              <input
                type="text"
                className="txt cleanbtn"
                placeholder="Ex: The Best of the Sea"
                value={name}
                onChange={e => setname(e.target.value)}
              />
            </div>
            <div className="row flex flex-col">
              <div className="r-lbl flex flex-col">
                <div className="lbl-1">URL</div>
                <div className="lbl-2">Customize your URL on Digital Block Exchange NFT Marketplace</div>
              </div>
              <div className="flex align-items-center">
                <p className="custom-url">{`${currentUrl}/collection/`}</p>
                <input
                  value={collection_custom_url}
                  onChange={handleCustomUrl}
                  type="text"
                  className="txt cleanbtn custom-url-input"
                  placeholder="URL"
                />
                <button className="btn button verify-btn" onClick={verifyCustomUrl}>Verify</button>
                {collection_custom_url !== "" && <button className="btn button copy-btn" onClick={handleCopyUrl} title="Copy Url">Copy</button>}
              </div>

            </div>
            <div className="row flex flex-col">
              <div className="r-lbl flex flex-col">
                <div className="lbl-1">
                  Description
                  <span className="star"></span>
                </div>
                <div className="lbl-2">0 of 1000 characters used.</div>
              </div>
              <textarea
                type="text"
                className="txt cleanbtn h100"
                placeholder="Description..."
                value={description}
                onChange={e => setdescription(e.target.value)}
              />
            </div>
            {/* <div className="row flex flex-col">
              <div className="r-lbl flex flex-col">
                <div className="lbl-1">
                  Category
                  <span className="star"></span>
                </div>
                <div className="lbl-2">
                  Select the category. Adding a category will make the item
                  discoverable on Digital Block Exchange NFT Marketplace.
                </div>
              </div>
              <div className="search-box flex aic w-1/2">
                <div className="ico">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  className="txt-search cleanbtn"
                  placeholder="Search"
                />
              </div>
            </div> */}
            <div className="row flex flex-col">
              <div className="r-lbl flex flex-col">
                <div className="lbl-1">Collection</div>
                <div className="lbl-2">
                  Select the category. Adding a category will make the item discoverable on Digital Block Exchange NFT Marketplace.
                </div>
              </div>
              <div className="dropDown flex aic jc flex-col rel">
                <div className="category flex aic">
                  <div
                    className="cbox cleanbtn flex aic rel"
                    onClick={e => {
                      e.stopPropagation();
                      setHide2(!hide2);
                    }}>
                    <div className="slt flex aic">
                      <div className="unit-name flex aic font s14 b4">
                        <span className="unit-eng flex aic font s14 b4" placeholder="Select collection">
                          {selectioncategory ? ` ${selectioncategory.category_name} - ${selectioncategory.id}` : "Select category"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <DropDownIcon />
                    </div>
                  </div>
                </div>
                <div className={`block flex aic abs ${hide2 ? "show" : ""}`}>
                  <div className="manue flex aic col anim">
                    {categories.map((item, index) => (
                      <div
                        key={index}
                        className="slt flex aic"
                        onClick={e => {
                          setHide2(!hide2);
                          setselectioncategory(item);
                        }}>
                        <div className="unit-name flex aic font s14 b4">
                          <span className="unit-eng flex aic font s14 b4">
                            {item.category_name} - {item.id}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="row flex flex-col">
              <div className="r-lbl flex flex-col">
                <div className="lbl-1">Royalties</div>
                <div className="lbl-2">
                  Collect a fee when a user re-sells an item you originally created. This is deducted from the final sale price and paid
                  monthly to a payout address of your choosing.
                </div>
              </div>
              <input
                type="text"
                className="txt cleanbtn w-1/5"
                placeholder="e.g. 10%"
                value={royalties}
                onChange={e => setRoyalties(e.target.value)}
              />
            </div>
            {royalties && (
              <div className="row flex flex-col">
                <div className="r-lbl flex flex-col">
                  <div className="lbl-1">
                    Your payout wallet address
                    <span className="star">*</span>
                  </div>
                </div>
                <input type="text" className="txt cleanbtn w-1/2" placeholder=" Your payout wallet address" />
              </div>
            )}
            <div className="row flex flex-col">
              <div className="r-lbl flex flex-col">
                <div className="lbl-1">Blockchain</div>
                <div className="lbl-2">Select the blockchain where you would like new items added to this collection.</div>
              </div>
              <div className="dropDown flex aic jc flex-col rel">
                <div className="category flex aic">
                  <div
                    className="cbox cleanbtn flex aic rel"
                    onClick={e => {
                      e.stopPropagation();
                      setHide(!hide);
                    }}>
                    <div className="slt flex aic">
                      <div className="unit-name flex aic font s14 b4">
                        <span className="unit-eng flex aic font s14 b4" placeholder="Select collection">
                          {selectedcompany ? selectedcompany : "Select collection"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <DropDownIcon />
                    </div>
                  </div>
                </div>
                <div className={`block flex aic abs ${hide ? "show" : ""}`}>
                  <div className="manue flex aic col anim">
                    <div
                      className="slt flex aic">
                      <div className="unit-name flex aic font s14 b4" onClick={() => setselectedcompany('XRP')}>
                        <img src="https://cryptologos.cc/logos/history/xrp-logo-2012.png?v=003" alt="xrp" className="xrp-dropdown-img" />
                        <span className="unit-eng flex aic font s14 b4">XRP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row flex aic">
              <div className="left flex flex-col">
                <div className="lbl1">Explicit and sensitive content</div>
                <div className="lbl2">Set this collection as explicit and sensitive content</div>
              </div>
              <div className="right flex aic">
                {" "}
                <Toggle />
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              create_collectionnft();
            }}
            className="action flex aic jc">
            <div className="btn button">{loading ? "Loading..." : "Create NFT Collection"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionNft;
