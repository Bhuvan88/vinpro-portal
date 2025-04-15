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

const CtcCreate: React.FC<CreateDrawerProps> = ({ callback, visible }) => {
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

  const { selectProps: regimeProps } = useSelect({
    resource: "ctc_regime",
    optionLabel: "title",
    optionValue: "id",
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
      resource: "ctc",
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
            label="Country"
            name={"country"}
            rules={[{ required: true, message: "please select your country" }]}
            children={<Select {...countryProps} />}
            icon={"global"}
          />
          <FormIconInput
            label="Regime"
            name={"regime"}
            rules={[{ required: true, message: "please select your regime" }]}
            children={<Select {...regimeProps} />}
            icon={"global"}
          />

         <FormIconInput
            label="Basic pay"
            name={"basic"}
            rules={[{ required: false, message: "please enter basic pay" }]}
            children={<Input placeholder="Enter basic pay % only" />}
            icon={"global"}
          />

          <Divider orientation="left">Earnings</Divider>
          <Form.List name="earnings">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "key"]}
                        rules={[{ required: true, message: "Missing lable" }]}
                        style={{ width: "60%" }}
                      >
                        <Input placeholder="Enter ctc name" />
                      </Form.Item>

                      {/* Wrapping last name input and minus button in a flex container */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "value"]}
                          rules={[{ required: true, message: "Missing lable" }]}
                          style={{ width: "40%" }} // Makes input take full width
                        >
                          <InputNumber placeholder="% only" />
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

          <Divider orientation="left">Deductions</Divider>
          <Form.List name="deductions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "key"]}
                        rules={[{ required: true, message: "Missing lable" }]}
                        style={{ width: "60%" }}
                      >
                        <Input placeholder="Enter ctc name" />
                      </Form.Item>

                      {/* Wrapping last name input and minus button in a flex container */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "value"]}
                          rules={[{ required: true, message: "Missing lable" }]}
                          style={{ width: "40%" }} // Makes input take full width
                        >
                          <InputNumber placeholder="% only" />
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

          <FormIconInput
            label="Professional Tax"
            name={"professionaltax"}
            rules={[{ required: false, message: "please select your country" }]}
            children={<Input placeholder="Enter tax amount per/Month" />}
            icon={"global"}
          />
          <FormIconInput
            label="Management Fee"
            name={"managementfee"}
            rules={[{ required: false, message: "please select your regime" }]}
            children={
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Enter fee % only"
              />
            }
            icon={"global"}
          />
        </Form>
      </Create>
    </Drawer>
  );
};

export default CtcCreate;
