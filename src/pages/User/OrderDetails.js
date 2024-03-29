import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

import { Link, Redirect } from "react-router-dom";
import moment from "moment";
import {
  isAuthenticated,
  getSingleOrder,
  updateOrderCancelled,
  updateSecondPayment
} from "./UsersApi";
import { FaRegCheckCircle, FaClock } from "react-icons/fa";
import { Modal, Icon, Button } from "antd";
import { razorPayOptionsSecond } from "./SecondPayment";
import "./User.css";
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonList,
  IonBadge,
  IonButton,
  IonAlert,
  IonCardContent
} from "@ionic/react";
let { user } = isAuthenticated();

const { confirm } = Modal;
const Razorpay = window.Razorpay;

const OrderDetails = props => {
  const [showAlert1, setShowAlert1] = useState(false);
  const [time, setTime] = useState(false);

  const [order, setOrder] = useState({});
  const [error, setError] = useState(false);
  const { user, token } = isAuthenticated();
  const [values, setValues] = useState({
    redirectToReferrer: false
  });

  const { redirectToReferrer } = values;
  const cancel = true;
  const secondpayment = true;
  const userId = isAuthenticated() && isAuthenticated().user._id;
  const tomorrow = moment(order.createdAt).add(4, "hours");
  const Today = moment();

  const loadSingleOrder = orderId => {
    let { user, token } = isAuthenticated();
    getSingleOrder(orderId, user._id, token).then(data => {
      if (data.error) {
        setError(data.error);
      } else {
        setOrder(data);
      }
    });
  };

  const handleOrderCancelled = orderId => {
    let { user, token } = isAuthenticated();
    updateOrderCancelled(user._id, token, order._id, cancel).then(data => {
      if (data.error) {
        console.log("Status update failed");
      } else {
        console.log("order has been Cancelled");
        setValues({
          redirectToReferrer: false
        });
        loadSingleOrder(order._id, user._id, token);
      }
    });
  };

  const handleSecondPayment = orderId => {
    let { user, token } = isAuthenticated();
    updateSecondPayment(user._id, token, order._id, secondpayment).then(
      data => {
        if (data.error) {
          console.log("Status update failed");
        } else {
          console.log("second payment has been successfull");
          setValues({
            redirectToReferrer: false
          });
          loadSingleOrder(order._id, user._id, token);
        }
      }
    );
  };

  const contentcancel = () => {
    return (
      <div>
        <p>
          If your Request accepted refund Will initiated within 24hrs. So please
          be patience till 24hrs. After that u will come to support
        </p>
      </div>
    );
  };

  function showConfirm() {
    confirm({
      title: "Do you Want to Cancel this Project?",
      content: contentcancel(),
      onOk() {
        handleOrderCancelled();
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  }

  useEffect(() => {
    const orderId = props.match.params.orderId;
    loadSingleOrder(orderId, user._id, token);
  }, [props]);

  const showButton = () => {
    if (Today < tomorrow) {
      return (
        <>
          <Button type="danger" onClick={showConfirm} shape="round" icon="stop">
            Cancel Project
          </Button>
          <br />
          <small>
            <sup>Cancel the Project within 4hrs</sup>
          </small>
        </>
      );
    } else {
      return (
        <>
          <div>
            <Button
              disabled
              type="danger"
              onClick={showConfirm}
              shape="round"
              icon="stop"
            >
              Cancel Project
            </Button>
            <br />
            <small>
              <sup>Cancellation time is over </sup>
            </small>
          </div>
        </>
      );
    }
  };

  const redirectUser = () => {
    if (redirectToReferrer) {
      return <Redirect to="/profile" />;
    }
  };

  const SecondAmount = order.secondpaymentamount;

  const rzp1 = new Razorpay(
    razorPayOptionsSecond(
      SecondAmount,
      user && user.name && user.email
        ? { ...user, token }
        : { name: "", email: "" },
      handleSecondPayment
    )
  );
  const openRzrPay = event => {
    rzp1.open();
    event.preventDefault();
  };

  return (
    <IonContent>
      <IonCard style={{ maxHeight: "100vh" }}>
        <IonCardHeader
          color="tertiary"
          style={{ color: "white", fontWeight: "600", textAlign: "center" }}
        >
          Live Order Track
        </IonCardHeader>
        <IonGrid>
          <IonRow>
            <IonCol>
              {/* placed_order */}

              {order.placed_order === true ? (
                <>
                  <IonCard>
                    <IonCardHeader
                      style={{ margin: "0", padding: "5px" }}
                      color="light"
                    >
                      <FaRegCheckCircle
                        style={{
                          marginRight: "1rem",
                          color: "#10dc60",
                          fontSize: "20px",
                          fontWeight: "700"
                        }}
                      />
                      <IonBadge color="success">
                        Order Confirmed We Just Received Rs.{order.amount}
                      </IonBadge>
                    </IonCardHeader>
                  </IonCard>
                  <div className="vl"></div>
                </>
              ) : (
                <>
                  <IonCard>
                    <IonCardHeader
                      style={{ margin: "0", padding: "5px" }}
                      color="light"
                    >
                      <IonBadge color="warning">Not Yet Confirmed</IonBadge>
                    </IonCardHeader>
                  </IonCard>
                  <div className="vlred"></div>
                </>
              )}

              {/* processing */}

              {order.processing === true ? (
                <>
                  <IonCard>
                    <IonCardHeader
                      style={{ margin: "0", padding: "5px" }}
                      color="light"
                    >
                      <FaRegCheckCircle
                        style={{
                          marginRight: "1rem",
                          color: "#10dc60",
                          fontSize: "20px",
                          fontWeight: "700"
                        }}
                      />
                      <IonBadge color="success">Order is Processing</IonBadge>
                    </IonCardHeader>
                  </IonCard>
                  <div className="vl"></div>
                </>
              ) : (
                <>
                  <IonCard>
                    <IonCardHeader
                      style={{ margin: "0", padding: "5px" }}
                      color="light"
                    >
                      <FaClock
                        style={{
                          marginRight: "1rem",
                          color: "#ffce00",
                          fontSize: "20px",
                          fontWeight: "700"
                        }}
                      />
                      <IonBadge color="warning">Not Yet Process</IonBadge>
                    </IonCardHeader>
                  </IonCard>
                  <div className="vlred"></div>
                </>
              )}

              {/* underconstruction */}

              {order.underconstruction === true ? (
                <>
                  <IonCard>
                    <IonCardHeader
                      style={{ margin: "0", padding: "5px" }}
                      color="light"
                    >
                      <FaRegCheckCircle
                        style={{
                          marginRight: "1rem",
                          color: "#10dc60",
                          fontSize: "20px",
                          fontWeight: "700"
                        }}
                      />
                      <IonBadge color="success">
                        {" "}
                        Order Goes Under Construction
                      </IonBadge>
                    </IonCardHeader>
                  </IonCard>
                  <div className="vl"></div>
                </>
              ) : (
                <>
                  <IonCard>
                    <IonCardHeader
                      style={{ margin: "0", padding: "5px" }}
                      color="light"
                    >
                      <FaClock
                        style={{
                          marginRight: "1rem",
                          color: "#ffce00",
                          fontSize: "20px",
                          fontWeight: "700"
                        }}
                      />
                      <IonBadge color="warning">
                        Not Yet Goes Under Construction
                      </IonBadge>
                    </IonCardHeader>
                  </IonCard>
                  <div className="vlred"></div>
                </>
              )}

              {/* ready */}

              {order.ready === true ? (
                <>
                  <IonCard>
                    <IonCardHeader
                      style={{ margin: "0", padding: "5px" }}
                      color="light"
                    >
                      <FaRegCheckCircle
                        style={{
                          marginRight: "1rem",
                          color: "#10dc60",
                          fontSize: "20px",
                          fontWeight: "700"
                        }}
                      />
                      <IonBadge color="success"> Order is Ready</IonBadge>
                    </IonCardHeader>
                  </IonCard>
                  <div className="vl"></div>
                </>
              ) : (
                <>
                  <IonCard>
                    <IonCardHeader
                      style={{ margin: "0", padding: "5px" }}
                      color="light"
                    >
                      <FaClock
                        style={{
                          marginRight: "1rem",
                          color: "#ffce00",
                          fontSize: "20px",
                          fontWeight: "700"
                        }}
                      />
                      <IonBadge color="warning">Not Yet Ready</IonBadge>
                    </IonCardHeader>
                  </IonCard>
                  <div className="vlred"></div>
                </>
              )}

              {/* finished */}

              {order.finished === true ? (
                <>
                  <IonCard>
                    <IonCardHeader
                      style={{ margin: "0", padding: "5px" }}
                      color="light"
                    >
                      <FaRegCheckCircle
                        style={{
                          marginRight: "1rem",
                          color: "#10dc60",
                          fontSize: "20px",
                          fontWeight: "700"
                        }}
                      />
                      <IonBadge color="success">
                        Order has been Finished
                      </IonBadge>
                    </IonCardHeader>
                  </IonCard>
                </>
              ) : (
                <>
                  <IonCard>
                    <IonCardHeader
                      style={{ margin: "0", padding: "5px" }}
                      color="light"
                    >
                      <FaClock
                        style={{
                          marginRight: "1rem",
                          color: "#ffce00",
                          fontSize: "20px",
                          fontWeight: "700"
                        }}
                      />
                      <IonBadge color="warning"> Not Yet Finished</IonBadge>
                    </IonCardHeader>
                  </IonCard>
                </>
              )}
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol style={{ margin: "0", padding: "0" }}>
              <div style={{ float: "right" }}>
                {order.cancelled === false ? (
                  <>{showButton()}</>
                ) : (
                  <h6>
                    If Request accepted refund Will initiated within 24hrs.So
                    please be patience till 24hrs after that u will come to
                    support
                  </h6>
                )}
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCard>

      <IonCard>
        <IonCardHeader
          color="warning"
          style={{ color: "white", fontWeight: "600", textAlign: "center" }}
        >
          Project Files
        </IonCardHeader>

        <IonCol style={{ margin: "0", padding: "0", textAlign: "center" }}>
          <div>
            {order.cancelled === false ? (
              <>
                {order.ready === true ? (
                  <>
                    {order.secondpayment === false ? (
                      <IonCard>
                        <div className="block-blur">
                          <b>Project File</b>
                          <IonButton size="small">
                            <a href="/">Download File</a>
                          </IonButton>
                        </div>
                        <IonButton
                          size="small"
                          onClick={openRzrPay}
                          id="rzp-button1"
                        >
                          To Unlock Pay rest Balance
                        </IonButton>

                        <IonCardContent>
                          <p>
                            Need to pay rest of 75% Amount Rs.
                            {order.secondpaymentamount} to Unlock the Project
                            File
                          </p>
                        </IonCardContent>
                      </IonCard>
                    ) : (
                      <>
                        <b>Project File</b>
                        <IonButton size="small">
                          <a href={order.fileLink} target="_blank">
                            Download File
                          </a>
                        </IonButton>
                      </>
                    )}
                  </>
                ) : (
                  ""
                )}
              </>
            ) : (
              <h6>Not Yet File Uploaded</h6>
            )}
          </div>
        </IonCol>
      </IonCard>
    </IonContent>
  );
};

export default OrderDetails;
