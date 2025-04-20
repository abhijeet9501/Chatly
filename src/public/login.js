const SERVER_URL = "";

const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");

const BASE_URL = `${SERVER_URL}/api/v1/auth`;

async function registerUser(e) {
  e.preventDefault();

  const name = document.getElementById("registerName").value;
  const username = document.getElementById("registerUsername").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.querySelector("#registerForm input[placeholder='Confirm Password']").value;

  if (!username || !password || !email || !name || !confirmPassword) {
    return alert("Fill all fields");
  }

  if (password !== confirmPassword) {
    return alert("Passwords do not match");
  }

  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password, email, name }),
      credentials: "include",
    });

    const data = await res.json();
    if (res.ok) {
      alert("Registered successfully. Please login.");
      toggleForm(); 
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (err) {
    console.error(err);
    alert("Error registering user");
  }
}

async function loginUser(e) {
  e.preventDefault();

  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  if (!username || !password) {
    return alert("Fill all fields");
  }

  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });

    const data = await res.json();
    if (res.ok) {
      alert("Login successful!");
      window.location.href = "index.html"; 
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    console.error(err);
    alert("Error logging in");
  }
}

document.getElementById("loginForm").addEventListener("submit", loginUser);
document.getElementById("registerForm").addEventListener("submit", registerUser);
