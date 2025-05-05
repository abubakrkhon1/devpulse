export async function register(data: {
  bio: string;
  confirmPassword: string;
  department: string;
  email: string;
  jobTitle: string;
  name: string;
  password: string;
  role: string;
  twoFactorEnabled: boolean;
  verified: boolean;
}) {
  const {
    bio,
    department,
    email,
    jobTitle,
    name,
    password,
    confirmPassword,
    role,
    twoFactorEnabled,
    verified,
  } = data;
  const res = await fetch("http://localhost:3005/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      password,
      confirmPassword,
      jobTitle,
      department,
      role,
      bio,
      twoFactorEnabled,
      verified,
      avatar: "https://github.com/shadcn.png",
      friends: [],
    }),
    credentials: "include",
  });

  return res.json();
}

export async function login(data: { email: string; password: string }) {
  const res = await fetch("http://localhost:3005/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  return res.json();
}

export async function logout() {
  return fetch("http://localhost:5000/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

export async function getProfile() {
  const res = await fetch("http://localhost:5000/api/auth/me", {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}
