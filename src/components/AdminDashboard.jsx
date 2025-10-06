"use client";

import React from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Replace with your API call
      console.log("Password data:", data);
      toast.success("Password changed successfully!");
      reset();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const newPassword = watch("newPassword");

  return (
    <div
      className="max-w-md mx-auto mt-10 p-6 rounded-lg shadow-md"
      style={{ backgroundColor: "var(--color-neutral-light)" }}
    >
      <Toaster />
      <h2
        className="text-2xl font-bold mb-6 text-center"
        style={{ color: "var(--color-primary)" }}
      >
        Change Password
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Current Password */}
        <div>
          <label
            className="block mb-1 font-medium"
            style={{ color: "var(--color-text)" }}
          >
            Current Password
          </label>
          <input
            type="password"
            {...register("currentPassword", { required: "Current password is required" })}
            className="w-full p-2 border rounded"
            style={{
              borderColor: "var(--color-primary)",
              backgroundColor: "var(--color-neutral)",
              color: "var(--color-text)",
            }}
          />
          {errors.currentPassword && (
            <p className="text-sm mt-1" style={{ color: "var(--color-danger)" }}>
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label
            className="block mb-1 font-medium"
            style={{ color: "var(--color-text)" }}
          >
            New Password
          </label>
          <input
            type="password"
            {...register("newPassword", {
              required: "New password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            })}
            className="w-full p-2 border rounded"
            style={{
              borderColor: "var(--color-primary)",
              backgroundColor: "var(--color-neutral)",
              color: "var(--color-text)",
            }}
          />
          {errors.newPassword && (
            <p className="text-sm mt-1" style={{ color: "var(--color-danger)" }}>
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            className="block mb-1 font-medium"
            style={{ color: "var(--color-text)" }}
          >
            Confirm Password
          </label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value === newPassword || "Passwords do not match",
            })}
            className="w-full p-2 border rounded"
            style={{
              borderColor: "var(--color-primary)",
              backgroundColor: "var(--color-neutral)",
              color: "var(--color-text)",
            }}
          />
          {errors.confirmPassword && (
            <p className="text-sm mt-1" style={{ color: "var(--color-danger)" }}>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full p-2 rounded font-medium"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-text)",
          }}
        >
          {isSubmitting ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
