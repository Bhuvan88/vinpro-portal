import { Tabs, Breadcrumb, InputNumber } from "antd";
import { useRouter } from "next/router";
import { commonServerSideProps } from "src/commonServerSideProps";
import React, { useEffect, useState } from "react";
import { useTeam } from "src/teamProvider";
import { useApiUrl, useTranslate, useCustom } from "@refinedev/core";
import { Create, Edit, useDrawerForm, useSelect, useForm } from "@refinedev/antd";
import { Form, Input, Upload, Typography, Row, Col, Card } from "antd";
import FormIconInput from "@components/Inputs/FormIconInput";
import {
  getValueProps,
  MediaConfig,
  mediaUploadMapper,
  useDirectusUpload,
} from "@tspvivek/refine-directus";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export const getServerSideProps = commonServerSideProps;

const WebsettingsPage = () => {
  const router = useRouter();
  const { setSelectedMenu, setHeaderTitle, identity, isAdmin } = useTeam();

  const { TextArea } = Input;
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const [formdata, setFormData] = useState<any>({});
  //const [existingData, setExistingData] = useState<any>(null);
 
  useEffect(() => {
    setSelectedMenu("/website-settings", "/website-settings");
    setHeaderTitle("Website Settings");
  }, []);

  // 🔍 Check if "Home page Section 3" already exists
  const { data: existingData, refetch } = useCustom({
    url: `${apiUrl}items/website_address`,
    method: "get",
    meta: {
      fields: ["*"],
    },
    queryOptions: {
      enabled: true,
      onSuccess: (response) => {
         //console.log("Existing Data >>:", response?.data?.[0]);
        // setExistingData(response?.data?.[0]);
      },
    },
  });

  const { formProps, saveButtonProps, formLoading, form } = useForm({
    resource: "website_address",
    action: "edit",
    id: "1",
    mutationMode: "pessimistic",
    redirect: false,
    warnWhenUnsavedChanges:true,
    onMutationSuccess: () => {
      formProps.form?.resetFields();
      refetch(); // Refetch to get the latest data
      // callback("success");
    },
    successNotification: () => ({
      message:  "Successfully Updated",
      description: t("successfull"),
      type: "success",
    }),
  });

   const defaultMapper = (params: any) => {
      return { ...params };
    };

    useEffect(() => {
      const record = existingData; 
        if (record) {
          formProps.form?.setFieldsValue({
           mobile: record?.data?.[0].mobile || "",
             emailid: record?.data?.[0].emailid || "",
             address1: record?.data?.[0].address1 || "",
              address2: record?.data?.[0].address2 || "",
              city: record?.data?.[0].city || "",
              pincode : record?.data?.[0].pincode || "",
              facebook_link: record?.data?.[0].facebook_link || "",
              linkedin_link : record?.data?.[0].linkedin_link || "",
              instagram_link : record?.data?.[0].instagram_link || "",
              description:  record?.data?.[0].description || "",
          });
        }
      }, [existingData]);

  return (
    <div>
      <Breadcrumb style={{ margin: "16px" }}>
        <Breadcrumb.Item
          className="clickable"
          onClick={() => router.push("/website-settings")}
        >
          Web Settings
        </Breadcrumb.Item>
        <Breadcrumb.Item>Web Address</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title={"Website Address"}
        style={{
          marginBottom: 24,
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
        bodyStyle={{ padding: 24 }}
      >
        <img
          src="./images/address.jpg"
          alt="Image 2"
          style={{ width: "50%", height: "auto" }}
        />

        <Create
          title={false}
          saveButtonProps={saveButtonProps}
          isLoading={formLoading}
          goBack={false}
          headerProps={{ extra: false}}
        >
          <Form
            {...formProps}
            
            name="websettings"
            onFinish={(values) => {
              formProps.onFinish && formProps.onFinish(defaultMapper(values));
            }}
            layout="vertical"
            style={{ maxWidth: 800 }}
            onValuesChange={(changedValues, allValues) => {
              setFormData(allValues);
            }}
            initialValues={{
              mobile: existingData?.data?.[0].mobile || "",
             emailid: existingData?.data?.[0].emailid || "",
             address1: existingData?.data?.[0].address1 || "",
              address2: existingData?.data?.[0].address2 || "",
              city: existingData?.data?.[0].city || "",
              pincode : existingData?.data?.[0].pincode || "",
              facebook_link: existingData?.data?.[0].facebook_link || "",
              linkedin_link : existingData?.data?.[0].linkedin_link || "",
              instagram_link : existingData?.data?.[0].instagram_link || "",
              description:  existingData?.data?.[0].description || "",
            }}
          >
            <Row gutter={24}>
              <Col span={12}>
                <FormIconInput
                  label="Phone Number"
                  name="mobile"
                  rules={[{ required: true, message: "Enter phone number" }]}
                  icon="FileTextOutlined"
                  children={<InputNumber  min={10} max={10} style={{ width: "100%" }}/>}
                />
              </Col>
              <Col span={12}>
                <FormIconInput
                  label="Email Id"
                  name="emailid"
                  rules={[{ required: true, message: "Enter email id " }]}
                  icon="FileTextOutlined"
                  children={<Input />}
                />
              </Col>

              <Col span={12}>
                <FormIconInput
                  label="Address 1"
                  name="address1"
                  rules={[{ required: false, message: "Enter Address 1  " }]}
                  icon="FileTextOutlined"
                  children={<Input />}
                />

                <FormIconInput
                  label="Address 2"
                  name="address2"
                  rules={[{ required: false, message: "Enter Address 2 " }]}
                  icon="FileTextOutlined"
                  children={<Input />}
                />
                 <FormIconInput
                  label="City"
                  name="city"
                  rules={[{ required: false, message: "Enter Address 2 " }]}
                  icon="FileTextOutlined"
                  children={<Input />}
                />

                 <FormIconInput
                  label="Pincode"
                  name="pincode"
                  rules={[{ required: false, message: "Enter Address 2 " }]}
                  icon="FileTextOutlined"
                  children={<InputNumber min={6} style={{ width: "100%" }}/>}
                />
              </Col>
               <Col span={12}>
                <FormIconInput
                  label="Facebook"
                  name="facebook_link"
                  rules={[{ required: false, message: "Enter Address 2 " }]}
                  icon="FileTextOutlined"
                  children={<Input />}
                />

                <FormIconInput
                  label="LinkedIn"
                  name="linkedin_link"
                  rules={[{ required: false, message: "Enter Address 2 " }]}
                  icon="FileTextOutlined"
                  children={<Input />}
                />

                <FormIconInput
                  label="Instagram"
                  name="instagram_link"
                  rules={[{ required: false, message: "Enter Address 2 " }]}
                  icon="FileTextOutlined"
                  children={<Input />}
                />

               </Col>

              <Col span={24}>
                <FormIconInput
                  label="Description"
                  name="description"
                  icon="EditOutlined"
                >
                  <ReactQuill
                    theme="snow"
                    value={formProps.form?.getFieldValue("description") || ""}
                    onChange={(value) =>
                      formProps.form?.setFieldsValue({ description: value })
                    }
                    style={{ height: "200px" }}
                  />
                </FormIconInput>
              </Col>
            </Row>
          </Form>
        </Create>
      </Card>
    </div>
  );
};

export default WebsettingsPage;
