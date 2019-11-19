import React from "react";
import { Redirect, Route, withRouter } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from "@ionic/react";

import PrivateRoute from "./pages/Auth/PrivateRoute";

import { IonReactRouter } from "@ionic/react-router";
import { apps, send, home, contact, pricetags } from "ionicons/icons";
import Home from "./pages/Core/Home";
import SingleProduct from "./pages/Core/SingleProduct";

import Cart from "./pages/Core/CartPage";

import Shop from "./pages/Core/Shop";

//UserS page//

import Successfull from "./pages/Core/Successfull";

import Signin from "./pages/User/Signin";
import Signup from "./pages/User/Signup";
import UserProfile from "./pages/User/UserProfile";
import OrderDetails from "./pages/User/OrderDetails";
import { isAuthenticated } from "./pages/User/UsersApi";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import { FaCartPlus } from "react-icons/fa";

/* Theme variables */
import "./theme/variables.css";

const App: React.FC = () => {
  const Reload = () => {
    window.location.reload();
  };

  const { user } = isAuthenticated();

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/home" component={Home} exact={true} />
            <Route path="/signin" component={Signin} exact={true} />
            <Route path="/signup" component={Signup} exact={true} />
            <Route path="/shop" component={Shop} exact={true} />
            <PrivateRoute
              path="/profile"
              component={UserProfile}
              exact={true}
            />
            <PrivateRoute
              path="/order/:orderId"
              component={OrderDetails}
              exact={true}
            />
            <PrivateRoute
              path="/successfull/order"
              component={Successfull}
              exact={true}
            />
            <Route
              path="/product/:productId"
              exact={true}
              component={SingleProduct}
            />

            <Route path="/cart" component={Cart} exact={true} />

            <Route
              path="/"
              render={() => <Redirect to="/home" />}
              exact={true}
            />
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={home} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>

            <IonTabButton tab="shop" href="/shop" onClick={Reload}>
              <IonIcon icon={pricetags} />
              <IonLabel>Shop</IonLabel>
            </IonTabButton>
            {!isAuthenticated() && (
              <IonTabButton tab="signin" href="/signin" onClick={Reload}>
                <IonIcon icon={contact} />
                <IonLabel>Login/Signup</IonLabel>
              </IonTabButton>
            )}

            {isAuthenticated() && (
              <IonTabButton tab="profile" href="/profile" onClick={Reload}>
                <IonIcon icon={contact} />
                <IonLabel>Account info</IonLabel>
              </IonTabButton>
            )}
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
