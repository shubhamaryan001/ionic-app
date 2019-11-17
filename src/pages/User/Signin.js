import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonInput,
  IonItem,
  IonButton
} from "@ionic/react";

import { signin, isAuthenticated, authenticate } from "./UsersApi";

const Signin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    success: false,
    redirectToReferrer: false
  });
  const { email, password, redirectToReferrer, error } = values;
  const { user } = isAuthenticated();

  const handleChange = name => event => {
    console.log(name);
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const clickSubmit = event => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signin({ email, password }).then(data => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
          loading: false
        });
      } else {
        console.log(data);
        authenticate(data, () => {
          setValues({
            ...values,
            redirectToReferrer: true
          });
        });
        window.location.reload();
      }
    });
  };

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const redirectUser = () => {
    if (redirectToReferrer) {
      if (user && user.role === 1) {
        return <Redirect to="/profile" />;
      } else {
        return <Redirect to="/profile" />;
      }
    }
    if (isAuthenticated()) {
      return <Redirect to="/" />;
    }
  };

  useEffect(() => {}, []);
  return (
    <IonContent>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Signin</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonCard>
        <IonCardTitle style={{ textAlign: "center" }}>SIGNIN</IonCardTitle>
        <IonCardContent>
          {showError()}
          {redirectUser()}
          <form>
            <IonItem>
              <IonInput
                placeholder="Email"
                required
                type="email"
                onInput={handleChange("email")}
                value={email}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonInput
                onInput={handleChange("password")}
                placeholder="Password"
                required
                type="password"
                value={password}
              ></IonInput>
            </IonItem>

            <IonButton onClick={clickSubmit} expand="block">
              Login
            </IonButton>
          </form>
        </IonCardContent>
      </IonCard>
    </IonContent>
  );
};

export default Signin;
