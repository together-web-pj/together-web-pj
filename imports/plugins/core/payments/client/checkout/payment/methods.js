import { Template } from "meteor/templating";
import { Reaction } from "/client/api";
import { Cart, Products } from "/lib/collections";
import "./methods.html";

Template.corePaymentMethods.helpers({
  enabledPayments,
  isAdmin() {
    return Reaction.hasAdminAccess();
  },
  ready() {
    return Template.instance().subProdcut.ready();
  }
});

Template.corePaymentMethods.onCreated(function () {
  const payments = enabledPayments();
  const paymentsEnabled = payments.length;
  // If no payments enabled, show payments settings dashboard
  if (!paymentsEnabled) {
    openActionView();
  }
  const self = this;
  this.subProdcut = Meteor.subscribe("Products", function(){
      const cart = Cart.findOne({userId: Meteor.userId()});
      if(cart && cart.items[0]){
      const product = Products.findOne({_id:cart.items[0].productId});
      if(product)
        self.productUserId = product.userId;
      }
   });

});

Template.corePaymentMethods.events({
  "click [data-event-action=configure-payment-methods]"(event) {
    event.preventDefault();
    openActionView();
  }
});

function enabledPayments() {
  const enabledPaymentsArr = [];
  const userId = Template.instance().productUserId;
  if(!userId)
    return enabledPaymentsArr;

  const apps = Reaction.Apps({
    provides: "paymentMethod",
    userId: userId,
    enabled: true
  });
  for (const app of apps) {
    if (app.enabled === true) enabledPaymentsArr.push(app);
  }
  return enabledPaymentsArr;
}

function openActionView() {
  const dashboardRegistryEntry = Reaction.Apps({ name: "reaction-dashboard", provides: "shortcut" });
  const paymentRegistryEntry = Reaction.Apps({ name: "reaction-payments", provides: "settings" });

  Reaction.showActionView([
    dashboardRegistryEntry[0],
    paymentRegistryEntry[0]
  ]);
}
