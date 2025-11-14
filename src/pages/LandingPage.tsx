import React, { useRef } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import "./LandingPage.css";

const LandingPage: React.FC = () => {
  const router = useIonRouter();
  const homeRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const servicesRef = useRef<HTMLDivElement | null>(null);

  const scrollTo = (section: "home" | "about" | "services") => {
    const sectionRef =
      section === "home" ? homeRef : section === "about" ? aboutRef : servicesRef;
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ✅ Function for redirecting to Login Page
  const handleGetStarted = () => {
    router.push("/login", "forward");
  };

  return (
    <IonPage>
      {/* ✅ Custom Header */}
      <IonHeader translucent>
        <IonToolbar>
          {/* 🔹 Replaced text “BUGTA” with small logo image */}
          <IonTitle className="toolbar-title">
            <img
              src="https://scontent.fmnl13-1.fna.fbcdn.net/v/t1.15752-9/522910962_729927136312896_982346129202668681_n.png?stp=dst-png_s480x480&_nc_cat=104&ccb=1-7&_nc_sid=0024fc&_nc_eui2=AeG7Lc0Y4KMg1EvxOtBlRS6gLTtn94KxtvItO2f3grG28q0Bncn_YCOKRCYNWzk2gi09uaCuObFS9BTgjn9i6hiF&_nc_ohc=zDIrCWxhKnkQ7kNvwH0hRxM&_nc_oc=Adl31H_rZGICJiK2ZAZvvLAI46SEVWd9uvHOvKrYIlvfoXSKCMR1cTpLIC03dPaTRms&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.fmnl13-1.fna&oh=03_Q7cD3gE8owAjI7TkhbcPFSP8d-tRC5upuqPBRRVfLyz_m6K9Gg&oe=6927DCC3"  /* 🔸 replace this URL with your actual logo URL */
              alt="Logo"
              className="header-logo"
            />
          </IonTitle>
          <IonButtons slot="end" className="toolbar-buttons">
            <IonButton className="hover-glow" fill="clear" onClick={() => scrollTo("home")}>
              <span>Home</span>
            </IonButton>
            <IonButton className="hover-glow" fill="clear" onClick={() => scrollTo("about")}>
              <span>About Us</span>
            </IonButton>
            <IonButton className="hover-glow" fill="clear" onClick={() => scrollTo("services")}>
              <span>Services</span>
            </IonButton>
            <IonButton className="hover-glow" fill="clear" onClick={() => router.push("/contact", "forward")}>
              <span>Contact</span>
            </IonButton>
            <IonButton className="hover-glow" fill="outline" onClick={() => router.push("/signup", "forward")}>
              <span>Sign In</span>
            </IonButton>
            <IonButton className="hover-glow" onClick={() => router.push("/login", "forward")}>
              <span>Log In</span>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* ✅ Home Section */}
        <div ref={homeRef} className="section-container">
          <div className="logo-background">
            <img src="/assets/logo.png" alt="Logo" />
          </div>

          <div className="home-content">
            <div className="home-text">
              <h1>SOIL NUTRIENT PROFILING</h1>
              <p> Municipal Agriculture Office</p>

              {/* ✅ Redirects to Login Page */}
              <IonButton fill="solid" color="warning" onClick={handleGetStarted}>
                Get Started
              </IonButton>
            </div>

            <div className="home-images">
              <div className="glow-box small-box">
                <Swiper
                  className="swiper-container-custom"
                  modules={[Autoplay]}
                  autoplay={{ delay: 1900, disableOnInteraction: false }}
                  allowTouchMove={false}
                  loop={true}
                >
                  <SwiperSlide>
                    <img src="https://static.vecteezy.com/system/resources/thumbnails/050/920/478/small_2x/the-layer-of-asphalt-road-with-soil-and-rock-photo.jpg" />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img src="https://img.freepik.com/premium-photo/detailed-island-soil-stratification-layers-with-colorful-soil-horizons_1199394-72792.jpg" />
                  </SwiperSlide>
                </Swiper>
              </div>

              <div className="glow-box large-box">
                <Swiper
                  className="swiper-container-custom"
                  modules={[Autoplay]}
                  autoplay={{ delay: 4900, disableOnInteraction: false }}
                  allowTouchMove={false}
                  loop={true}
                >
                  <SwiperSlide>
                    <img src="https://img.freepik.com/premium-photo/detailed-island-soil-stratification-layers-with-colorful-soil-horizons_1199394-72549.jpg" />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img src="https://static.vecteezy.com/system/resources/previews/021/896/230/large_2x/soil-horizon-each-horizon-is-different-in-color-surface-texture-structure-porosity-and-soil-reaction-there-are-5-horizons-namely-o-a-b-c-and-r-horizon-respectively-from-the-soil-surface-photo.jpg" />
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div ref={aboutRef} className="section-container">
          <div className="about-box">
            <h2>About Us</h2>
            <p>
              Our system utilizes GIS mapping technology to conduct accurate soil nutrient
              profiling, helping farmers and agricultural officials make informed decisions.
              We aim to boost agricultural productivity by providing precise, localized soil
              data for the Municipality of Agriculture, Manolo Fortich Bukidnon.
            </p>
          </div>
        </div>

        {/* Services Section */}
        <div ref={servicesRef} className="section-container">
          <div className="services-container">
            <h2>Our Services</h2>
            <div className="services-grid">
              <div className="service-card">
                <img src="https://cdn-icons-png.flaticon.com/512/2906/2906277.png" alt="Service Icon" />
                <h3>GIS Soil Mapping</h3>
                <p>Accurate mapping of soil nutrients using geolocation.</p>
                <IonButton size="small" fill="outline" color="light" onClick={() => router.push("/gis-mapping")}>
                  Learn More
                </IonButton>
              </div>
              <div className="service-card">
                <img src="https://cdn-icons-png.flaticon.com/512/2917/2917992.png" alt="Service Icon" />
                <h3>Soil Testing</h3>
                <p>Field testing and analysis of soil samples for productivity.</p>
                <IonButton size="small" fill="outline" color="light" onClick={() => router.push("/soil-testing")}>
                  Learn More
                </IonButton>
              </div>
              <div className="service-card">
                <img src="https://cdn-icons-png.flaticon.com/512/2166/2166820.png" alt="Service Icon" />
                <h3>Farmer Education</h3>
                <p>Training and workshops for farmers on best practices.</p>
                <IonButton size="small" fill="outline" color="light" onClick={() => router.push("/education")}>
                  Learn More
                </IonButton>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LandingPage;
