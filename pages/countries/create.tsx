import React, { useEffect, useState } from "react";
import { useApiUrl, useTranslate } from "@refinedev/core";
import {
  Create,
  useDrawerForm,
} from "@refinedev/antd";
import {
  Form,
  Input,
  Drawer,
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
import { CustomIcon } from "@components/datacomponents/CustomIcon";

type CreateDrawerProps = {
  callback: (status: string) => void;
  visible: boolean;
}; 

const CuisineCreate: React.FC<CreateDrawerProps> = ({ callback, visible }) => {
  const { TextArea } = Input;
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const [formdata, setFormData] = useState<any>({});

  const mediaConfigList: MediaConfig[] = [
    { name: "image", multiple: false, maxCount: 1 },
  ];
  const getUploadProps = useDirectusUpload(mediaConfigList, directusClient);

  // Create Drawer
  const { drawerProps, formProps, saveButtonProps, show, close } =
    useDrawerForm({
      mutationMode: "pessimistic",
      onMutationSuccess: (data) => {
        formProps.form.resetFields();
        callback("success");
      },
      action: "create",
      resource: "countries",
      redirect: false,
      successNotification: (data) => {
        return {
          message:"Successfully Created",
          description: t("successfull"),
          type: "success",
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



  const defaultMapper = (params: any) => {
    mediaUploadMapper(params, mediaConfigList);

    return {
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
        headerProps={{ extra: false, title: "Create", className: "drawer-body" }} 
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
            label="Name"
            name={"name"}
            rules={[{ required: true, message: t("entercuisinename") }]}
            children={<Input />}
            icon={"global"}
          />
           <FormIconInput
                    label="Description"
                    name={"description"}
                    rules={[{ required: false, message: t("enteritemdescrption") }]}
                    children={<TextArea />}
                    icon={"DollarOutlined"}
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
        
        </Form>
      </Create>
    </Drawer>
  );
};

export default CuisineCreate;
