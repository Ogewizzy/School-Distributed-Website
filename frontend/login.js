const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    if (!email || !password || !role) {
      message.textContent = "⚠ Please fill in all fields.";
      message.style.color = "red";
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        message.textContent = "✅ Login successful! Redirecting...";
        message.style.color = "green";

        // Store user data in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("role", data.user.role);

        // Redirect by role
        setTimeout(() => {
          if (data.user.role === "teacher") {
            window.location.href = "teacher.html";
          } else {
            window.location.href = "student.html";
          }
        }, 1500);
      } else {
        message.textContent = data.message || "Login failed.";
        message.style.color = "red";
      }
    } catch (error) {
      console.error("Login error:", error);
      message.textContent = "Server error. Please try again later.";
      message.style.color = "red";
    }
  });
}
