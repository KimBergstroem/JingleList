import Link from "next/link";
import { LoginForm } from "./LoginForm";

export default function Login() {
  return (
    <>
      <div className="container-wrapper">
        <h1 className="text-4xl font-bold mb-4">Login</h1>
        <LoginForm />
        <p className="text-sm text-gray-500 mt-4">
          Don&apos;t have an account? <Link href="/register">Register</Link>
        </p>
      </div>
    </>
  );
}
