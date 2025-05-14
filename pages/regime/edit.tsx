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
const RegimeEdit: React.FC<EditProps> = ({ callback, id }) => {
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
    resource: "ctc_regime",
    metaData: {
      fields: ["*", "country.id", "country.name"],
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
  //console.log('record', record);

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

  useEffect(() => {
    if (record) {
      //console.log(JSON.parse(record.details)); // Parse record.details

      form.setFieldsValue({
        country: record.country?.id,
        slab: JSON.parse(record.slab),
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
                <div
                  key={key}
                  style={{ marginBottom: 10, borderBottom: "1px solid #ccc" }}
                >
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
                      style={{ width: "90%" }}
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
    </Edit>
  );
};

export default RegimeEdit;
