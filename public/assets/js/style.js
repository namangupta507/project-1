// // -- login Password show/hide -- //

// let actualLoginPassword = ""; // Stores the actual password for 'Login Password'
// let actualCreatePassword = ""; // Stores the actual password for 'Create Password'
// let actualReEnterPassword = ""; // Stores the actual password for 'ReEnter Password'
// let actualNewPassword = "";   // Stores the actual password for 'New Password'
// let actualConfirmPassword = ""; // Stores the actual password for 'Confirm Password'

// // Login Password Masking
// function maskPassword() {
//     const passwordField = document.getElementById("loginPassword");
//     const input = passwordField.value;
  
//     if (input.length > actualLoginPassword.length) {
//         actualLoginPassword += input[input.length - 1];
//     } else if (input.length < actualLoginPassword.length) {
//         actualLoginPassword = actualLoginPassword.slice(0, input.length);
//     }
  
//     passwordField.value = "*".repeat(actualLoginPassword.length);
// }
  
// function showpsw() {
//     const passwordField = document.getElementById("loginPassword");
//     const eyeIcon = document.getElementById("eyeLogin");
  
//     if (passwordField.value.includes("*")) {
//         passwordField.value = actualLoginPassword;
//         eyeIcon.classList.remove("fa-eye-slash");
//         eyeIcon.classList.add("fa-eye");
//     } else {
//         passwordField.value = "*".repeat(actualLoginPassword.length);
//         eyeIcon.classList.remove("fa-eye");
//         eyeIcon.classList.add("fa-eye-slash");
//     }
// }

// // Create signup Password Masking 
// function maskcreatePassword() {
//     const passwordField = document.getElementById("createPassword");
//     const input = passwordField.value;
  
//     if (input.length > actualCreatePassword.length) {
//         actualCreatePassword += input[input.length - 1];
//     } else if (input.length < actualCreatePassword.length) {
//         actualCreatePassword = actualCreatePassword.slice(0, input.length);
//     }
  
//     passwordField.value = "*".repeat(actualCreatePassword.length);
// }
  
// function showpcreatepsw() {
//     const passwordField = document.getElementById("createPassword");
//     const eyeIcon = document.getElementById("eyeCreate");
  
//     if (passwordField.value.includes("*")) {
//         passwordField.value = actualCreatePassword;
//         eyeIcon.classList.remove("fa-eye-slash");
//         eyeIcon.classList.add("fa-eye");
//     } else {
//         passwordField.value = "*".repeat(actualCreatePassword.length);
//         eyeIcon.classList.remove("fa-eye");
//         eyeIcon.classList.add("fa-eye-slash");
//     }
// }

// // Re-Enter signup Password Masking
// function maskreEnterPassword() {
//     const passwordField = document.getElementById("reEnterPassword");
//     const input = passwordField.value;
  
//     if (input.length > actualReEnterPassword.length) {
//         actualReEnterPassword += input[input.length - 1];
//     } else if (input.length < actualReEnterPassword.length) {
//         actualReEnterPassword = actualReEnterPassword.slice(0, input.length);
//     }
  
//     passwordField.value = "*".repeat(actualReEnterPassword.length);
// }
  
// function showreenterpsw() {
//     const passwordField = document.getElementById("reEnterPassword");
//     const eyeIcon = document.getElementById("eyeReenter");
  
//     if (passwordField.value.includes("*")) {
//         passwordField.value = actualReEnterPassword;
//         eyeIcon.classList.remove("fa-eye-slash");
//         eyeIcon.classList.add("fa-eye");
//     } else {
//         passwordField.value = "*".repeat(actualReEnterPassword.length);
//         eyeIcon.classList.remove("fa-eye");
//         eyeIcon.classList.add("fa-eye-slash");
//     }
// }

// // New Password Masking
// function maskNewPassword() {
//   const passwordField = document.getElementById("newPassword");
//   const input = passwordField.value;

//   if (input.length > actualNewPassword.length) {
//       actualNewPassword += input[input.length - 1];
//   } else if (input.length < actualNewPassword.length) {
//       actualNewPassword = actualNewPassword.slice(0, input.length);
//   }

//   passwordField.value = "*".repeat(actualNewPassword.length);
// }

// function showNewpsw() {
//   const passwordField = document.getElementById("newPassword");
//   const eyeIcon = document.getElementById("eyeNewPsw");

//   if (passwordField.value.includes("*")) {
//       passwordField.value = actualNewPassword;
//       eyeIcon.classList.remove("fa-eye-slash");
//       eyeIcon.classList.add("fa-eye");
//   } else {
//       passwordField.value = "*".repeat(actualNewPassword.length);
//       eyeIcon.classList.remove("fa-eye");
//       eyeIcon.classList.add("fa-eye-slash");
//   }
// }

// // Confirm Password Masking
// function maskConfirmPassword() {
//   const passwordField = document.getElementById("confirmPassword");
//   const input = passwordField.value;

//   if (input.length > actualConfirmPassword.length) {
//       actualConfirmPassword += input[input.length - 1];
//   } else if (input.length < actualConfirmPassword.length) {
//       actualConfirmPassword = actualConfirmPassword.slice(0, input.length);
//   }

//   passwordField.value = "*".repeat(actualConfirmPassword.length);
// }

// function showConfirmpsw() {
//   const passwordField = document.getElementById("confirmPassword");
//   const eyeIcon = document.getElementById("eyeConfirmPsw");

//   if (passwordField.value.includes("*")) {
//       passwordField.value = actualConfirmPassword;
//       eyeIcon.classList.remove("fa-eye-slash");
//       eyeIcon.classList.add("fa-eye");
//   } else {
//       passwordField.value = "*".repeat(actualConfirmPassword.length);
//       eyeIcon.classList.remove("fa-eye");
//       eyeIcon.classList.add("fa-eye-slash");
//   }
// }



// $(document).ready(function(){

//   // Menu toggle button

//   $("#navbartoggleBtn").click(function(){
//     $(this).toggleClass("active");
//     $(".navbar_menu-wrapper").toggleClass("show");
//   });

//   // profile nav     
//     $("#profilenavBtn").click(function(){      
//         $(".profile-list-dropdown").toggleClass("profile-drop");     
//     });

// });

// document.addEventListener("DOMContentLoaded", function () {
//   // Screen 1 → Screen 2
//   document.getElementById("ts_btn_1_next").addEventListener("click", function () {
//     document.querySelectorAll(".ts_screen_1").forEach(el => {
//       el.style.left = "-100%";
//       el.style.opacity= "0";
//       el.style.transition = "all 0.5s ease-in-out";
//     });
//     document.querySelectorAll(".ts_screen_2").forEach(el => {
//       el.style.left = "0";
//       el.style.opacity= "1";
//       el.style.transition = "all 0.5s ease-in-out";
//     });
//   });

//   // Screen 2 → Screen 1 (Back)
//   document.getElementById("ts_btn_2_back").addEventListener("click", function () {
//     document.querySelectorAll(".ts_screen_1").forEach(el => {
//       el.style.left = "0%";
//       el.style.opacity= "1";
//       el.style.transition = "all 0.5s ease-in-out";
//     });
//     document.querySelectorAll(".ts_screen_2").forEach(el => {
//       el.style.left = "100%";
//       el.style.opacity= "0";
//       el.style.transition = "all 0.5s ease-in-out";
//     });
//   });

//   // Screen 2 → Screen 3
//   document.getElementById("ts_btn_2_next").addEventListener("click", function () {
//     document.querySelectorAll(".ts_screen_2").forEach(el => {
//       el.style.left = "-100%";
//       el.style.opacity= "0";
//       el.style.transition = "all 0.5s ease-in-out";
//     });
//     document.querySelectorAll(".ts_screen_3").forEach(el => {
//       el.style.left = "0%";
//       el.style.opacity= "1";
//       el.style.transition = "all 0.5s ease-in-out";
//     });
//   });

//   // Screen 3 → Screen 2 (Back)
//   document.getElementById("ts_btn_3_back").addEventListener("click", function () {
//     document.querySelectorAll(".ts_screen_2").forEach(el => {
//       el.style.left = "0%";
//       el.style.opacity= "1";
//       el.style.transition = "all 0.5s ease-in-out";
//     });
//     document.querySelectorAll(".ts_screen_3").forEach(el => {
//       el.style.left = "100%";
//       el.style.opacity= "0";
//       el.style.transition = "all 0.5s ease-in-out";
//     });
//   });

//   // Final screen → Redirect to login.html
//   document.getElementById("ts_btn_3_next").addEventListener("click", function () {
//     window.location.href = "home.html";
//   });
// });



// document.addEventListener("DOMContentLoaded", function () {
//     const TF = $('#timeFrom');
//     const TT = $('#timeTo');
//     const toError = $("#toError");

//     TF.clockpicker({ placement: 'top',autoclose: true });
//     TT.clockpicker({ placement: 'top',autoclose: true });

//     TF.on("change", validateTime);
//     TT.on("change", validateTime);

//     function validateTime() {
//         const fromValue = TF.val();
//         const toValue = TT.val();

//         // Replace the following with your own update logic (Livewire, Alpine, etc.)
//         // e.g., Livewire.set('timeFrom', fromValue);
//         // e.g., Livewire.set('timeTo', toValue);

//         toError.addClass("d-none");

//         if (fromValue && toValue) {
//             if (toValue <= fromValue) {
//                 toError.removeClass("d-none");
//                 toError.text("To Time should be greater than From Time");
//             }
//         }
//     }

//     // If initializeSelectize is defined elsewhere, uncomment this:
//     // if (typeof initializeSelectize === "function") {
//     //     initializeSelectize();
//     // }
// });