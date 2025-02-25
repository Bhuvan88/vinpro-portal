import React, { useState } from "react";

import {
  Row,
  Col,
  Layout as AntdLayout,
  Card,
  Typography,
  Form,
  Input,
  Button,
  message,
} from "antd";

import { useIsAuthenticated, useNavigation, useTranslate } from "@refinedev/core";
import { commonServerSideProps } from "src/commonServerSideProps";
import { useRouter } from "next/router";
import { directusClient } from "src/directusClient";
import { CustomLoadingPage } from "@components/datacomponents/CustomLoadingPage";

export const getServerSideProps = commonServerSideProps;

const ForgotPassword = () => {
  const router = useRouter();
  const t = useTranslate();
  const { Title } = Typography;
  const [inputVal, setInputVal] = useState("");
  const { push } = useNavigation();
  const {isError, isLoading } = useIsAuthenticated({
    v3LegacyAuthProviderCompatible:true
  });

  const CardTitle = (
        <Title level={3} className="logintitle">
          {t("forgotpassword")}
        </Title>
      );

      const onChange = (e) => {
        const { value } = e.target;
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if ((!isNaN(value) && reg.test(value)) || value === "" || value === "-") {
          setInputVal(value);
          return value;
        } else {
          return "";
        }
      };
    
      const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
      };

      const checkValidateEmail = (email) => {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
      };

      const onFinish = async (values) => {      
        const { email } = values;
        try {
          if (checkValidateEmail(email)) {        
           await directusClient.auth.password.request(email, process.env.NEXT_PUBLIC_APP_URL + "resetpassword/");
            message.success(t("resetpasswordmsg"));
            router.push("/login");
          }
        } catch (e) {         
          message.error(t("invalidemailaddress"));
          // console.log("e", e);
          // message.error(e.errors && e.errors[0] && e.errors[0].message);
        }
      };
      
  return  isLoading ? (
    <CustomLoadingPage />
  ) : (
    isError && (
    <AntdLayout className="loginlayout">
    <Row
      justify="center"
      align="middle"
      style={{
        height: "100vh",
      }}
    >
      <Col xs={22}>
        <div className="logincontainer">
          <div className="loginimageContainer">
            <img
              src={"/images/logo.jpg"}
              alt="Mrlocal Logo"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "84px",
                height: "84px",
                objectFit: "contain",
                borderRadius: 8,
              }}
            />
          </div>
          <Card
            title={CardTitle}
            styles={{header:{ borderBottom: 0, backgroundColor: "#fff"}}}
          >
          <Typography.Paragraph>
            {t("resetmessage")}
          </Typography.Paragraph>
          
        <Form
             onFinish={onFinish}
             onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: t("pleaseenteremailaddress"),
              },
              {
                type: "email",
                message: t("invalidemailaddress"),
              },
            ]}
          >
            <Input placeholder={t("email")} onChange={onChange}/>
          </Form.Item>

            <Form.Item>
          <Button type="primary" size="large" htmlType="submit" block>
                   {t("sendresetlink")}
          </Button>
          </Form.Item>        

        </Form> 

        
          <Button 
                   loading={isLoading}
                   type="default" size="large" 
                   style={{borderColor:"#DC5700",color:"#DC5700"}}
                   htmlType="submit" block
                   onClick={() => { router.push("/login")}}                 
          >
                   {t("signin")}
          </Button>
           
          </Card> 
          {/* <Button
                loading={isLoading}
                className="signup-previous-btn mt-10"
                onClick={(): void => push('/')}
              >
               {t("goback")}
              </Button>  */}
        </div>
      </Col>
    </Row>
  </AntdLayout>             
    )
  );
};

ForgotPassword.noLayout =true;

export default ForgotPassword;