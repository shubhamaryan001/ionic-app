import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import moment from "moment";

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardTitle,
  IonInput,
  IonItem,
  IonButton,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonCardHeader,
  IonBadge,
  IonAvatar,
  IonText
} from "@ionic/react";
import { razorPayOptions } from "./AddWalletPayment";
import { getUserBalance } from "../Core/ApiCore";
import { isAuthenticated, signout, getOrdersHistory } from "./UsersApi";
import { GoProject } from "react-icons/go";
import { API } from "../../config";
import "./User.css";
import DefaultImg from "../../image/dummy-user-img-1.png";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#ff9900" };
  } else {
    return { color: "#ffffff" };
  }
};

const Razorpay = window.Razorpay;

const UserProfile = ({ history }) => {
  let {
    user: { _id, name, email, mobile, wallet_balance },
    token
  } = isAuthenticated();
  const [order, setOrder] = useState([]);
  const [balc, setBalc] = useState({
    currentWalletBalance: wallet_balance
  });

  const { currentWalletBalance } = balc;

  const [values, setValues] = useState({
    amount: ""
  });

  const { amount } = values;

  const initOrder = (userId, token) => {
    getOrdersHistory(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOrder(data);
      }
    });
  };

  // Razorpay
  const rzp1 = new Razorpay(
    razorPayOptions(
      amount,
      {
        name: name ? name : "",
        email: email ? email : "",
        mobile: mobile ? mobile : "",
        _id,
        token
      },
      true
    )
  );

  const openRzrPay = event => {
    rzp1.open();
    event.preventDefault();
    getBalance();
  };

  const handleChange = name => event => {
    setValues({ ...values, ["amount"]: event.target.value });
  };

  const getBalance = async event => {
    const currentBalance = await getUserBalance({ userId: _id });
    setBalc({
      ...balc,
      ["currentWalletBalance"]: currentBalance.user.wallet_balance
    });
  };
  useEffect(() => {
    initOrder(_id, token);
    getBalance();
  }, []);

  const photoUrl = _id ? `${API}/user/photo/${_id}` : DefaultImg;

  const sort = order.sort(function(a, b) {
    if (a.createdAt < b.createdAt) return 1;
    if (a.createdAt > b.createdAt) return -1;
  });

  const showOrdersLength = () => {
    if (order.length > 0) {
      return (
        <h1 className="text-danger mb-5 display-5 text-center">
          Total orders: {order.length}
        </h1>
      );
    } else {
      return <h1 className="text-danger text-center">No orders</h1>;
    }
  };

  return (
    <IonContent>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonCard style={{ margin: "0", padding: "0", borderRadius: "0" }}>
        <IonButton expand="block" color="tertiary">
          <GoProject
            style={{ fontSize: "25px", fontWeight: "600", marginRight: "5px" }}
          />
          <a>
            <h5>Your Orders</h5>
          </a>
        </IonButton>

        <IonItem line="none">{showOrdersLength()}</IonItem>
        {order.map((o, i) => {
          return (
            <IonCard key={i}>
              <IonCardHeader
                style={{ margin: "0", padding: "0" }}
                color="success"
              >
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <span style={{ marginRight: "5px" }}>Order Id:</span>
                      {o._id}
                    </IonCol>
                    <IonCol>
                      <IonBadge style={{ float: "right" }}>{o.status}</IonBadge>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardHeader>

              {o.products.map((p, Ipro) => {
                return (
                  <>
                    <IonList lines="none" key={Ipro}>
                      <IonItem>
                        <IonAvatar style={{ marginRight: "5px" }}>
                          <img
                            src={`${API}/product/photo/${p._id}`}
                            alt={p.name}
                          />
                        </IonAvatar>
                        <IonLabel>
                          <b>{p.name}</b>
                        </IonLabel>
                      </IonItem>
                    </IonList>
                  </>
                );
              })}

              <IonGrid>
                <IonRow>
                  <IonCol>
                    <p>{moment(o.createdAt).fromNow()}</p>
                  </IonCol>
                  <IonCol>
                    <IonButton
                      style={{ float: "right" }}
                      size="small"
                      color="tertiary"
                    >
                      <a href={`/order/${o._id}`}>Order Details</a>
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCard>
          );
        })}
      </IonCard>
      <IonCard style={{}}>
        <IonCardHeader
          color="success"
          style={{ padding: "5px", marginBottom: "5px" }}
        >
          <IonText>
            <h4 style={{ textAlign: "center", color: "white" }}>
              {name}'s Profile
            </h4>
          </IonText>
        </IonCardHeader>

        <IonItem lines="none" style={{ textAlign: "center" }}>
          <img
            src={photoUrl}
            onError={i => (i.target.src = `${DefaultImg}`)}
            alt={name}
            style={{
              borderRadius: "50px",
              maxHeight: "200px",
              maxWidth: "200px",
              margin: "0 auto"
            }}
          />
        </IonItem>
        <IonItem lines="none">
          <IonLabel>
            <b>Email:</b>
            <span> {email}</span>
          </IonLabel>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>
            <b>User Id:</b>
            <span> {_id}</span>
          </IonLabel>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>
            <b>Register Mobile:</b>
            <span> {mobile}</span>
          </IonLabel>
        </IonItem>

        <IonRow>
          <IonCol>
            <IonButton expand="block">
              <a>Edit Profile</a>
            </IonButton>
          </IonCol>
        </IonRow>
      </IonCard>

      <IonCard>
        <IonCardHeader
          color="success"
          style={{ padding: "5px", marginBottom: "5px" }}
        >
          <IonText>
            <h4 style={{ textAlign: "center", color: "white" }}>Wallet Info</h4>
          </IonText>
        </IonCardHeader>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonLabel>
                  <b>Current Balance: </b>
                  <span>
                    {currentWalletBalance ? `₹ ${currentWalletBalance}` : "₹ 0"}
                  </span>
                </IonLabel>
              </IonItem>
              <IonRow>
                <IonCol>
                  <IonCard>
                    <IonItem lines="none">
                      <IonInput
                        onInput={handleChange("amount")}
                        type="number"
                        placeholder="Add To wallet"
                        value={amount}
                      ></IonInput>

                      <IonButton
                        onClick={openRzrPay}
                        id="rzp-button1"
                        size="small"
                      >
                        Add Money
                      </IonButton>
                    </IonItem>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCard>
      <IonItem lines="none" style={{ textAlign: "center" }}>
        <IonLabel>
          <IonButton
            onClick={() =>
              signout(() => {
                history.push("/home");
              })
            }
            color="danger"
          >
            Log-Out
          </IonButton>
        </IonLabel>
      </IonItem>
    </IonContent>
  );
};

export default UserProfile;
