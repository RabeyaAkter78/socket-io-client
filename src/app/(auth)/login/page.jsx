/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import { Button, ConfigProvider, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function page() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { email, password } = values;
    console.log(values);

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const result = await response.json();

      if (result.success) {
        // console.log("Success:", result);
        // localStorage.setItem("user", JSON.stringify(result?.data));
        router.push(`/chat`);
        // message.success("Log In Successfull");
      } else {
        console.error("Failed:", result);
        message.error(result?.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <div className="bg-violet-800">
        <div className="container mx-auto pt-20">
          <h1 className="text-center text-4xl font-bold text-white">Login</h1>

          <div className="p-5">
            <ConfigProvider
              theme={{
                components: {
                  Form: {
                    itemMarginBottom: 20,
                  },
                  Input: {
                    borderRadius: 0,
                  },
                },
              }}
            >
              <Form
                form={form}
                name="basic"
                labelCol={{ xs: 24, sm: 24, md: 24 }}
                wrapperCol={{ xs: 24, sm: 24, md: 24 }}
                style={{ maxWidth: "100%", width: "400px", margin: "0 auto" }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Please input your Email!" },
                  ]}
                >
                  <Input placeholder="Email" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Please input your Password!" },
                  ]}
                >
                  <Input placeholder="Password" type="password" />
                </Form.Item>

                {error && (
                  <p className="text-center text-xl font-bold text-red-500">
                    {error}
                  </p>
                )}
                <Form.Item>
                  <Button block htmlType="submit">
                    Log in
                  </Button>
                </Form.Item>
              </Form>
              <p className="text-center text-white">
                Don't Have an Account?
                <span>
                  <Link href="/register" className="underline">
                    Register
                  </Link>
                </span>
              </p>
            </ConfigProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
