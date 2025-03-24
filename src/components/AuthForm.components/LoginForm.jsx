import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import UiPaths from "../../paths/uiPaths";
import { loginSchema } from "./validationSchema/loginSchema";

export function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ resolver: zodResolver(loginSchema), mode: "onBlur" });

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  // Navigate when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(UiPaths.task);
    }
  }, [isAuthenticated, navigate]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
      <div>Email</div>
      <input
        {...register("email")}
        placeholder="Type your email"
        className="border border-gray-400 p-2 rounded-md bg-transparent text-white focus:outline-none"
      />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      <div>Password</div>
      <input
        type="password"
        {...register("password")}
        placeholder="Type your password"
        className="border border-gray-400 p-2 rounded-md bg-transparent text-white focus:outline-none"
      />
      {errors.password && <p className="text-red-500">{errors.password.message}</p>}

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={!isValid || loading}
        className="bg-white text-neutral-900 p-2 rounded-md transition duration-300 hover:bg-primary-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}