import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonInput,
  IonItem,
  IonButton,
  IonText,
  IonCardHeader
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

  const signInForm = () => (
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

      <IonItem>
        <IonText>
          <p>
            Don't have an account?
            <a href="/signup">
              <IonText color="tertiary">
                <strong> Register Now</strong>
              </IonText>
            </a>
          </p>
        </IonText>
      </IonItem>

      <IonButton onClick={clickSubmit} expand="block">
        Login
      </IonButton>
    </form>
  );

  const showError = () => (
    <IonCard
      style={{
        display: error ? "" : "none",
        padding: "0",
        textAlign: "center",
        color: "white",
        fontWeight: "600"
      }}
    >
      <IonCardHeader color="danger" style={{ padding: "5px" }}>
        <IonText color="light">{error}</IonText>
      </IonCardHeader>
    </IonCard>
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
      <div style={{ marginTop: "25vh" }}>
        <IonText>
          <h3 style={{ textAlign: "center", fontWeight: "700" }}>SIGNIN</h3>
        </IonText>

        {showError()}
        {redirectUser()}

        <IonCard>{signInForm()}</IonCard>
      </div>
    </IonContent>
  );
};

export default Signin;
