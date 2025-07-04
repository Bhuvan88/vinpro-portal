import {useForm } from "@refinedev/antd";
import { useApiUrl, useGetIdentity, useTranslate } from "@refinedev/core";
import {
    Form,
    Input,
    Button,
    Row,
    Col, 
   Typography,
   Card,
   Upload,
    
} from "antd";

import { useEffect, useState } from "react";
import { useTeam } from "src/teamProvider";
import { commonServerSideProps } from "src/commonServerSideProps";
import { getValueProps, MediaConfig, mediaUploadMapper, useDirectusUpload } from "@tspvivek/refine-directus";
import { directusClient } from "src/directusClient";
import { PlusOutlined } from "@ant-design/icons";

export const getServerSideProps = commonServerSideProps;
const EditProfile: React.FC = () => {
    const t = useTranslate();
    const { setHeaderTitle,setSelectedMenu ,selectedRole} = useTeam();
    const [isloading, setIsLoading] = useState(false);
    const apiUrl = useApiUrl();
    const mediaConfigList: MediaConfig[] = [{ name: "avatar", multiple: false, maxCount: 1 }];
    const getUploadProps = useDirectusUpload(mediaConfigList, directusClient);
    const { data: identity, refetch } = useGetIdentity({
            v3LegacyAuthProviderCompatible:true
        });
        
    useEffect(() => {
        setSelectedMenu('../profile', '../profile');
        setHeaderTitle(t("myprofile"));
    }, []);

    const { formProps,queryResult } = useForm({
        resource: "directus_users",
        id: identity?.id,
        action: "edit",
        redirect: false,
        successNotification: { message: "Successfully Updated", type: "success" },
        onMutationSuccess() {
          setIsLoading(false);  
          refetch();             
        },
        onMutationError() {
            setIsLoading(false);
        },
    });

    const { formProps: passwordFormProps, queryResult: passwordQueryResult } = useForm({
        resource: "directus_users",
        id: identity?.id,
        action: "edit",
        redirect: false,
        successNotification: { message: "Password Successfully Updated", type: "success" },
    });

    const {isLoading } = queryResult;
   
    const defaultMapper = (params: any) => {
        mediaUploadMapper(params, mediaConfigList);
        if (params?.avatar) {
            params["avatar"] = params?.avatar;
            } else {
            params["avatar"] = null;
            }
        return { ...params };
    };
    
    return (
        <Card loading={isLoading} >
        <div  style={{ height: "calc(100vh - 120px)", overflow: "auto" }}>
            <div className="flex" style={{ alignItems: "center" }}>                                    
             <Typography.Title level={4} style={{ margin: "0px 0px 10px" }}>
                My Profile
            </Typography.Title></div>
                <Form
                {...formProps}
                layout="vertical"
                onFinish={(values) => {
                    setIsLoading(true);                 
                    return formProps.onFinish && formProps.onFinish(defaultMapper(values));
                }}
            >
            <Row gutter={24}>                 
                <Col span={12}> 
                <Form.Item
                    label="First Name"
                    name="first_name"
                    rules={[
                        { required: true , message: t("firstnameisrequired") },
                    ]}
                    children={<Input/>}
                    /></Col>

            <Col span={12}>                
                <Form.Item
                    label="Last Name"
                    name="last_name"
                    rules={[
                        { required: true , message: t("lastnameisrequired") },
                    ]}
                    children={<Input/>}
                    />
                </Col>
               </Row>
               <Row gutter={24}> 
               <Col span={12}> 
                    <Form.Item
					label="Username"
					name={"email"}
					rules={[{ required: true, message: t("entercontactemail") },{type: "email", message: t("invalidemailaddress")}]}
					children={<Input type={"email"} 
                                //  disabled={selectedRole === "Administrator" ? true : false}
                                 value={passwordQueryResult?.data?.data?.email}/>}					
				/>
                    </Col>
                    
                        </Row>
                        <Row gutter={24} >
                            <Col span={12}>
                            <Form.Item label={t("profilepicture")}>
                            <Form.Item
                                style={{ marginBottom:40 }}
                                name="avatar"
                                valuePropName="fileList"
                                getValueProps={(data) =>
                                    getValueProps({
                                        data,
                                        imageUrl: apiUrl,
                                        getFileUrl: (item) => {
                                            return apiUrl + "assets/" + item;
                                        },
                                    })
                                }
                            >
                                <Upload
                                    name="avatar"
                                    listType="picture-card"
                                    multiple={false}
                                    {...getUploadProps("avatar")}
                                    accept="image/png, image/jpeg"
                                    showUploadList={{
                                        showPreviewIcon: false,
                                    }} >
                                     <button style={{ border: 0, background: "none" }} type="button">
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>{t("upload")}</div>
                                    </button>
                                </Upload>
                            </Form.Item>
                        </Form.Item>
                            </Col>
                        </Row>
                     <Row>
                     <Col span={6}>                                        
                                <Button
                                    type="primary"                                   
                                    htmlType="submit"
                                    loading={isloading}
                                    size="large"
                                    block
                                >
                                    {t("updateprofile")}
                                </Button>                                             
                     </Col>
                     </Row>
            </Form>              
                
                <Typography.Title level={4} style={{ margin: "20px 0px 10px" }}>
                    {t("changepassword")}
                </Typography.Title>
                <Form name="ResetPassword" layout="vertical"
                    {...passwordFormProps}
                    initialValues={{
                        password:null,
                    }}               
                 >
    
        <Row gutter={24}>                 
        <Col span={12}>	                    
               < Form.Item 
                            label="New Password" name="password" 
                            rules={[{ required: true, message: t("passwordisrequired")},
                            {min:6,message:"Password must be atleast 6 characters"}] }
                >
                     <Input.Password type="password" />
                </Form.Item>
         </Col>
         <Col span={12}>
                    <Form.Item
                            label="Confirm Password"
                                rules={[{ required: true,message:"Confirm Password is required" },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue("password") === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error("The two passwords that you entered do not match!"));
                                                },
                                            }),
                                        ]}
                                        name="confirmpassword"
                                    >
                                        <Input.Password type="password" />
                        </Form.Item>
                </Col>
                </Row>

                <Row>
                <Col span={6}>
                        <Form.Item>
                                    <Button type="primary" size="large" block htmlType="submit">
                                        {t("updatepassword")}
                                    </Button>
                                </Form.Item>  
                </Col></Row>                                  
            </Form>
                         
        </div>
        </Card>
    );
};

export default EditProfile;