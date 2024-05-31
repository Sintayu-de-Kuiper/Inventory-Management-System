"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RegisterSchema } from "@/schemas";
import Button from "@/components/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import { createUser } from "@/app/register/[passId]/[studentNumber]/create";
import { useParams, useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const { passId, studentNumber } = useParams();

  const paramsSchema = z.object({
    passId: z.string().min(1, "Pass ID is required"),
    studentNumber: z
      .string()
      .refine((value) => !isNaN(Number(value)) && value !== "", {
        message: "Student number must be a number",
      })
      .transform((value) => Number(value))
      .refine((value) => value > 0, {
        message: "Student number must be a positive number",
      }),
  });
  const validatedParams = paramsSchema.safeParse({ passId, studentNumber });

  if (!validatedParams.success) {
    alert(`Invalid parameters! ${validatedParams.error.message}`);
    router.push("/");
  }

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      studentNumber: validatedParams?.data?.studentNumber,
      cohort: "",
    },
  });

  async function onSubmit(data: z.infer<typeof RegisterSchema>) {
    const response = await createUser({
      ...data,
      passId: passId as string,
    });
    console.log(response);

    if (response.success) {
      router.push("/home");
    } else {
      alert(`Failed to create user: ${response.errors.join(", ")}`);
      router.push("/");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-4 flex flex-col gap-8"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg text-gray-foreground">
                Voornaam
              </FormLabel>
              <FormControl>
                <input
                  className="form__field block h-12 p-2 text-lg outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg text-gray-foreground">
                Achternaam
              </FormLabel>
              <FormControl>
                <input
                  className="form__field block h-12 w-full p-2 text-lg outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="studentNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg text-gray-foreground">
                Studentnummer
              </FormLabel>
              <FormControl>
                <input
                  className="form__field block h-12 w-full p-2 text-lg outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cohort"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg text-gray-foreground">
                Cohort (2020-2021)
              </FormLabel>
              <FormControl>
                <input
                  className="form__field block h-12 w-full p-2 text-lg outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className={"mx-auto mt-20"} type={"submit"}>
          Registeer
        </Button>
      </form>
    </Form>
  );
}
