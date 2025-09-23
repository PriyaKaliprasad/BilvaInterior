import { usePost } from '../../hooks'

export async function login(userData) {

  try {
    const { mutate: login, data, loading, error } = usePost("/auth/login");

    const res = await login(userData); // ✅ POST body sent here

    console.log("Login success:", res);

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }
    return data;
    
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
}
// export async function login(userData) {
//   try {
//     const response = await fetch("http://localhost:5141/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(userData),
//       credentials: 'include', // Send cookies for JWT
//     });
//     const data = await response.json();
//     if (!response.ok) {
//       throw new Error(data.message || "Login failed");
//     }
//     return data;
//   } catch (err) {
//     console.error("Login error:", err);
//     throw err;
//   }
// }
// Example protected API call using cookie-based JWT
export async function fetchProtected(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Always send cookies
    });
    if (!response.ok) {
      throw new Error('Failed to fetch protected resource');
    }
    return await response.json();
  } catch (err) {
    console.error('Protected API error:', err);
    throw err;
  }
}
export async function signup(userData) {
  try {
    const response = await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to sign up");
    }
    return await response.json();
  } catch (err) {
    console.error("Signup error:", err);
    throw err;
  }
}
