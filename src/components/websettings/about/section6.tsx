import React, { useEffect, useState } from "react";
import { useApiUrl, useTranslate, useCustom } from "@refinedev/core";
import { Create, useDrawerForm, useSelect, useForm } from "@refinedev/antd";
import {
  Form,
  Input,
  Upload,
  Typography,
  Row,
  Col,
  Card,
  Divider,
  Button,
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
import { Editor } from "@tinymce/tinymce-react";
import { useRouter } from "next/router";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const Websettings: React.FC = () => {
  const { TextArea } = Input;
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const [formdata, setFormData] = useState<any>({});
  const [existingRecordId, setExistingRecordId] = useState<string | null>(null);
  const [Image1id, setImage1Id] = useState<string | null>(null);
  const [image2Id, setImage2Id] = useState<string | null>(null);
  const router = useRouter();
  const sectionTitle = router.query.section_title || "AboutSection6";
  const typeTitle = router.query.type || "webcontent";

  const mediaConfigList: MediaConfig[] = [
    { name: "image1", multiple: false, maxCount: 1 },
    { name: "image2", multiple: false, maxCount: 1 },
  ];

  const getUploadProps = useDirectusUpload(mediaConfigList, directusClient);
  // const getUploadProps2 = useDirectusUpload(mediaConfigList2, directusClient);

  // 🔍 Check if "Home page Section 3" already exists
  const { data: existingData, refetch } = useCustom({
    url: `${apiUrl}items/webcontent`,
    method: "get",
    config: {
      query: {
        // sort: [{ field: "id", direction: "desc" }],
        filter: { section_title: { _eq: sectionTitle } },
      },
    },
    meta: {
      fields: [
        "*",
        "id",
        "title",
        "subtitle",
        "description",
        "image1.*",
        "button_text",
        "button_link",
        "image2",
      ],
    },
    queryOptions: {
      enabled: true,
      onSuccess: (response) => {
        console.log("Existing Data:", response?.data);

        if (response?.data?.[0]) {
          const record = response?.data?.[0];
          setExistingRecordId(record.id);
         
        } else {
          setExistingRecordId(null);
        }
      },
    },
  });


 
useEffect(() => {
  if (existingData?.data?.[0]) {
    const data = existingData.data[0];

    // Reassign form fields
    formProps.form?.setFieldsValue({
      list_details: data.list_details ? JSON.parse(data.list_details) : [],
    });
  }
}, [existingData]);

  const { formProps, saveButtonProps, formLoading } = useForm({
    resource: "webcontent",
    action: existingRecordId ? "edit" : "create",
    id: existingRecordId || undefined,
    mutationMode: "pessimistic",
    redirect: false,
    onMutationSuccess: () => {
    //   formProps.form?.resetFields();
      refetch(); // Refetch to get the latest data
      // callback("success");
    },
    successNotification: () => ({
      message: existingRecordId
        ? "Successfully Updated"
        : "Successfully Created",
      description: t("successfull"),
      type: "success",
    }),
  });

  const defaultMapper = (params: any) => {
    mediaUploadMapper(params, mediaConfigList);

    params["section_title"] = sectionTitle;
    return { ...params };
  };

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={"About Section 6"}
        style={{
          marginBottom: 24,
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
        bodyStyle={{ padding: 24 }}
      >
        <img
          src="./images/about/section6.png"
          alt="Image 2"
          style={{ width: "70%", height: "400px" }}
        />

        <Create
          title={false}
          saveButtonProps={saveButtonProps}
          isLoading={formLoading}
          goBack={false}
        >
          <Form
            {...formProps}
            name="websettings"
            onFinish={(values) => {
              formProps.onFinish && formProps.onFinish(defaultMapper(values));
            }}
            layout="vertical"
            style={{ maxWidth: 800 }}
            onValuesChange={(changedValues, allValues) => {
              setFormData(allValues);
            }}
            initialValues={{
              list_details: existingData?.data[0]?.list_details
                ? JSON.parse(existingData.data[0].list_details)
                : [], // Initialize with existing data
            }}
          >
            <Divider orientation="left">List</Divider>
            <Col span={24}>
              <Form.List name="list_details">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key}>
                        <Row gutter={16} align="middle">
                          <Col span={6}>
                            <Form.Item
                              {...restField}
                              name={[name, "title"]}
                              rules={[
                                { required: true, message: "Missing Title" },
                              ]}
                            >
                              <Input placeholder="Title" />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item
                              {...restField}
                              name={[name, "subtitle"]}
                              rules={[
                                { required: true, message: "Missing Subtitle" },
                              ]}
                            >
                              {/* <Input placeholder="Subtitle" /> */}
                              <TextArea placeholder="Title" rows={2} />
                            </Form.Item>
                          </Col>
                          <Col span={10}>
                            <Form.Item
                              {...restField}
                              name={[name, "description"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Missing Description",
                                },
                              ]}
                            >
                              <TextArea rows={3} placeholder="Description" />
                            </Form.Item>
                          </Col>
                          <Col span={2}>
                            <MinusCircleOutlined
                              onClick={() => remove(name)}
                              style={{
                                fontSize: 16,
                                cursor: "pointer",
                                marginTop: 8,
                              }}
                            />
                          </Col>
                        </Row>
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
            </Col>
          </Form>
        </Create>
      </Card>
    </div>
  );
};

export default Websettings;
