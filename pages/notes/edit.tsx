import React, { useEffect, useState } from "react";
import { useApiUrl, useTranslate } from "@refinedev/core";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Divider, InputNumber, Button, Select } from "antd";
import { commonServerSideProps } from "src/commonServerSideProps";
import FormIconInput from "@components/Inputs/FormIconInput";
import {
  getValueProps,
  MediaConfig,
  mediaUploadMapper,
  useDirectusUpload,
} from "@tspvivek/refine-directus";
import { directusClient } from "src/directusClient";
import { CustomIcon } from "@components/datacomponents/CustomIcon";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

export const getServerSideProps = commonServerSideProps;

type EditProps = {
  callback: (status: string) => void;
  id: string;
};
const NotesEdit: React.FC<EditProps> = ({ callback, id }) => {
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const { TextArea } = Input;
  const mediaConfigList: MediaConfig[] = [
    { name: "image", multiple: false, maxCount: 1 },
  ];
  const getUploadProps = useDirectusUpload(mediaConfigList, directusClient);
  const [formdata, setFormData] = useState<any>({});

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
    id: id,
    action: "edit",
    resource: "eor_notes",
    metaData: {
      fields: ["*"],
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
    </Edit>
  );
};

export default NotesEdit;
