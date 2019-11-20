import { processPayment } from "../Core/ApiCore";
import { isAuthenticated } from "./UsersApi";
export const razorPayOptionsSecond = (amount, user, handle) => {
  const { name, email, mobile } = user;
  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  return {
    key: "rzp_test_xHFa7oLm0s4xHO",
    amount: amount ? amount * 100 : 50000, // 50000 refers to 50000 paise or INR 500.
    currency: "INR",
    name: "E-comm",
    description: "An e-commerce for developers",
    image:
      "https://img.etimg.com/thumb/height-450,width-800,msid-63110702,imgsize-12508/razorpay.jpg",
    // order_id: 'order_9A33XWu170gUtm',
    handler: function(response) {
      let transactionId = response.razorpay_payment_id;
      processPayment(
        user._id,
        user.token,

        {
          razorpay_payment_id: response.razorpay_payment_id,
          amount: amount
        }
      ).then(handle());
    },
    prefill: {
      name: name || "name",
      email: email || "example@example.com",
      contact: mobile || ""
    },
    notes: {
      address: "Address"
    },
    theme: {
      color: "#F37254"
    }
  };
};
