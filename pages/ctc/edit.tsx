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
const CtcEdit: React.FC<EditProps> = ({ callback, id }) => {
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
    resource: "ctc",
    metaData: {
      fields: ["*", "country.id", "country.name", "regime.id", "regime.title"],
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

  useEffect(() => {
    if (record) {
      //console.log(JSON.parse(record.details)); // Parse record.details

      form.setFieldsValue({
        country: record.country,
		  regime: record.regime,
        earnings: JSON.parse(record.earnings),
		  deductions: JSON.parse(record.deductions), // Ensure details is an array
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
            children={<InputNumber style={{width:'100%'}} placeholder="Enter fee % only" />}
            icon={"global"}
				
         />

      </Form>
    </Edit>
  );
};

export default CtcEdit;
