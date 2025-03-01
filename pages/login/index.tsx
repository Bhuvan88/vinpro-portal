import React, { useEffect, useState } from "react";
import "@refinedev/core";

import {
  Row,
  Col,
  Layout as AntdLayout,
  Card,
  Typography,
  Form,
  Input,
  Button,
  Checkbox,
  notification,
} from "antd";

import {
  useIsAuthenticated,
  useLogin,
  useNavigation,
  useTranslate,
} from "@refinedev/core";
import { CustomLoadingPage } from "@components/datacomponents/CustomLoadingPage";
import { checkValidateEmail } from "src/functions";
import { commonServerSideProps } from "src/commonServerSideProps";
import { Link } from "@refinedev/nextjs-router/legacy-pages";
import { useTeam } from "src/teamProvider";

export const getServerSideProps = commonServerSideProps;
const { Title } = Typography;

export interface ILoginForm {
  username: string;
  password: string;
  remember: boolean;
}

 const Login = () => {
  const [form] = Form.useForm<ILoginForm>();
  const { push } = useNavigation();
  const t = useTranslate();
  const {selectedRole} = useTeam();
  const { mutateAsync: login } = useLogin<ILoginForm>({
    v3LegacyAuthProviderCompatible:true,
     mutationOptions:{
       onError: () => {
        notification.error({ message: "Invalid email or password", description: t("error") });
        setisLoading(false);
     },
    }
  });

  const { isSuccess, isError } = useIsAuthenticated({
    v3LegacyAuthProviderCompatible:true
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isloading, setisLoading] = useState(false);
  
  const CardTitle = (
    <Title level={3} className="logintitle">
   Login
    </Title>
  );

  useEffect(() => {
    if (isSuccess) {
      setIsLoading(true);
      push("/home");
    }
  }, [isSuccess, selectedRole]);

  return isLoading ? (
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
                  src={"/images/logo2.svg"}
                  alt="Logo"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "64px",
                    objectFit: "contain",
                  marginBottom : 22,
                  marginLeft :-15
                     // borderRadius: 8,
                  }}
                />
              </div>
              <Card
                title={CardTitle}
                styles={{header:{ borderBottom: 0, backgroundColor: "#fff"}}}
              >
                <Form<ILoginForm>
                  layout="vertical"
                  form={form}
                  onFinish={(values) => {                 
                    if (checkValidateEmail(values.username)) {
                      login(values); 
                      setisLoading(true);                
                    } else {
                      //  setValues(values);
                      login(values);
                    }                    
                  }}
                  requiredMark={false}
                  initialValues={{
                    remember: false,
                  }}
                >
                  <Form.Item
                    name="username"
                    label= "Username"  //{t("username")}
                    rules={[{ required: true,message:"Please enter username"}  ,{type: "email", message:"Please enter valid email"},]}
                  >
                    <Input size="large" placeholder={t("username")} />
                  </Form.Item>
                  
                  <Form.Item
                    name="password"
                    label= "Password"
                    rules={[{ required: true,message:"Please enter password" }]}
                    style={{ marginBottom: "12px" }}
                  >
                    <Input.Password
                      type="password"
                      placeholder="●●●●●●●●"
                        
                    />
                  </Form.Item>
                  <div style={{ marginBottom: "15px",marginTop:"15px" }}>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox
                        style={{
                          fontSize: "12px",
                        }}
                      >
                        Remember me
                      </Checkbox>
                    </Form.Item>
                    
                   {/* <div style={{ float: "right",fontSize: "12px"}}>
                     <Link href={"../forgotpassword"}> {t("forgotpassword")}</Link>
                    </div> */}

                  </div>
                  
                  <Button loading={isloading} type="primary" size="large" htmlType="submit" block>
                  Sign in
                  </Button>

                </Form>                              
              </Card>
            </div>
          </Col>
        </Row>
      </AntdLayout>
    )
  );
};

Login.noLayout =true;

export default Login;