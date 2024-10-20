import Input from "./Input";
import Button from "../common/Button";

export function Login() {
  return (
    <form className="form">
      <h1 title="signup" className="text-2xl text-center font-bold">Login</h1>
      <Input name="usernameOrEmail" placeholder="Username / Email" required/>
      <Input
        name="password"
        placeholder="Password"
        type="password"
        required
      />
      <Button
        type="submit"
        className=""
      >
        Login
      </Button>
    </form>
  );
}

export default Login;
