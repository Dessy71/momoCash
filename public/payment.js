// payment.js

document.addEventListener("DOMContentLoaded", function () {
    // ... (existing code)
    var paymentForm = document.getElementById("paymentForm");
    var nameInput = document.getElementById("name");
    var phoneInput = document.getElementById("phone");
    var submitButton = document.getElementById("submitButton");
    var countdownTimer = document.getElementById("timer");

    
    // Function to check if both input fields are non-empty
    function checkInputs() {
        var nameValue = nameInput.value.trim();
        var phoneValue = phoneInput.value.trim();

        // Enable the submit button only if both input fields have values
        if (nameValue !== "" && phoneValue.match(/^0[0-9]{9}$/)) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    }

    // Function to update the countdown timer


    // Add input event listeners to the name and phone input fields
    nameInput.addEventListener("input", checkInputs);
    phoneInput.addEventListener("input", checkInputs);

    // Add a submit event listener to the form
    paymentForm.addEventListener("submit", function (event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Get the input values
        var nameValue = nameInput.value.trim();
        var phoneValue = phoneInput.value.trim();

        // Check if both inputs are empty or phone is not in the correct format
        if (nameValue === "" || !phoneValue.match(/^0[0-9]{9}$/)) {
            alert("Please fill in all fields correctly.");
        } else {
            // If both inputs are valid, proceed with the payment
            initiatePayment(nameValue);
        }
    });
});

// Replace with your Paystack public key
const paystackPublicKey = 'pk_live_25696ca3cb90de5a5a7d000f5979a104972180ed';


    // Function to initiate the payment
    function initiatePayment(nameValue) {
        // Get the user's phone number
        const phoneInput = document.getElementById("phone");
        const phoneValue = phoneInput.value.trim();

        // Check if the phone number is valid (you can add more validation if needed)
        if (!phoneValue.match(/^0[0-9]{9}$/)) {
            alert("Please enter a valid phone number.");
            return;
        }

        // Initialize Paystack with your public key
        var handler = PaystackPop.setup({
            key: paystackPublicKey, // Replace with your Paystack public key
            email: "desmondantwi07@gmail.com", // Your email address for receiving payment receipts
            amount: 1, // Amount in kobo (30 cedis = 3000 kobo)
            currency: "GHS", // Currency code for Ghana Cedis
            ref: "payment_" + Date.now(), // Generate a unique reference for this payment
            metadata: {
                custom_fields: [
                    {
                        display_name: "Phone Number",
                        variable_name: "phone_number",
                        value: phoneValue,
                    },
                ],
            },
            callback: function (response) {
                // Handle the successful payment response
                if (response.status === "success") {
                    // Redirect to the success page
                    window.location.href = '/success.html';
                } else {
                    // Handle payment failure here
                    alert("Payment failed. Please try again.");
                }
            },
        });

        // Open the payment dialog
        handler.openIframe();
    }
