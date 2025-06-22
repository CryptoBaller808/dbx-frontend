import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { InstagramIcon, LanguageIcon, TwitterIcon } from "../../Icons";
import { toast } from "react-toastify";
import { MFASettings } from "../../components/MFA";

const EditProfile = () => {
  const { user } = useSelector(state => state.generalReducers);
  const [profile_image, setprofile_image] = useState();
  const [cover_image, setcover_image] = useState();
  const [loading, setloading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // Add tab state
  const [profileData, setProfileData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    bio: "",
    profile_image: "",
    cover_image: "",
    insta_url: "",
    twitter_url: "",
    discord_url: "",
    fb_url: "",
    wallet_address: "",
  });
  const handleProfileData = e => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };
  const dispatch = useDispatch();
  useEffect(() => {
    setProfileData(user);
  }, [user]);

  const update_profile = async () => {
    // if (!firstname || !lastname || !email) {
    //   return toast.error("Please fill all necessary fields");
    // }
    let formData = new FormData();
    formData.append("id", user.id);
    formData.append("firstname", profileData.firstname);
    formData.append("lastname", profileData.lastname);
    formData.append("email", profileData.email);
    formData.append("bio", profileData.bio);
    formData.append("profile_image", profile_image);
    formData.append("cover_image", cover_image);
    formData.append("insta_url", profileData.insta_url);
    formData.append("twitter_url", profileData.twitter_url);
    formData.append("discord_url", profileData.discord_url);
    formData.append("fb_url", profileData.fb_url);

    setloading(true);
    try {
      const res = await axios({
        method: "post",
        url: `${process.env.REACT_APP_API_URL}/profiles/updateUser`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      window.location.href = "./profile";
      //const res = await axios.post(`${process.env.REACT_APP_API_URL}/collection/createCollection`,formData)
      toast("Profile Update successfully");
      console.log("res", res);
      if (res?.data) {
        let data = JSON.parse(localStorage.getItem("nft_login"));
        const res2 = await axios.get(`${process.env.REACT_APP_API_URL}/profiles/getuserProfile/${data.id}`);
        if (res2?.data) {
          dispatch({
            type: "GET_USER",
            payload: { ...data, ...res2.data },
          });
        }
        setloading(false);
      }
    } catch (error) {
      console.log("error", error);
      console.log("error", error.response);
    }
  };
  return (
    <div className="edit-profile flex">
      <div className="wrapWidth wrap flex flex-col">
        <div className="page-hdr flex flex-col">
          <div className="page-heading">Account Settings</div>
        </div>
        
        {/* Tab Navigation */}
        <div className="tab-navigation flex mb-6 border-b">
          <button 
            className={`tab-btn px-4 py-2 mr-4 ${activeTab === 'profile' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Settings
          </button>
          <button 
            className={`tab-btn px-4 py-2 ${activeTab === 'security' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('security')}
          >
            Security & MFA
          </button>
        </div>

        {/* Profile Tab Content */}
        {activeTab === 'profile' && (
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Settings
          </button>
          <button 
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Security & MFA
          </button>
        </div>

        {/* Profile Tab Content */}
        {activeTab === 'profile' && (
        <div className="data-container flex">
          <div className="left flex flex-col">
            <div className="data-row flex flex-col">
              <div className="row-tag">First Name</div>
              <input
                type="text"
                name="firstname"
                className="txt cleanbtn"
                placeholder="First Name"
                value={profileData.firstname}
                onChange={handleProfileData}
              />
            </div>
            <div className="data-row flex flex-col">
              <div className="row-tag">Last Name</div>
              <input
                type="text"
                name="lastname"
                className="txt cleanbtn"
                placeholder="Last Name"
                value={profileData.lastname}
                onChange={handleProfileData}
              />
            </div>          <div className="data-row flex flex-col">
              <div className="row-tag">Bio</div>
              <input
                type="text"
                name="bio"
                className="txt cleanbtn"
                placeholder="Bio"
                value={profileData.bio}
                onChange={handleProfileData}
              />
            </div>
            <div className="data-row flex flex-col">
              <div className="row-tag">Email Address</div>
              <input
                type="text"
                name="email"
                className="txt cleanbtn"
                placeholder="Email Address"
                value={profileData.email}
                onChange={handleProfileData}
              />
            </div>
            <div className="data-row flex flex-col">
              <div className="row-tag">Soical Connections</div>
              <div className="desc">Help collection verify your accout by connectiing Twiter</div>
            </div>

            <div className="social-links flex flex-col">
              <div className="row-tag">Links</div>

              <div className="input-box flex items-center">
                <div className="icon">
                  <TwitterIcon />
                </div>
                <input
                  type="text"
                  name="twitter_url"
                  className="txt cleanbtn"
                  placeholder="Instagram Link"
                  value={profileData.twitter_url}
                  onChange={handleProfileData}
                />
              </div>

              <div className="input-box flex items-center">
                <div className="icon">
                  <InstagramIcon />
                </div>
                <input
                  type="text"
                  name="insta_url"
                  className="txt cleanbtn"
                  placeholder="Instagram Link"
                  value={profileData.insta_url}
                  onChange={handleProfileData}
                />
              </div>
              <div className="input-box flex items-center">
                <div className="icon">
                  <LanguageIcon />
                </div>
                <input
                  type="text"
                  name="fb_url"
                  className="txt cleanbtn"
                  placeholder="Facebook Link"
                  value={profileData.fb_url}
                  onChange={handleProfileData}
                />
              </div>
              <div className="input-box flex items-center">
                <div className="icon">
                  <LanguageIcon />
                </div>
                <input
                  type="text"
                  name="discord_url"
                  className="txt cleanbtn"
                  placeholder="Discord Link"
                  value={profileData.discord_url}
                  onChange={handleProfileData}
                />
              </div>
            </div>
            <div className="data-row flex flex-col">
              <div className="row-tag">Wallet Address</div>
              <input
                type="text"
                value={"0xaef0de5424ea78447791451e630fb3bdb7108be"}
                className="txt cleanbtn bg-black cfff"
                disable={true}
                placeholder="Wallet Address"
                value={profileData?.wallet_address}
              />
            </div>
            <div onClick={update_profile} className="update-btn flex items-center">
              <div className="btn button">{loading ? "Updating..." : "Save"}</div>
            </div>
          </div>
          <div className="right flex flex-col">
            <div className="data-row flex flex-col">
              <div className="r-lbl flex flex-col">
                <div className="row-tag">Profile Image</div>
              </div>
              <div className="select-img flex aic jc">
                <div
                  className={`img-box flex flex-col aic jc overflow-hidden round ${profile_image ? "" : "bdr"}`}
                  onClick={() => document.getElementById("upload_img").click()}>
                  {profile_image ? (
                    <img src={URL.createObjectURL(profile_image)} className="img" />
                  ) : profileData.profile_image ? (
                    <img src={profileData.profile_image} className="img" />
                  ) : (
                    <>
                      <img src="./images/upload-icon.svg" className="icon" />
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
                      setprofile_image(file);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="data-row flex flex-col">
              <div className="r-lbl flex flex-col">
                <div className="row-tag">Profile Banner</div>
              </div>
              <div className="select-img flex aic jc">
                <div
                  className={`img-box flex flex-col aic jc img-box-c ${cover_image ? "" : "bdr"}`}
                  onClick={() => document.getElementById("banner_img").click()}>
                  {cover_image ? (
                    <img src={URL.createObjectURL(cover_image)} className="img object-fill h-full w-full" />
                  ) : profileData.cover_image ? (
                    <img src={profileData.cover_image} className="img object-fill h-full w-full" />
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
                      setcover_image(file);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
