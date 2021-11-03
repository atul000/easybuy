const User = require("../models/user");
const Cart = require("../models/cart");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

// methods


exports.createPaymentIntent = async (req, res) => {
  const { couponApplied } = req.body;

  const user = await User.findOne({ email: req.user.email }).exec();

  const { cartTotal, totalAfterDiscount } = await Cart.findOne({
    orderdBy: user._id,
  }).exec();

  let finalAmount = 0;

  if (couponApplied && totalAfterDiscount) {
    finalAmount = totalAfterDiscount * 100;
  } else {
    finalAmount = cartTotal * 100;
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: finalAmount,
    currency: "inr",
  });
  let Client_Secret = paymentIntent.client_secret;
  console.log(Client_Secret);
  console.log("-----payment SECRET---->", paymentIntent);
  res.send({
    clientSecret: Client_Secret,
    cartTotal,
    totalAfterDiscount,
    payable: finalAmount,
  });
};
