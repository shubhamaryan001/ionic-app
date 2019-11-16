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
  IonContent
} from "@ionic/react";

const CartPage = () => {
  const [items, setItems] = useState([]);
  const [run, setRun] = useState(false);

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
          <IonCard key={i}>
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
                    {" "}
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
                    {" "}
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
    <IonContent>
      <div className="row">
        {items.length > 0 ? (
          <>
            <div className="col-6"> {showItems(items)}</div>
            <div className="col-6">
              <div
                className=" card cart-summary pb-3 pt-3 pl-3 pr-3  container-fluid"
                style={{ width: "20rem" }}
              >
                <h2 className="mb-4">Your cart summary</h2>
                <hr />
              </div>
            </div>
          </>
        ) : (
          noItemsMessage()
        )}
      </div>
    </IonContent>
  );
};

export default CartPage;
