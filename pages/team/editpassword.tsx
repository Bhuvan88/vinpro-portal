import React, { useState } from "react";
import {
  Edit,
  useForm,
} from "@refinedev/antd";
import {
    Drawer,
  Form,
  Input, 
} from "antd";
import { commonServerSideProps } from "src/commonServerSideProps";
import FormIconInput from "@components/Inputs/FormIconInput";
import { useTranslate } from "@refinedev/core";

export const getServerSideProps = commonServerSideProps;

type EditProps = {
  callback: (status: string) => void;
  id: string;
  visible:any;
};
const DriverPassword: React.FC<EditProps> = ({ callback,visible, id }) => {
 
  const t = useTranslate();
  const [formdata,setFormData]=useState<any>({});
  
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
    resource: "directus_users",
    metaData: {
      fields: ["email"],
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
    autoSave: {
        enabled: true,
        onFinish: (values: any) => {
            return {
                password: values?.newpassword,
            };
        },
    },
  });

   const { data, isLoading } = queryResult;
   const record = data?.data;
  
  const defaultMapper = (params: any) => {
    var obj = {};
    obj['role'] = "4aa0accb-66b0-4c0f-87da-373b130413b4";
    return {
      ...obj,
      ...params,
    };
  };

  return (
    <Drawer
    open={visible}   
    onClose={() => { callback('close'); }}>
    <Edit
      saveButtonProps={saveButtonProps}
      headerProps={{ extra: false,title:t("changepassword"), className: "drawer-body" }}
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
          email:record?.email,
        }}
      >       
          <FormIconInput
                 label={t("email")}
                name={"email"}
                rules={[
                  { required: true, message:  t("emailidisrequired") },
                  {
                    type: "email",
                    message: t("invalidemailaddress"),
                  },
                ]}
                children={<Input disabled value={queryResult?.data?.data?.email}/>}
                icon={"MailOutlined"}
            />
       
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
               </Form.Item>
           </Form>
    </Edit>
    </Drawer>
  );
};

export default DriverPassword;