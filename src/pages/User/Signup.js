import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";

import { signup } from "./UsersApi";
import {
  IonContent,
  IonLoading,
  IonInput,
  IonCard,
  IonItem,
  IonButton,
  IonCardHeader,
  IonText
} from "@ionic/react";
import { isAuthenticated } from "./UsersApi";

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    error: "",
    success: false
  });
  const { name, email, mobile, password, success, loading, error } = values;

  const handleChange = name => event => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const clickSubmit = event => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signup({ name, email, mobile, password }).then(data => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
          success: false,
          loading: false
        });
      } else {
        setValues({
          ...values,
          name: "",
          email: "",
          mobile: "",
          password: "",
          error: "",
          success: true
        });
      }
    });
  };

  const showLoading = () =>
    loading && (
      <IonLoading isOpen={loading} message={"Loading..."}></IonLoading>
    );

  const signUpForm = () => (
    <form>
      <IonItem>
        <IonInput
          placeholder="Name"
          required
          type="text"
          onInput={handleChange("name")}
          value={name}
        ></IonInput>
      </IonItem>
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
          maxlength={10}
          minlength={10}
          placeholder="Mobile Number"
          required
          type="tel"
          onInput={handleChange("mobile")}
          value={mobile}
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

      <IonItem line="none">
        <IonText>
          <p>
            Already have an account?
            <a href="/signin">
              <IonText color="tertiary">
                <strong> Login Now</strong>
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

  const showSuccess = () => (
    <IonCard
      style={{
        display: success ? "" : "none",
        padding: "0",
        textAlign: "center",
        color: "white",
        fontWeight: "600"
      }}
    >
      <IonCardHeader color="success" style={{ padding: "5px" }}>
        <IonText>
          <IonText color="light">New account is created.Please</IonText>

          <a href="/signin">
            <IonText color="tertiary">
              <b> Signin</b>
            </IonText>
          </a>
        </IonText>
      </IonCardHeader>
    </IonCard>
  );

  const redirectUser = () => {
    if (isAuthenticated()) {
      return <Redirect to="/" />;
    }
  };

  return (
    <IonContent>
      <div style={{ marginTop: "25vh" }}>
        {showError()}
        {showSuccess()}
        {redirectUser()}
        <IonCard>{signUpForm()}</IonCard>
      </div>
    </IonContent>
  );
};

export default Signup;
