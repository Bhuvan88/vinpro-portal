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
  Flex,
  Typography,
  Card,
  Button,
  Space
} from "antd";
import FormIconInput from "@components/Inputs/FormIconInput";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  getValueProps,
  MediaConfig,
  mediaUploadMapper,
  useDirectusUpload,
} from "@tspvivek/refine-directus";
import { directusClient } from "src/directusClient";

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
      resource: "price_list",
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
            label="Title"
            name={"title"}
            rules={[{ required: true, message:"please enter the title"}]}
            children={<Input />}
            icon={"global"}
          />
           <Form.List name="details">
  {(fields, { add, remove }) => (
    <>
      {fields.map(({ key, name, ...restField }) => (
        <div key={key}>
          <Form.Item
            {...restField}
            name={[name, 'key']}
            rules={[{ required: true, message: 'Missing lable' }]}
          >
            <Input placeholder="Label" />
          </Form.Item>
          
          {/* Wrapping last name input and minus button in a flex container */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Form.Item
              {...restField}
              name={[name, 'value']}
              rules={[{ required: true, message: 'Missing lable' }]}
              style={{ flex: 1 }} // Makes input take full width
            >
              <Input placeholder="Value" />
            </Form.Item>

            {/* Minus Button aligned to the right */}
            <MinusCircleOutlined 
              onClick={() => remove(name)} 
              style={{ marginLeft: 10, fontSize: 16, cursor: 'pointer' }} 
            />
          </div>
        </div>
      ))}
      <Form.Item>
        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
          Add field
        </Button>
      </Form.Item>
    </>
  )}
           </Form.List>

        </Form>
      </Create>
    </Drawer>
  );
};

export default CuisineCreate;
