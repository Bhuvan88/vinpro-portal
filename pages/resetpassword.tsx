"use client";
import { Button, Input, Form, Typography, Result, Card, Flex } from "antd";
import { useForm } from "@refinedev/antd";
import { useTranslate } from "@refinedev/core";
import { useState } from "react";
import { directusClient } from "src/directusClient";
import {  useRouter } from "next/router";
import { commonServerSideProps } from "src/commonServerSideProps";

export const getServerSideProps = commonServerSideProps;
const ResetPassword= () => {
    const [isLoading, setIsLoading] = useState(false);
    const { form } = useForm();
    const t = useTranslate();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const query = router.query;

    const onFinish = async (values) => {
        // console.log('finish', values);
        const { password } = values;
        setIsLoading(true);
        try {
           await directusClient.auth.password.reset(query?.token as string, values.password);
            setSuccess(true);
            setIsLoading(false);
        } catch (e: any) {
            console.log(e);
            if (e) {
                setError(t("resetpassworderrormessage"));
                setIsLoading(false);
            }
        }
    };
    
    return (
        <div style={{ height: "100vh", backgroundColor: "#eeeeee" }}>
            <Flex justify="center" align="center" style={{ height: "100%" }}>
            <Card>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <img src="/images/red_logo.png" width={"200px"} />
                </div>

                {success ? (
                        <Result
                            status="success"
                            subTitle={<Typography.Text>{t("resetpasswordsuccessmessage")}</Typography.Text>}
                            extra={[
                                <Button
                                    key="resetpassword-signin"
                                    onClick={() => {
                                        router.push("/login");      
                                    }}
                                    style={{ color:"#DC5F00",borderColor:"#DC5F00"}}
                                    size="large"
                                    block
                                >
                                    {t("signin")}
                                </Button>,
                            ]}
                        />
                    ) : (
                    <>
                <Typography.Title level={4} style={{ margin: "0px 0px 25px" }}>
                    {t("enteryournewpasswordforyouraccount")}
                </Typography.Title>
                
                <Form name="ResetPassword" onFinish={onFinish} form={form}>
                    <Form.Item
                        label={t("newpassword")}
                        labelCol={{ style: { display: "none" } }}
                        name="password"
                        rules={[{ required: true,message:t("pleaseenternewpassword")},{min:6,message:t("passwordmustbeatleast6characters")}]}
                    >
                        <Input.Password size="large" type="password" placeholder={t("newpassword")} />
                    </Form.Item>
                    <Form.Item
                        label={t("retypenewpassword")}
                        rules={[
                            {
                                required: true,message:t("pleaseenterretypenewpassword")
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(t("thetwopasswordsthatyouentereddonotmatch"))
                                    );
                                },
                            }),
                        ]}
                        name="confirmpassword"
                        labelCol={{ style: { display: "none" } }}
                    >
                        <Input.Password size="large" type="password" placeholder={t("retypenewpassword")} />
                    </Form.Item>

                    <Form.Item>
                        <Button loading={isLoading} type="primary" size="large" block htmlType="submit">
                            {t("resetpassword")}
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            onClick={() => {
                                router.push("/login");                  
                            }}
                            style={{borderColor:"#DC5700",color:"#DC5700"}}
                            size="large"
                            block
                        >
                           {t("signin")}
                        </Button>
                    </Form.Item>
                </Form>
              </>
            )}
           </Card>
         </Flex>
     </div>
    );
};

ResetPassword.noLayout = true;

export default ResetPassword;
