import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCart, removeItem } from "./CartHelper";
import Checkout from "./CheckOut";
import { API } from "../../config";
import "./Home.css";
import {
  IonCard,
  IonAvatar,
  IonLabel,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonContent,
  IonTitle
} from "@ionic/react";
import { GoAlert } from "react-icons/go";

import { isAuthenticated } from "../User/UsersApi";
const CartPage = () => {
  const [items, setItems] = useState([]);

  const [run, setRun] = useState(false);
  const { user } = isAuthenticated();

  useEffect(
    () => {
      console.log("MAX DEPTH ...");
      setItems(getCart());
    },
    [run],
    [items]
  );

  const showItems = items => {
    return (
      <div>
        <h2>Your cart has {`${items.length}`} items</h2>
        <hr />
        {items.map((product, i) => (
          <IonCard key={i} style={{ borderRadius: "0", margin: "0" }}>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonAvatar>
                    <img
                      src={`${API}/product/photo/${product._id}`}
                      alt={product.name}
                    />
                  </IonAvatar>
                </IonCol>
                <IonCol>
                  <IonLabel>
                    <b>{product.name}</b>
                  </IonLabel>
                </IonCol>
                <IonCol>
                  <IonButton
                    size="small"
                    color="danger"
                    onClick={() => {
                      removeItem(product._id);
                      setRun(!run); // run useEffect in parent Cart
                    }}
                  >
                    Remove Product
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCard>
        ))}
      </div>
    );
  };

  const noItemsMessage = () => (
    <div style={{ textAlign: "center" }}>
      <h2>
        Your cart is empty. <br /> <Link to="/shop">Continue shopping</Link>
      </h2>
    </div>
  );

  return (
    <>
      {isAuthenticated() ? (
        <IonContent>
          <div>
            {items.length > 0 ? (
              <>
                <IonCard>{showItems(items)}</IonCard>
                <div>
                  <IonCard>
                    <h2 style={{ textAlign: "center" }}>Your cart summary</h2>
                    <hr />
                    <Checkout products={items} setRun={setRun} run={run} />
                  </IonCard>
                </div>
              </>
            ) : (
              noItemsMessage()
            )}
          </div>
        </IonContent>
      ) : (
        <IonContent>
          <IonCard className="cart-back">
            <IonCard className="cart-front">
              <GoAlert style={{ fontSize: "5rem", color: "#ffce00" }} />
              <div>For Buying the Product Please First Signin/Signup</div>
              <a href="/signin">
                <IonButton>
                  <h6>To Continue Signin</h6>
                </IonButton>
              </a>
            </IonCard>
          </IonCard>
        </IonContent>
      )}
    </>
  );
};

export default CartPage;
