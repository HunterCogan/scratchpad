import { LoginPage } from "../login-page/login";
import Signup from "../login-page/signup";

export default function Page() {
  return (
    <div>
      <h1>Welcome to the Login Page</h1>
      <LoginPage />
      <Signup />
    </div>
  );
}
