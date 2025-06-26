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

type CreateDrawerProps = {
  callback: (status: string) => void;
  visible: boolean;
};

const Websettings: React.FC<CreateDrawerProps> = ({ callback, visible }) => {
  const { TextArea } = Input;
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const [formdata, setFormData] = useState<any>({});
  const [existingRecordId, setExistingRecordId] = useState<string | null>(null);
  const [Image1id, setImage1Id] = useState<string | null>(null);
  const [image2Id, setImage2Id] = useState<string | null>(null);
  const router = useRouter();
  const sectionTitle = router.query.section_title || "StaffingSection4";
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
      enabled: visible,
      onSuccess: (response) => {
        console.log("Existing Data:", response?.data);

        if (response?.data?.[0]) {
          const record = response?.data?.[0];
          setExistingRecordId(record.id);
          setImage1Id(record.image1 || null); // Set Image1 ID if available
          setImage2Id(record.image2 || null); // Set Image2 ID if available
        } else {
          setExistingRecordId(null);
        }
      },
    },
  });

  const { data: fileInfo } = useCustom({
    url: Image1id ? `${apiUrl}files/${Image1id}` : "",
    method: "get",
    queryOptions: {
      enabled: !!Image1id, // Only fetch if Image1id is set
    },
  });
  const { data: fileInfo2 } = useCustom({
    url: image2Id ? `${apiUrl}files/${image2Id}` : "",
    method: "get",
    queryOptions: {
      enabled: !!image2Id,
    },
  });

  const mapToFileList = (fileData) => {
    if (!fileData) return [];

    return [
      {
        uid: fileData.id,
        name: fileData.filename_download,
        status: "done",
        url: `${apiUrl}assets/${fileData.id}`, // this is the image URL from Directus
      },
    ];
  };

  useEffect(() => {
    if (fileInfo?.data) {
      formProps.form?.setFieldsValue({
        image1: mapToFileList(fileInfo.data), // 👈 this sets the value of "image1" field
      });
    }
  }, [fileInfo]);
  useEffect(() => {
    if (fileInfo2?.data) {
      formProps.form?.setFieldsValue({
        image2: mapToFileList(fileInfo2.data), // 👈 this sets the value of "image2" field
      });
    }
  }, [fileInfo2]);

  const { formProps, saveButtonProps, formLoading } = useForm({
    resource: "webcontent",
    action: existingRecordId ? "edit" : "create",
    id: existingRecordId || undefined,
    mutationMode: "pessimistic",
    redirect: false,
    onMutationSuccess: () => {
      formProps.form?.resetFields();
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
    if (params.description && typeof params.description !== "string") {
      // Get the inner HTML if it's coming as an event-like object
      try {
        params.description = params.description.target?.getContent?.() || "";
      } catch (e) {
        console.warn("Failed to parse description:", e);
        params.description = "";
      }
    }
    if (Array.isArray(params.image1) && params.image1.length > 0) {
      params.image1 = params.image1[0]?.id || params.image1[0]; // fallback to ID if object
    }

    if (Array.isArray(params.image2) && params.image2.length > 0) {
      params.image2 = params.image2[0]?.id || params.image2[0];
    }
    if (Array.isArray(params.image2) && params.image2.length === 0) {
      params.image2 = null; // Set to null if no image is selected
    }
    if (Array.isArray(params.image1) && params.image1.length === 0) {
      params.image1 = null; // Set to null if no image is selected
    }
    params["section_title"] = sectionTitle;
    return { ...params };
  };

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={"Staffing Section 4"}
        style={{
          marginBottom: 24,
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
        bodyStyle={{ padding: 24 }}
      >
        <img
          src="./images/staffing/section4.png"
          alt="Image 2"
          style={{ width: "100%", height: "auto" }}
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
              section_title: "Home page Section 4",
              title: existingData?.data?.[0]?.title || "",
              subtitle: existingData?.data?.[0]?.subtitle || "",
              description: existingData?.data?.[0]?.description || "",
              image1: fileInfo ? [fileInfo.data] : [], // Ensure it's an array for Upload component
              list_details: existingData?.data[0]?.list_details
                ? JSON.parse(existingData.data[0].list_details)
                : [], // Initialize with existing data
            }}
          >
            <Row gutter={24}>
              <Col span={24}>
                <FormIconInput
                  label="Title"
                  name="title"
                  rules={[{ required: true, message: "Enter title" }]}
                  icon="FileTextOutlined"
                  children={<Input />}
                />

             
              </Col>
            </Row>
          
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
