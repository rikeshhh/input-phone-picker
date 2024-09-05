import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

type FormValues = {
  example: string;
  exampleRequired: string;
  phoneNumber: string;
};

export default function ImprovedPhoneForm() {
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      example: "test",
      exampleRequired: "",
      phoneNumber: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    setSubmitStatus("Form submitted successfully!");
    // Simulating an API call
    setTimeout(() => {
      reset();
      setSubmitStatus(null);
    }, 3000);
  };

  const handlePhoneNumberChange = (value: string | undefined) => {
    const maxLength = 15;
    if (value) {
      return value.replace(/\s+/g, "").slice(0, maxLength);
    }
    return value;
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <div>
        <label htmlFor="example">Example:</label>
        <input id="example" {...register("example")} />
      </div>

      <div>
        <label htmlFor="exampleRequired">Required Example:</label>
        <input
          id="exampleRequired"
          {...register("exampleRequired", {
            required: "This field is required",
            minLength: { value: 2, message: "Minimum length is 2 characters" },
          })}
        />
        {errors.exampleRequired && (
          <p style={{ color: "red" }}>{errors.exampleRequired.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phoneNumber">Phone Number:</label>
        <Controller
          name="phoneNumber"
          control={control}
          rules={{
            required: "Phone number is required",
            validate: (value) =>
              isValidPhoneNumber(value) || "Invalid phone number",
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <PhoneInput
              id="phoneNumber"
              placeholder="Enter phone number"
              value={value}
              onChange={(val) => {
                const filteredValue = handlePhoneNumberChange(val);
                onChange(filteredValue);
              }}
              onBlur={onBlur}
              defaultCountry="US"
              international
            />
          )}
        />
        {errors.phoneNumber && (
          <p style={{ color: "red" }}>{errors.phoneNumber.message}</p>
        )}
      </div>

      <button type="submit">Submit</button>

      {submitStatus && <p style={{ color: "green" }}>{submitStatus}</p>}
    </form>
  );
}
