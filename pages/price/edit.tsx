import React, { useEffect, useState } from "react";
import { useApiUrl, useTranslate } from "@refinedev/core";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Divider, InputNumber, Button } from "antd";
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
const CuisineEdit: React.FC<EditProps> = ({ callback, id }) => {
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
    resource: "price_list",
    metaData: {
      fields: [
        "title",
        "pricetitle",
        "price",
        "details",
		  "buttontext",
		  "buttonlink",
        "date_created",
        "date_updated",
      ],
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

  useEffect(() => {
    if (record) {
      console.log(JSON.parse(record.details)); // Parse record.details

      form.setFieldsValue({
        title: record.title,
        details: JSON.parse(record.details), // Ensure details is an array
      });
    }
  }, [record, form]); // Runs when `record`

  return (
    <Edit
      saveButtonProps={saveButtonProps}
      // actionButtons={
      // 	<Form {...formProps}>
      // 		<Form.Item className="drawer-flex-footer">
      // 			<Button type="primary" htmlType="submit" icon={<FileDoneOutlined/>} >
      // 				Save
      // 			</Button>
      // 		</Form.Item>
      // 	</Form>}
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
          label="Name"
          name={"title"}
          rules={[{ required: true, message: "please enter the title" }]}
          children={<Input />}
          icon={"global"}
        />

        <FormIconInput
          label="Title"
          name={"pricetitle"}
          rules={[{ required: false, message: "please enter the title" }]}
          children={<Input />}
          icon={"global"}
        />

        <FormIconInput
          label="Price"
          name={"price"}
          rules={[{ required: false, message: "please enter the title" }]}
          children={
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter only price"
            />
          }
          icon={"global"}
        />
        <Divider orientation="left">Description</Divider>
        {/* Editable Form.List */}
        <Form.List name="details">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Form.Item
                      {...restField}
                      name={name}
                      rules={[{ required: true, message: "Missing value" }]}
                      style={{ flex: 1 }}
                    >
                      <Input placeholder="Value" />
                    </Form.Item>
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      style={{
                        marginLeft: 10,
                        fontSize: 16,
                        marginTop: -25,
                        cursor: "pointer",
                      }}
                    />
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
            label="Button Text"
            name={"buttontext"}
            rules={[{ required: true, message: "Please enter the button title" }]}
            children={<Input />}
            icon={"global"}
          />

          <FormIconInput
            label="Button Link"
            name={"buttonlink"}
            rules={[{ required: false, message: "please enter the title" }]}
            children={
              <Input />
            }
            icon={"global"}
          />
      </Form>
    </Edit>
  );
};

export default CuisineEdit;
