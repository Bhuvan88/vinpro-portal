import React, { useState } from "react";
import { Edit,useForm} from "@refinedev/antd";
import { Form, Input, Select,} from "antd";
import { commonServerSideProps } from "src/commonServerSideProps";
import FormIconInput from "@components/Inputs/FormIconInput";
import { useTranslate } from "@refinedev/core";

export const getServerSideProps = commonServerSideProps;

type EditProps = {
  callback: (status: string) => void;
  id: string;
  visible:boolean;
};
const OwnerEdit: React.FC<EditProps> = ({ callback, id }) => {
 
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
      fields: ["id","merchant.id","merchant.name","first_name","last_name","email","status"],
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
  
  
  const defaultMapper = (params: any) => {
    var obj = {};
    obj['role'] = "c61fec11-9cee-4d59-8adf-dd31765bed2a";
    return {
      ...obj,
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
          email:record?.email,
          status:record?.status,
        }}
      >
      <FormIconInput
           label={t("firstname")}
            name={"first_name"}
            rules={[{ required: true, message: t("firstnameisrequired") }]}
            children={<Input/>}
            icon={"UserOutlined"}
          />

            <FormIconInput
            label={t("lastname")}
            name={"last_name"}
            rules={[{ required: true, message: t("lastnameisrequired") }]}
            children={<Input/>}
            icon={"UserOutlined"}
          /> 

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
                children={<Input/>}
                icon={"MailOutlined"}
            />

            <FormIconInput
                label={t("status")}
                name={"status"}
                //rules={[{ required: true, message: t("statusisrequired") }]}
                children={
                  <Select                    
                       allowClear
                      options={[
                      { label:t("active"), value:"active"},
                      { label:t("suspended"),value:"suspended"},
                      ]}
                    />
                }
                icon={"UserSwitchOutlined"}
            />

           </Form>
    </Edit>
  );
};

export default OwnerEdit;
