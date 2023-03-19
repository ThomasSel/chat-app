import { useState } from "react";

const Login = (props) => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/api/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            data-cy="login-email"
            value={formData.email}
            onChange={handleChange("email")}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            data-cy="login-password"
            value={formData.password}
            onChange={handleChange("password")}
          />
        </div>

        <input type="submit" value="Submit" data-cy="login-submit" />
      </form>
    </main>
  );
};

export default Login;