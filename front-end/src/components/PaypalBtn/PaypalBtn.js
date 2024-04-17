import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { firestore,auth } from "../../Firebase";
import { collection, getDocs ,query, where, updateDoc , doc } from "firebase/firestore";


const PayPalIntegration = () => {
const handleApprove= async()=>
{
  const userCollection = collection(firestore,"User");
  const q = query(userCollection, where("email", "==", auth.currentUser.email));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.docs.length > 0) {
    const docId = querySnapshot.docs[0].id;
    await updateDoc(doc(userCollection, docId), { paymentStatus:true}); 
  }
}
    
  return (
    <div>
      
      <PayPalScriptProvider options={{ "client-id": "AWWca7KzIHse_Eb6fPvO7sVLMk0zjng8hwjbY6GekHTLvDnZmavQYUsjmet_2jR5pDS_l5v7RBqBEAzc" }}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: "1.00",
                },
                currency: "USD",
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          // Handle payment approval
          handleApprove()
        }}
      />
    </PayPalScriptProvider>
    </div>
  );
};

export default PayPalIntegration;
