import React, { useRef } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter
} from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';

const LandingPage: React.FC = () => {
  const router = useIonRouter();
  const homeRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const servicesRef = useRef<HTMLDivElement | null>(null);

  const scrollTo = (section: 'home' | 'about' | 'services') => {
    const sectionRef =
      section === 'home' ? homeRef :
      section === 'about' ? aboutRef :
      servicesRef;
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <IonPage>
      <style>
        {`
          .hover-glow span {
            transition: all 0.4s ease;
            display: inline-block;
          }
          .hover-glow:hover span {
            color: #fff;
            text-shadow: 0 0 8px #ffffff, 0 0 12px #ffd700;
            transform: translateY(-2px);
          }
          .hover-glow:hover {
            transform: translateY(-3px);
          }
          .glow-box {
            transition: all 0.4s ease;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            border-radius: 12px;
            overflow: hidden;
            background: #000;
          }
          .glow-box:hover {
            transform: translateY(-6px);
            box-shadow:
              0 0 20px rgba(255, 255, 255, 0.4),
              0 0 30px rgba(255, 215, 0, 0.2),
              0 0 40px rgba(255, 255, 255, 0.3);
          }
          .swiper-container-custom {
            width: 100%;
            height: 100%;
          }
          .swiper-slide img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .section-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(to left, #dee7faff, #050505ff);
            padding: 60px 20px;
          }
          .service-card {
            background-color: black;
            color: white;
            border-radius: 12px;
            padding: 20px;
            width: 300px;
            text-align: center;
            transition: transform 0.4s ease, box-shadow 0.4s ease;
          }
          .service-card:hover {
            transform: translateY(-6px);
            box-shadow:
              0 0 20px rgba(255, 255, 255, 0.4),
              0 0 30px rgba(255, 215, 0, 0.2),
              0 0 40px rgba(255, 255, 255, 0.3);
          }
        `}
      </style>

      <IonHeader translucent>
        <IonToolbar style={{ background: 'transparent', boxShadow: 'none' }}>
          <IonTitle style={{ color: 'white' }}>BUGTA</IonTitle>
          <IonButtons slot="end" style={{ gap: '27px' }}>
            <IonButton className="hover-glow" fill="clear" onClick={() => scrollTo('home')}>
              <span style={{ fontSize: '0.95rem' }}>Home</span>
            </IonButton>
            <IonButton className="hover-glow" fill="clear" onClick={() => scrollTo('about')}>
              <span style={{ fontSize: '0.95rem' }}>About Us</span>
            </IonButton>
            <IonButton className="hover-glow" fill="clear" onClick={() => scrollTo('services')}>
              <span style={{ fontSize: '0.95rem' }}>Services</span>
            </IonButton>
            <IonButton className="hover-glow" fill="clear" onClick={() => router.push('/contact', 'forward')}>
              <span style={{ fontSize: '0.95rem' }}>Contact</span>
            </IonButton>
            <IonButton className="hover-glow" fill="outline" onClick={() => router.push('/signup', 'forward')}>
              <span>Sign In</span>
            </IonButton>
            <IonButton className="hover-glow" onClick={() => router.push('/login', 'forward')}>
              <span>Log In</span>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* Home Section */}
        <div ref={homeRef} className="section-container">
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1, maxWidth: '55%', color: 'white' }}>
              <h1 style={{ fontSize: '5.7rem' }}>SOIL NUTRIENT PROFILING</h1>
              <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                Municipal of Agriculture, Manolo Fortich Bukidnon
              </p>
              <IonButton fill="solid" color="warning" onClick={() => router.push('/signup', 'forward')}>
                Get Started
              </IonButton>
            </div>
            <div style={{ flex: 1, maxWidth: '45%', display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
              <div className="glow-box" style={{ width: '370px', height: '380px' }}>
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
              <div className="glow-box" style={{ width: '550px', height: '580px' }}>
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
          <div className="glow-box" style={{ backgroundColor: 'black', borderRadius: '12px', padding: '40px', maxWidth: '800px', color: 'white', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '2rem' }}>About Us</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
              Our system utilizes GIS mapping technology to conduct accurate soil nutrient profiling, helping farmers and agricultural officials make informed decisions. We aim to boost agricultural productivity by providing precise, localized soil data for the Municipality of Agriculture, Manolo Fortich Bukidnon.
            </p>
          </div>
        </div>

        {/* Services Section */}
        <div ref={servicesRef} className="section-container">
          <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '30px' }}>Our Services</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px' }}>
              <div className="service-card">
                <img src="https://cdn-icons-png.flaticon.com/512/2906/2906277.png" alt="Service Icon" style={{ width: '50px', marginBottom: '10px' }} />
                <h3>GIS Soil Mapping</h3>
                <p>Accurate mapping of soil nutrients using geolocation.</p>
                <IonButton size="small" fill="outline" color="light" onClick={() => router.push('/gis-mapping')}>Learn More</IonButton>
              </div>
              <div className="service-card">
                <img src="https://cdn-icons-png.flaticon.com/512/2917/2917992.png" alt="Service Icon" style={{ width: '50px', marginBottom: '10px' }} />
                <h3>Soil Testing</h3>
                <p>Field testing and analysis of soil samples for productivity.</p>
                <IonButton size="small" fill="outline" color="light" onClick={() => router.push('/soil-testing')}>Learn More</IonButton>
              </div>
              <div className="service-card">
                <img src="https://cdn-icons-png.flaticon.com/512/2166/2166820.png" alt="Service Icon" style={{ width: '50px', marginBottom: '10px' }} />
                <h3>Farmer Education</h3>
                <p>Training and workshops for farmers on best practices.</p>
                <IonButton size="small" fill="outline" color="light" onClick={() => router.push('/education')}>Learn More</IonButton>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LandingPage;
