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
import "./LandingPage.css"; // ✅ Import CSS file

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

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar className="toolbar-custom">
          <IonTitle className="toolbar-title">BUGTA</IonTitle>
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
        {/* ✅ Home Section with Logo */}
        <div ref={homeRef} className="section-container">
          <div className="logo-background">
            <img src="/assets/logo.png" alt="" />
          </div>

          <div className="home-content">
            <div className="home-text">
              <h1>SOIL NUTRIENT PROFILING</h1>
              <p>Municipal of Agriculture, Manolo Fortich Bukidnon</p>
              <IonButton fill="solid" color="warning" onClick={() => router.push("/signup", "forward")}>
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
                    <img src="https://img.freepik.com/premium-photo/cassava-plantationrow-cassava-tree-field-tapioca-starch-row-manioc-sprouts-agricultural-industrial-cultivation-cassava-planting-young-plants-by-plowing-lifting-drainage-ditch_980606-35.jpg" />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img src="https://media.istockphoto.com/id/1093461402/photo/cassava-tree-in-farm-and-sunset.jpg?s=612x612&w=0&k=20&c=I8mbMKMH1eAikVHDatdTcjGaykaJmqQ2CzlIYmZltrY=" />
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
                    <img src="https://img.freepik.com/premium-photo/agriculture-field-hd-8k-wallpaper-stock-photographic-image_853645-42779.jpg" />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img src="https://wallpapers.com/images/featured/corn-gl1zm9ohjk7r7z8z.jpg" />
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
