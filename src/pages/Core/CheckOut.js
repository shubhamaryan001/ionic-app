import React, { useState, useEffect } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import { getCart } from "./CartHelper";
import { isAuthenticated } from "../User/UsersApi";
import "./Home.css";
import {
  IonCard,
  IonContent,
  IonTitle,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonItem,
  IonBadge,
  IonText,
  IonCardHeader,
  IonTextarea
} from "@ionic/react";
import {
  FaAmazonPay,
  FaCreditCard,
  FaInfoCircle,
  FaHandsHelping
} from "react-icons/fa";
import ReactTooltip from "react-tooltip";
import { IoIosPricetags } from "react-icons/io";

import { FiChevronsRight } from "react-icons/fi";
import { razorPayOptionsDirt } from "./DirectPayment";
import {
  getUserBalance,
  deductUserWallet,
  getCoupon,
  createOrder
} from "./ApiCore";

import { emptyCart } from "./CartHelper";

let { user } = isAuthenticated();
const productTax = 50;
const Razorpay = window.Razorpay;

const CheckOut = ({ products }) => {
  const [values, setValues] = useState({
    code: "",
    discount: 0,
    invalidCode: false,
    applied: false,
    redirectToReferrer: false
  });

  const [data, setData] = useState({
    note: ""
  });
  let {
    user: { _id, name, email, role, wallet_balance },
    token
  } = isAuthenticated();

  const [balc, setBalc] = useState({
    currentWalletBalance: wallet_balance
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;

  const { currentWalletBalance } = balc;

  const { code, discount, applied, invalidCode, redirectToReferrer } = values;

  const getBalance = async event => {
    const currentBalance = await getUserBalance({ userId: _id });
    setBalc({
      ...balc,
      ["currentWalletBalance"]: currentBalance.user.wallet_balance
    });
  };

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const applyCode = () => {
    getCoupon({ code }).then(data => {
      if (data.success && data.coupon.isActive) {
        setValues({
          ...values,
          ["discount"]: data.coupon.discount,
          ["applied"]: true,
          ["invalidCode"]: false
        });
      } else {
        setValues({ ...values, ["invalidCode"]: true, ["applied"]: false });
      }
    });
  };

  const getTotal = () => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  let amount = applied
    ? getTotal() + productTax - discount
    : getTotal() + productTax;

  let FirstAmount = (25 / 100) * amount;
  let SecondAmount = (75 / 100) * amount;

  const walletDeduct = async event => {
    event.preventDefault();
    // total amount to be paid for order
    let amount = applied ? getTotal() - discount : getTotal() + productTax;
    // deducting balance from user wallet
    const deductUserBalance = await deductUserWallet({
      token,
      userId: user._id,
      wallet: { amount: FirstAmount }
    });
    // if dedcuted get the current balance
    if (deductUserBalance.success) {
      const currentBalance = await getUserBalance({ userId: user._id });
      if (currentBalance.success) {
        user.wallet_balance = currentBalance.user.wallet_balance;
      }

      if (deductUserBalance.success) {
        const createOrderData = {
          products: products,
          name: "floorplanbazaar",
          transaction_id: "Undifine",
          amount: amount,
          payment_mode: "Wallet Payment",
          note: anyNote,
          firstpayment: true,
          firstpaymentamount: FirstAmount,
          secondpaymentamount: SecondAmount
        };

        await createOrder(userId, token, createOrderData)
          .then(response => {
            emptyCart(() => {
              setValues({
                redirectToReferrer: true
              });
            });
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  };

  const redirectUser = () => {
    if (redirectToReferrer) {
      return <Redirect to="/successfull/order" />;
    }
  };

  useEffect(() => {
    getBalance();
  }, []);

  const handleNote = event => {
    setData({ ...data, note: event.target.value });
  };

  const walletCheckout = () => {
    return isAuthenticated() ? (
      <>
        <IonButton onClick={walletDeduct} size="small" color="tertiary">
          Pay using Wallet Money
        </IonButton>
      </>
    ) : (
      <Link to="/signin">
        <IonButton className="btn btn-raised btn-warning">
          Sign in to checkout
        </IonButton>
      </Link>
    );
  };

  const showCheckout = () => {
    return isAuthenticated() ? (
      <IonGrid>
        <IonRow>
          <IonCol>
            {currentWalletBalance >
            (applied
              ? getTotal() + productTax - discount
              : getTotal() + productTax)
              ? walletCheckout()
              : ""}
            <IonRow>
              <IonCol>
                <p>
                  Wallet balance
                  <span style={{ marginLeft: "5px" }}>
                    <b>
                      {currentWalletBalance ? `₹${currentWalletBalance}` : "₹0"}
                    </b>
                  </span>
                </p>
              </IonCol>
            </IonRow>
          </IonCol>

          <IonCol>
            <IonButton
              size="small"
              color="tertiary"
              onClick={openRzrPay}
              id="rzp-button1"
            >
              Pay Now
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    ) : (
      // <button className="btn btn-raised btn-success">Pay Now</button>
      <Link to="/signin">
        <IonButton>Sign in to checkout</IonButton>
      </Link>
    );
  };

  const showCoupon = () => {
    return (
      <>
        <IonInput
          type="text"
          placeholder="Coupon Code"
          onInput={handleChange("code")}
          value={code}
          autoFocus
          required
        ></IonInput>
        <IonButton onClick={applyCode}>Apply Code</IonButton>
      </>
    );
  };

  let anyNote = data.note;
  // Razorpay
  const rzp1 = new Razorpay(
    razorPayOptionsDirt(
      FirstAmount,
      user && user.name && user.email
        ? { ...user, token }
        : { name: "", email: "" },
      products,
      anyNote,
      SecondAmount
    )
  );
  const openRzrPay = event => {
    rzp1.open();
    event.preventDefault();
  };

  return (
    <>
      <IonCard style={{ textAlign: "center" }}>
        <ReactTooltip />
        <IonCardHeader style={{ margin: "0", padding: "0" }} color="tertiary">
          <h4 style={{ color: "white", margin: "0", padding: "3px" }}>
            Price Details <IoIosPricetags style={{ marginBottom: "-3px" }} />
          </h4>
        </IonCardHeader>

        <IonGrid>
          <IonRow>
            <IonCol>
              {applied ? (
                <>
                  <h5>
                    Complete Project Price <strike>₹{amount + discount}</strike>
                    <span style={{ marginLeft: "4px", color: "#10dc60" }}>
                      ₹{amount}
                    </span>
                  </h5>
                </>
              ) : (
                <>
                  <h4>Complete Project Price ₹{amount}</h4>
                </>
              )}
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>
                <FiChevronsRight className="FiChevronsRight" />
              </IonText>

              <IonText color="success">
                <b>First 25% Payment</b>
              </IonText>
            </IonCol>
            <IonCol>
              <IonText color="success">
                <b>₹{FirstAmount}</b>
                <FaInfoCircle
                  style={{ margin: "-5px 0 0 5px" }}
                  data-tip="Need to pay right now."
                />
              </IonText>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonText>
                <FaHandsHelping className="FaHandsHelping" />
              </IonText>
              <IonText>
                <b>Second 75% Payment</b>
              </IonText>
            </IonCol>
            <IonCol>
              <b>₹{SecondAmount}</b>
              <FaInfoCircle
                style={{ margin: "-5px 0 0 5px" }}
                data-tip="Need to pay after project is ready."
              />
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonText>GST:</IonText>
            </IonCol>
            <IonCol>
              <IonText>₹{productTax}</IonText>
            </IonCol>
          </IonRow>

          {applied ? (
            <>
              <IonRow>
                <IonCol>
                  <IonText>Discount Amount:</IonText>
                </IonCol>
                <IonCol>
                  <IonText>
                    <IonBadge>₹{discount}</IonBadge>{" "}
                  </IonText>
                </IonCol>
              </IonRow>
            </>
          ) : (
            ""
          )}
        </IonGrid>
      </IonCard>
      <IonGrid>
        <IonRow>
          <IonCol style={{ textAlign: "center" }}>
            <IonCard style={{ margin: "0", borderRadius: "0" }}>
              {invalidCode
                ? "Invalid Coupon!"
                : applied
                ? `code applied successfully`
                : ""}

              <IonItem>{showCoupon()}</IonItem>
            </IonCard>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonItem>
              <IonTextarea
                onInput={handleNote}
                value={data.note}
                placeholder="Type any Note ......"
              ></IonTextarea>
            </IonItem>
          </IonCol>
        </IonRow>
      </IonGrid>
      {showCheckout()}
      {redirectUser()}
    </>
  );
};

export default withRouter(CheckOut);
