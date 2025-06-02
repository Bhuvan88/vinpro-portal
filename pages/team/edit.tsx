import React, { useState } from "react";
import {
  Edit,
  useForm,
  useSelect,
} from "@refinedev/antd";
import {
  Form,
  Input,
  Select,
  Switch, 
  Upload
} from "antd";
import { commonServerSideProps } from "src/commonServerSideProps";
import FormIconInput from "@components/Inputs/FormIconInput";
import {
  getValueProps,
  MediaConfig,
  mediaUploadMapper,
  useDirectusUpload,
} from "@tspvivek/refine-directus";
import { directusClient } from "src/directusClient";
import { useTranslate,useApiUrl } from "@refinedev/core";
import { CustomIcon } from "@components/datacomponents/CustomIcon";

export const getServerSideProps = commonServerSideProps;

type EditProps = {
  callback: (status: string) => void;
  id: string;
  visible:boolean;
};
const DriverEdit: React.FC<EditProps> = ({ callback, id }) => {
   const { TextArea } = Input;
  const mediaConfigList: MediaConfig[] = [
    { name: "image", multiple: false, maxCount: 1 },
  ];
  const getUploadProps = useDirectusUpload(mediaConfigList, directusClient);
  const t = useTranslate();
  const [formdata,setFormData]=useState<any>({});
   const apiUrl = useApiUrl();
  // Edit Drawer
  const {
    formProps,
    saveButtonProps,  
    queryResult,
    id: editId,
    setId,
    form,
  } = useForm<any>({
    mutationMode: "pessimistic",
    onMutationSuccess: (data) => {
      callback("success");
    },
    id:id,
    action: "edit",
    resource: "team_members",
    metaData: {
      fields: ["image.*","first_name","last_name","email","status","description","designation"],
    },
    redirect: false,
    warnWhenUnsavedChanges: true,
    successNotification: (data) => {
      return {
        message: t("successfullyedited"),
        description: t("successfull"),
        type: "success",
      };
    },
  });

   const { data, isLoading } = queryResult;
   const record = data?.data;
  
  // const { selectProps: cityProps } = useSelect({
  //   resource: "city",
  //   optionLabel: "name",
  //   optionValue: "id",
  //   sorters: [
  //     {
  //         field: "name",
  //         order: "asc",
  //     }
  // ],
  // filters: [
  //   {
  //       field: "name",
  //       operator:  "ne",
  //       value:"Namakkal"
  //   },
  // ],
  // pagination:{
  //   pageSize:-1
  // },
  // });
  
  const defaultMapper = (params: any) => {
    mediaUploadMapper(params, mediaConfigList);

    if (params?.image) {
      params["image"] = params?.image;
      } else {
      params["image"] = null;
      }
    return {
      ...params,
    };
  };

  return (
    <Edit
      saveButtonProps={saveButtonProps}
      headerProps={{ extra: false, title: false, className: "drawer-body" }}
      isLoading={isLoading}
    >
      <Form
        {...formProps}
        layout="vertical"
        form={form}
        onFinish={(values) => {
          return (
            formProps.onFinish && formProps.onFinish(defaultMapper(values))
          );
        }}
        onValuesChange={(changedValues, allValues) => {
          setFormData(allValues);
        }}
        initialValues={{          
          first_name:record?.first_name,
          last_name:record?.last_name,
          image:record?.image,
          email:record?.email,
          status:record?.status,
          description:record?.description,
          designation:record?.designation,
        }}
      >
           <FormIconInput
                label="Designation"
                name={"designation"}
                rules={[{ required: true, message:"Designation is required" }]}
                children={<Input />}
                // children={
                //   <Select                    
                //        allowClear
                //        placeholder="Select Designation"
                //        options={[
                //         { label:"Manager",value:"Manager"},
                //         { label:"HR",value:"HR"},
                //         { label:"TeamLead",value:"Team Lead"},
                //         ]}
                //     />
                // }
                icon={"UserSwitchOutlined"}
            />
      <FormIconInput
           label="First Name"
            name={"first_name"}
            rules={[{ required: true, message: t("firstnameisrequired") }]}
            children={<Input />}
            icon={"UserOutlined"}
          />

            <FormIconInput
            label="Last Name"
            name={"last_name"}
            rules={[{ required: true, message: t("lastnameisrequired") }]}
            children={<Input />}
            icon={"UserOutlined"}
          />

       
       
         <FormIconInput
                 label="Email"
                  name={"email"}
                  rules={[
                  // { required: true, message:  t("emailidisrequired") },
                  {
                  type: "email",
                  message: t("invalidemailaddress"),
                  },
                  ]}
                  children={<Input />}
                  icon={"MailOutlined"}
            />
             <FormIconInput
                    label="Description"
                    name={"description"}
                    rules={[{ required: false, message: t("enteritemdescrption") }]}
                    children={<TextArea />}
                    icon={"DollarOutlined"}
                  />
            
            <FormIconInput
                label="Status"
                name={"status"}
                //rules={[{ required: true, message: t("statusisrequired") }]}
                children={
                  <Select                    
                       allowClear
                       placeholder="Select Status"
                      options={[
                      { label:t("active"), value:"active"},
                      { label:t("suspended"),value:"suspended"},
                      ]}
                    />
                }
                icon={"UserSwitchOutlined"}
            />

<div className="icon-input-field">
          <CustomIcon
            type={"PictureOutlined"}
            styleProps={{ style: { fontSize: 20, marginTop: 15 } }}
          />
          <Form.Item label={t("image")}>
            <Form.Item
              name="image"
              valuePropName="fileList"
              getValueProps={(data) =>
                getValueProps({
                  data,
                  imageUrl: apiUrl,
                })
              }
              noStyle
              rules={[
                {
                  required:true,message:"Image is required"
                },
              ]}
            >
              <Upload.Dragger
                name="file"
                listType="picture"
                multiple={false}
                beforeUpload={() => false}
                {...getUploadProps("image")}
              >
                <p className="ant-upload-text">
                {t("drag&dropafileinthisarea")}
                </p>
              </Upload.Dragger>
            </Form.Item>
          </Form.Item>
        </div>

       {/*  
         <Form.Item
              label={t("newpassword")}
                name={"password"}
                rules={[{ required: true, message: t("passwordisrequired")},{min:6,message:t("passwordmustbeatleast6characters")}]}
                children={<Input.Password type="password" />}             
          />
          <Form.Item
                  label={t("retypenewpassword")}
                    rules={[{ required: true,message:t("pleaseenterretypenewpassword")},
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error(t("thetwopasswordsthatyouentereddonotmatch")));
                                    },
                                }),
                            ]}
                            name="confirmpassword"
                        >
                            <Input.Password type="password" />
               </Form.Item> */}
           </Form>
    </Edit>
  );
};

export default DriverEdit;
