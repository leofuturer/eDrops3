import Input from "./Input";
import Button from "../common/Button";

export function Signup() {
  return (
    <form className="form">
      <h1 title="signup" className="text-2xl text-center font-bold">Sign Up</h1>
      <Input name="email" placeholder="Email" type="email" autoComplete="email" required />
      <Input name="username" placeholder="Username" type="text" autoComplete="username" required />
      <Input
        name="password"
        placeholder="Password"
        type="password"
        autoComplete="new-password"
        required
      />
      <Input
        name="confirmPassword"
        placeholder="Confirm Password"
        type="password"
        autoComplete="new-password"
        required
      />
      <Button
        type="submit"
        className="w-full h-16"
      >
        Sign Up
      </Button>
    </form>
  );
}

export default Signup;
