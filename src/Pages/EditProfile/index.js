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
  const [activeTab, setActiveTab] = useState("profile");
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
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/profiles/updateProfile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data) {
        toast.success("Profile updated successfully");
        setloading(false);
      }
    } catch (error) {
      console.log("error", error);
      setloading(false);
      toast.error("Error updating profile");
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
              </div>
              <div className="data-row flex flex-col">
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
                <div className="row-tag">Social Connections</div>
                <div className="desc">Help collection verify your account by connecting Twitter</div>
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
                    placeholder="Twitter Link"
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
                  className="txt cleanbtn"
                  placeholder="Wallet Address"
                  value={profileData?.wallet_address}
                  disabled
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
        )}

        {/* Security & MFA Tab Content */}
        {activeTab === 'security' && (
          <div className="security-container">
            <div className="security-section">
              <h3 className="text-xl font-semibold mb-4">Multi-Factor Authentication</h3>
              <p className="text-gray-600 mb-6">
                Secure your account with two-factor authentication using your mobile device.
              </p>
              <MFASettings userEmail={user?.email} userId={user?.id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;

