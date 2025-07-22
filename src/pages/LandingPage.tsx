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

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar style={{ background: 'transparent', boxShadow: 'none' }}>
          <IonTitle style={{ color: 'white' }}>BUGTA</IonTitle>
          <IonButtons slot="end" style={{ gap: '27px' }}>
            <IonButton fill="clear" onClick={() => router.push('/contact', 'forward')} style={{ marginLeft: '35px' }}>
              <span style={{ color: 'white', fontSize: '0.95rem' }}>Home</span>
             </IonButton>
            <IonButton fill="clear" onClick={() => router.push('/contact', 'forward')} style={{ marginLeft: '35px' }}>
              <span style={{ color: 'white', fontSize: '0.95rem' }}>About Us</span>
             </IonButton>
            <IonButton fill="clear" onClick={() => router.push('/contact', 'forward')} style={{ marginLeft: '35px' }}>
              <span style={{ color: 'white', fontSize: '0.95rem' }}>Services</span>
             </IonButton>
             <IonButton fill="clear" onClick={() => router.push('/contact', 'forward')} style={{ marginLeft: '35px' }}>
              <span style={{ color: 'white', fontSize: '0.95rem' }}>Contact</span>
             </IonButton>
            <IonButton fill="outline" onClick={() => router.push('/signup', 'forward')}>
              <span style={{ color: 'white' }}>Sign In</span>
            </IonButton>
            <IonButton onClick={() => router.push('/login', 'forward')}>
              <span style={{ color: 'white' }}>Log In</span>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            background: 'linear-gradient(to left, #dee7faff, #050505ff)',
            padding: '40px',
            boxSizing: 'border-box'
          }}
        >
          {/* Left Side */}
          <div style={{ flex: 1, maxWidth: '55%', color: 'white' }}>
            <h1 style={{ fontFamily: 'sans-serif', fontSize: '4.5rem', marginBottom: '1rem' }}>SOIL NUTRIENT PROFILING</h1>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
              Municipal of Agriculture, Manolo Fortich Bukidnon 
            </p>
            <IonButton
              fill="solid"
              color="warning"
              onClick={() => router.push('/signup', 'forward')}
            >
              Get Started
            </IonButton>
          </div>

          {/* Right Side – Two Slideshow Boxes */}
          <div
            style={{
              flex: 1,
              maxWidth: '45%',
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {/* Slideshow Box 1 */}
            <div
              style={{
                width: '200px',
                height: '240px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                overflow: 'hidden'
              }}
            >
              <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 1900, disableOnInteraction: false }}
                allowTouchMove={false}
                loop={true}
                style={{ width: '100%', height: '100%' }}
              >
                <SwiperSlide>
                  <img
                  src="https://img.freepik.com/premium-photo/cassava-plantationrow-cassava-tree-field-tapioca-starch-row-manioc-sprouts-agricultural-industrial-cultivation-cassava-planting-young-plants-by-plowing-lifting-drainage-ditch_980606-35.jpg"
                    
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="https://media.istockphoto.com/id/1093461402/photo/cassava-tree-in-farm-and-sunset.jpg?s=612x612&w=0&k=20&c=I8mbMKMH1eAikVHDatdTcjGaykaJmqQ2CzlIYmZltrY="
                    
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </SwiperSlide>
              </Swiper>
            </div>

            {/* Slideshow Box 2 */}
            <div
              style={{
                width: '320px',
                height: '440px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                overflow: 'hidden'
              }}
            >
              <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 4900, disableOnInteraction: false }}
                allowTouchMove={false}
                loop={true}
                style={{ width: '100%', height: '100%' }}
              >
                <SwiperSlide>
                  <img
                    src="https://img.freepik.com/premium-photo/agriculture-field-hd-8k-wallpaper-stock-photographic-image_853645-42779.jpg"
                    
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="https://wallpapers.com/images/featured/corn-gl1zm9ohjk7r7z8z.jpg"
                    
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LandingPage;
