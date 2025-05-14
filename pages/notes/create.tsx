import React, { useEffect, useState } from "react";
import { useApiUrl, useTranslate } from "@refinedev/core";
import { Create, useDrawerForm, useSelect } from "@refinedev/antd";
import { Form, Input, Drawer, Select } from "antd";

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

const NotesCreate: React.FC<CreateDrawerProps> = ({ callback, visible }) => {
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
      resource: "eor_notes",
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
            label="Notes"
            name={"notes"}
            rules={[{ required: true, message: "Enter Notes" }]}
            children={<TextArea rows={5} placeholder="" />}
            icon={"global"}
          />

          <FormIconInput
            label="Country"
            name={"country"}
            rules={[{ required: true, message: "please select your country" }]}
            children={<Select {...countryProps} />}
            icon={"global"}
          />

          <FormIconInput
            label="Order no"
            name={"sort"}
            rules={[{ required: false, message: "Enter Notes" }]}
            children={<Input placeholder="" />}
            icon={"global"}
          />
        </Form>
      </Create>
    </Drawer>
  );
};

export default NotesCreate;
