import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../redux/authSlice"; // Import register action
import * as z from "zod";
import UiPaths from "../../paths/uiPaths";
import { signupSchemas } from "./validationSchema/signupSchema";


export function SignupForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({}); // Store all form data
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(
      signupSchemas[step].superRefine((data, ctx) => {
        if (step === 2) {
          const password = formData.password || watch("password"); // Keep previous password
          if (data.confirmPassword !== password) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Passwords must match",
              path: ["confirmPassword"],
            });
          }
        }
      })
    ),
    mode: "onBlur",
  });

  const onSubmit = (data) => {
    const updatedData = { ...formData, ...data }; // Merge previous and new data
    setFormData(updatedData);

    if (step < 2) {
      setStep(step + 1);
    } else {
      dispatch(registerUser(updatedData)); // Send all collected data
    }
  };

   // Navigate when authenticated
    useEffect(() => {
      if (isAuthenticated) {
        navigate(UiPaths.task);
      }
    }, [isAuthenticated, navigate]);

  return (
    <div>
      <div className="h-2 w-full bg-gray-500 rounded mb-4">
        <div
          style={{ width: `${((step + 1) / 3) * 100}%` }}
          className="h-2 bg-green-500 rounded"
        />
      </div>

      <br />
      {step === 0 && <div>Sign up with your email</div>}
      {step === 1 && <div>Select a six-character password</div>}
      {step === 2 && <div>Confirm your password</div>}
      <br />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
        {step === 0 && (
          <input
            {...register("email")}
            defaultValue={formData.email || ""}
            placeholder="Email"
            className="border p-2 rounded-md bg-transparent text-white"
          />
        )}
        {step === 1 && (
          <input
            type="password"
            {...register("password")}
            defaultValue={formData.password || ""}
            placeholder="Password"
            className="border p-2 rounded-md bg-transparent text-white"
          />
        )}
        {step === 2 && (
          <input
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirm Password"
            className="border p-2 rounded-md bg-transparent text-white"
          />
        )}
        {errors[Object.keys(errors)[0]] && (
          <p className="text-red-500">{errors[Object.keys(errors)[0]].message}</p>
        )}
        <br />
        <button type="submit" disabled={!isValid || loading} className="bg-white text-neutral-900 p-2 rounded-md transition hover:bg-primary-500">
          {step < 2 ? "Next" : loading ? "Signing up..." : "Signup"}
        </button>
        {step !== 0 && (
          <button type="button" onClick={() => setStep(step - 1)} className="text-white px-4 py-2 rounded-md hover:bg-gray-700">
            Back
          </button>
        )}
      </form>
    </div>
  );
}

