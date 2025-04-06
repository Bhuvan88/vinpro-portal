import React, { useEffect, useState } from "react";
import { useApiUrl, useTranslate } from "@refinedev/core";
import { Create, useDrawerForm, useSelect } from "@refinedev/antd";
import {
  Form,
  Input,
  Drawer,
  InputNumber,
  Divider,
  Select,
  Card,
  Button,
  Space,
} from "antd";
import FormIconInput from "@components/Inputs/FormIconInput";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
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

const RegimeCreate: React.FC<CreateDrawerProps> = ({ callback, visible }) => {
  const { TextArea } = Input;
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const [formdata, setFormData] = useState<any>({});

  const mediaConfigList: MediaConfig[] = [
    { name: "image", multiple: false, maxCount: 1 },
  ];
  const getUploadProps = useDirectusUpload(mediaConfigList, directusClient);

  const { selectProps: countryProps } = useSelect({
    resource: "countries",
    optionLabel: "name",
    optionValue: "id",
    sorters: [
      {
        field: "name",
        order: "asc",
      },
    ],

    pagination: {
      pageSize: -1,
    },
  });


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

  // Create Drawer
  const { drawerProps, formProps, saveButtonProps, show, close } =
    useDrawerForm({
      mutationMode: "pessimistic",
      onMutationSuccess: (data) => {
        formProps.form.resetFields();
        callback("success");
      },
      action: "create",
      resource: "ctc_regime",
      redirect: false,
      successNotification: (data) => {
        return {
          message: "Successfully Created",
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

  return (
    <Drawer
      {...drawerProps}
      onClose={() => {
        callback("close");
      }}
      width={480}
    >
      <Create
        saveButtonProps={saveButtonProps}
        goBack
        headerProps={{
          extra: false,
          title: "Create",
          className: "drawer-body",
        }}
      >
        <Form
          {...formProps}
          layout="vertical"
          onFinish={(values) => {
            formProps.onFinish && formProps.onFinish(defaultMapper(values));
          }}
          onValuesChange={(changedValues, allValues) => {
            setFormData(allValues);
          }}
        >
          <FormIconInput
            label="Regime Title"
            name={"title"}
            rules={[{ required: true, message: "please enter title" }]}
            children={<Input placeholder="Enter regime title" />}
            icon={"global"}
          />

          <FormIconInput
            label="Country"
            name={"country"}
            rules={[{ required: true, message: "please select your country" }]}
            children={<Select {...countryProps} />}
            icon={"global"}
          />

          <Divider orientation="left">Slab</Divider>
          <Form.List name="slab">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} style={{ marginBottom: 10, borderBottom:'1px solid #ccc' }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "slab"]}
                        rules={[{ required: true, message: "Missing slab" }]}
                        style={{width: "90%"}}
                      >
                        <Input placeholder="Enter slab name" />
                      </Form.Item>
                      {/* Minus Button aligned to the right */}
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        style={{
                          marginTop: -20,
                          marginLeft: 10,
                          fontSize: 16,
                          cursor: "pointer",
                          color: "red",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "from"]}
                        rules={[{ required: false, message: "Missing lable" }]}
                      >
                        <Input placeholder="Value From" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, "to"]}
                        rules={[{ required: false, message: "Missing lable" }]}
                      >
                        <Input placeholder="Value to" />
                      </Form.Item>

                      {/* Wrapping last name input and minus button in a flex container */}

                      <Form.Item
                        {...restField}
                        name={[name, "rate"]}
                        rules={[{ required: true, message: "Missing lable" }]}
                      >
                        <InputNumber placeholder="Amount" />
                      </Form.Item>
                    </div>
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
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

export default RegimeCreate;
