import React, { useEffect, useState } from "react";
import "./style.css";
import { getBanners } from "../../api/executers/Banner";

function CryptoComponent() {
  const [banner, setBanner] = useState(null);

  const handleGetBanner = async (type) => {
    try {
      const resp = await getBanners(type);
      if (resp.success) {
        setBanner(resp.data.url);
      } else {
        console.error("Banner fetch failed:", resp); // Handle failure
      }
    } catch (error) {
      console.error("Error fetching banner:", error);
    }
  };

  useEffect(() => {
    handleGetBanner("home");
    
  }, [handleGetBanner]);

  return (
    <>
      <div className="Maincrypto666">
        <div>
          {banner ? (
            banner.endsWith("mp4") ? (
              <div>
                <video
                  src={banner}
                  autoPlay
                  loop
                  muted
                  className="w-full"
                />
                {/* <div className="video-controls">
                  <button onClick={handlePlayVideo}>Play</button>
                  <button onClick={handlePauseVideo}>Pause</button>
                </div> */}
              </div>
            ) : (
              <img src={banner} alt="Banner" className="h-[430px] w-full" />
            )
          ) : (
            <div>Loading...</div> // Show loading state while banner is being fetched
          )}
        </div>
      </div>
    </>
  );
}

export default CryptoComponent;
