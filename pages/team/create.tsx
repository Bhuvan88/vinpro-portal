import React, { useEffect, useState } from "react";
import {
  Create,
  useDrawerForm,
  useSelect,
} from "@refinedev/antd";
import {
  Form,
  Input,
  Drawer,
  Select,
  message,
  Upload,
  
} from "antd";
import FormIconInput from "@components/Inputs/FormIconInput";
import {
  getValueProps,
  MediaConfig,
  mediaUploadMapper,
  useDirectusUpload,
} from "@tspvivek/refine-directus";
import { directusClient } from "src/directusClient";
import { useTranslate,useApiUrl } from "@refinedev/core";

type CreateDrawerProps = {
  callback: (status: string) => void;
  visible: boolean;
};

const DriverCreate: React.FC<CreateDrawerProps> = ({ callback, visible }) => {
  const { TextArea } = Input;
  const [formdata, setFormData] = useState<any>({});
  const t = useTranslate();
  const mediaConfigList: MediaConfig[] = [
    { name: "image", multiple: false, maxCount: 1 },
  ];
  const getUploadProps = useDirectusUpload(mediaConfigList, directusClient);
   const apiUrl = useApiUrl();
  // Create Drawer
  const { drawerProps, formProps, saveButtonProps, show, close } =
    useDrawerForm({
      mutationMode: "pessimistic",
      onMutationSuccess: (data) => {
        formProps.form.resetFields();
        callback("success");
      },
      action: "create",
      resource: "team_members",
      redirect: false,
      successNotification: (data) => {
        return {
          message: t("successfullycreated"),
          description: t("successfull"),
          type: "success",
        };
      },
      errorNotification: (data) => {
        return {
          message: t("emailalert"),
          description: t("error"),
          type: "error",
        };
      },
    });

  useEffect(() => {
    if (visible) {
      show();
    } else {
      close();
    }
  }, [visible]);

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
    var obj = {};
    
    return {
      ...obj,
      ...params,
    };
  };
   
  return (
    <Drawer
      {...drawerProps}
      onClose={() => {
        callback("close");
      }}
      width={400}
    >
      <Create saveButtonProps={saveButtonProps} goBack
        headerProps={{ extra: false, title: t("create"), className: "drawer-body" }}
      >
        <Form
          {...formProps}
          layout="vertical"
          onFinish={(values) => {
            return (
              formProps.onFinish && formProps.onFinish(defaultMapper(values))
            );
          }}
          onValuesChange={(changedValues, allValues) => {
            setFormData(allValues);
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
                //       options={[
                //       { label:"Manager",value:"Manager"},
                //       { label:"HR",value:"HR"},
                //       { label:"TeamLead",value:"Team Lead"},
                //       ]}
                //     />
                // }
                icon={"UserSwitchOutlined"}
            />
          <FormIconInput
           label={t("firstname")}
            name={"first_name"}
            rules={[{ required: true, message: t("firstnameisrequired") }]}
            children={<Input />}
            icon={"UserOutlined"}
          />

            <FormIconInput
            label={t("lastname")}
            name={"last_name"}
            rules={[{ required: true, message: t("lastnameisrequired") }]}
            children={<Input />}
            icon={"UserOutlined"}
          />

         {/* <FormIconInput
            label={t("city")}
            name={"drivercity"}
            rules={[{ required: true, message: t("choosecity") }]}
            children={<Select {...cityProps} />}
            icon={"GlobalOutlined"}
          /> */}
       
          <FormIconInput
                 label={t("email")}
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
                    required: true, message: t("enterimage")
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
       
     
           </Form>
      </Create>
    </Drawer>
  );
};

export default DriverCreate;
