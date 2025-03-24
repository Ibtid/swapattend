import { useState, useRef } from "react";
import { LoginForm } from "../components/AuthForm.components/LoginForm";
import { SignupForm } from "../components/AuthForm.components/Signup";


const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-neutral-800 rounded-xl shadow-lg">
      <h1 className="text-xl mx-auto w-full text-center">Task Manager</h1>
      <br />
      {isLogin ? <LoginForm /> : <SignupForm />}
      <br />
      {isLogin ? "Are you a new user?" : "Are you an old user?"}
      <button
        className="mt-4 text-primary-500 underline ml-4"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Switch to Signup" : "Switch to Login"}
      </button>
    </div>
  );
}

export default AuthForm