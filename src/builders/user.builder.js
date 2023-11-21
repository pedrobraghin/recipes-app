export function userBuilder({ name, email, phone }) {
  const publicUser = {
    name,
    email,
    phone,
  };

  return publicUser;
}
