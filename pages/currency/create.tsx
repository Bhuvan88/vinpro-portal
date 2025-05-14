import React, { useEffect, useState } from "react";
import { useApiUrl, useTranslate } from "@refinedev/core";
import { Create, useDrawerForm, useSelect } from "@refinedev/antd";
import {
  Form,
  Input,
  Drawer,
  InputNumber
} from "antd";

import FormIconInput from "@components/Inputs/FormIconInput";
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

const CurrencyCreate: React.FC<CreateDrawerProps> = ({ callback, visible }) => {
  const { TextArea } = Input;
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const [formdata, setFormData] = useState<any>({});

  const mediaConfigList: MediaConfig[] = [
    { name: "image", multiple: false, maxCount: 1 },
  ];
  const getUploadProps = useDirectusUpload(mediaConfigList, directusClient);

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
      resource: "currency",
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
            label="Currency"
            name={"name"}
            rules={[{ required: true, message: "Enter Currency code" }]}
            children={<Input placeholder="eg. INR" />}
            icon={"global"}
          />

          <FormIconInput
            label="Exchange Rate"
            name={"rate"}
            rules={[{ required: true, message: "Enter exchange rate" }]}
            children={
              <InputNumber style={{ width: "100%" }} placeholder="Enter rate" />
            }
            icon={"global"}
          />
        </Form>
      </Create>
    </Drawer>
  );
};

export default CurrencyCreate;
