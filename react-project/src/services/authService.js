const API_URL = "http://127.0.0.1:5000";

export async function register(username, password) {
    try {
      const response = await fetch(`${API_URL}/registro`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
      });

      return await response.json();
  } catch (error) {
      return { msg: "Erro ao conectar ao servidor" };
  }
};

export async function login(username, password) {
  const response = await fetch(`${API_URL}/acesso`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (response.ok) {
    localStorage.setItem("token", data.token);
  }
  return data;
}

export function logout() {
  localStorage.removeItem("token");
}

export function isAuthenticated() {
  return localStorage.getItem("token") !== null;
}
