const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    if (!name || !email || !password || !role) {
      message.textContent = "⚠ Please fill in all fields.";
      message.style.color = "red";
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        message.textContent = "✅ Registration successful! Redirecting to login...";
        message.style.color = "green";

        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      } else {
        message.textContent = data.message || "Registration failed.";
        message.style.color = "red";
      }
    } catch (error) {
      console.error("Registration error:", error);
      message.textContent = "Server error. Please try again later.";
      message.style.color = "red";
    }
  });
}
