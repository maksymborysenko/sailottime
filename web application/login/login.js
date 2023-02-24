var loginText = document.querySelector(".title-text .login");
var loginForm = document.querySelector("form.login");
var loginBtn = document.querySelector("label.login");
var signupBtn = document.querySelector("label.signup");
var signupLink = document.querySelector("form .signup-link a");
signupBtn.onclick = function () {
  loginForm.style.marginLeft = "-50%";
  loginText.style.marginLeft = "-50%";
};
loginBtn.onclick = function () {
  loginForm.style.marginLeft = "0%";
  loginText.style.marginLeft = "0%";
};
signupLink.onclick = function () {
  signupBtn.click();
  return false;
};

// login form
const login_Form = document.querySelector("#login-form");

login_Form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("login_email").value;
  const password = document.getElementById("login_password").value;

  const response = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (response.ok) {
    window.location.href = "/mainpage";
  } else {
    const error = await response.json();
    alert(error.message);
  }
});
// signup form
const signup_Form = document.querySelector("#signup-form");

signup_Form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("signup_name").value;
  const signup_email = document.getElementById("signup_email").value;
  const signup_password = document.getElementById("signup_password").value;

  const signup_response = await fetch("/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, signup_email, signup_password }),
  });
  if (signup_response.ok) {
    window.location.href = "/mainpage";
  } else {
    const signup_error = await signup_response.json();
    alert(signup_error.message);
  }
});
