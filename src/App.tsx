import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Ionic Dark Mode */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

/* Pages */
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';


setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        {/* Landing page */}
        <Route exact path="/gis-mapping-capstone2025" component={LandingPage} />

        {/* Signup page */}
        <Route exact path="/signup" component={Signup} />

        {/* ✅ Login page */}
        <Route exact path="/login" component={Login} />

        {/* ✅ Dashboard page */}
        <Route exact path="/dashboard" component={Dashboard} />

        {/* Redirect root to landing page */}
        <Redirect exact from="/" to="/gis-mapping-capstone2025" />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
