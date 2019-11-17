import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
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
  IonBadge
} from "@ionic/react";
import { FaAmazonPay, FaCreditCard } from "react-icons/fa";

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
      return <Redirect to="/order/successfull" />;
    }
  };

  const redirectSuccess = () => {
    return <Redirect to="/order/successfull" />;
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
        <FiChevronsRight />
        <IonButton onClick={walletDeduct} size="small" color="success">
          Pay using Wallet Money
        </IonButton>
        <br />
        <span className="text-center">
          <p>
            Wallet balance
            <span style={{ marginLeft: "5px" }}>
              <b>{currentWalletBalance ? `₹${currentWalletBalance}` : "₹0"}</b>
            </span>
          </p>
        </span>
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
      <>
        <IonGrid>
          <IonRow>
            <IonCol>
              <FiChevronsRight />
              <IonButton
                size="small"
                color="success"
                onClick={openRzrPay}
                id="rzp-button1"
              >
                Pay Now Using Razorpay
              </IonButton>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              {currentWalletBalance >
              (applied
                ? getTotal() + productTax - discount
                : getTotal() + productTax)
                ? walletCheckout()
                : ""}
            </IonCol>
          </IonRow>
        </IonGrid>
      </>
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
      <IonCard style={{ padding: "5px 0 0 0" }}>
        <IonTitle color="dark" style={{ textAlign: "center" }}>
          Total First Payable Amount: ₹{FirstAmount}
        </IonTitle>
        <h6 color="dark" style={{ textAlign: "center" }}>
          Total Second Payable Amount: ₹{SecondAmount}
        </h6>
        <IonGrid>
          <h6 style={{ textAlign: "center" }}>
            <b>Price Summary</b>
          </h6>
          <IonRow>
            <IonCol>
              {applied ? (
                <>
                  <span style={{ color: "#10DC60" }}>
                    Discounted Product Price
                  </span>
                </>
              ) : (
                <>
                  <span>Total Product Price</span>
                </>
              )}
            </IonCol>
            <IonCol>
              {applied ? (
                <>
                  <strike>₹{getTotal()}</strike>₹{getTotal() - discount}
                </>
              ) : (
                <> ₹{getTotal()}</>
              )}
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>GST:</IonCol>
            <IonCol>₹{productTax}</IonCol>
          </IonRow>
          {applied ? (
            <IonRow>
              <IonCol>Discount:</IonCol>
              <IonCol>
                <IonBadge color="success">₹{discount}</IonBadge>
              </IonCol>
            </IonRow>
          ) : (
            ""
          )}

          <IonRow>
            <IonCol>Total Amount: </IonCol>
            <IonCol>
              <IonBadge color="tertiary">₹{amount}</IonBadge>
            </IonCol>
          </IonRow>
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
          <IonCol>{showCheckout()}</IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
};

export default CheckOut;
