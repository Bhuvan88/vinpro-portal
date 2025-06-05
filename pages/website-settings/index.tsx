import React, { useEffect, useState } from "react";
import { useApiUrl, useTranslate, useCustom } from "@refinedev/core";
import { Create, useDrawerForm, useSelect } from "@refinedev/antd";
import { Form, Input, Upload, Typography } from "antd";
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


type CreateDrawerProps = {
  callback: (status: string) => void;
  visible: boolean;
};

const CountryCreate: React.FC<CreateDrawerProps> = ({ callback, visible }) => {
  const { TextArea } = Input;
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const [formdata, setFormData] = useState<any>({});
  const [existingRecordId, setExistingRecordId] = useState<string | null>(null);

  const mediaConfigList: MediaConfig[] = [
    { name: "image", multiple: false, maxCount: 1 },
  ];
  const getUploadProps = useDirectusUpload(mediaConfigList, directusClient);

  // 🔍 Check if "Home page Section 3" already exists
  const { data: existingData, refetch } = useCustom({
    url: `${apiUrl}items/webcontent`,
    method: "get",
    config: {
      params: {
        filter: { section_title: { _eq: "Home page Section 3" } },
        limit: 1,
      },
    },
    queryOptions: {
      enabled: visible,
      onSuccess: (response) => {
        console.log("Existing Data:", response?.data);
        
        if (response?.data?.[0]) {
           const record = response?.data?.[0];
          setExistingRecordId(record.id);
          setTimeout(() => {
          formProps.form?.setFieldsValue({
            title: record.title,
            subtitle: record.subtitle,
            description: record.description,
            image: record.image, // ensure this format matches Upload component
          });
    }, 0);
        } else {
          setExistingRecordId(null);
        }
      },
    },
  });

  const { drawerProps, formProps, saveButtonProps, show, close, formLoading } =
    useDrawerForm({
      action: existingRecordId ? "edit" : "create",
      resource: "webcontent",
      id: existingRecordId || undefined,
      mutationMode: "pessimistic",
      redirect: false,
      onMutationSuccess: () => {
       // formProps.form?.resetFields();
       // callback("success");
      },
      successNotification: () => ({
        message: existingRecordId ? "Successfully Updated" : "Successfully Created",
        description: t("successfull"),
        type: "success",
      }),
    });

  useEffect(() => {
    if (visible) {
      refetch(); // Always fetch when opened
      show();
    } else {
      close();
    }
  }, [visible]);

  const defaultMapper = (params: any) => {
    mediaUploadMapper(params, mediaConfigList);
    params["section_title"] = "Home page Section 3";
    return { ...params };
  };

  return (
    <div>
     

      <div style={{ alignItems: "center", margin: 20 }}>
        <Create
          saveButtonProps={saveButtonProps}
          goBack
          headerProps={{
            extra: false,
            title:  "Home page Section 3",
            className: "drawer-body",
          }}
        >
          <Form
            {...formProps}
            layout="vertical"
            onFinish={(values) =>
              formProps.onFinish && formProps.onFinish(defaultMapper(values))
            }
            onValuesChange={(changedValues, allValues) =>
              setFormData(allValues)
            }
            // initialValues={{
            //   title: formdata.title || "",
            //   subtitle: formdata.subtitle || "",
            //   description: formdata.description || "",
            //   image: formdata.image || [],
            // }}
          >
            <FormIconInput
              label="Title"
              name="title"
              rules={[{ required: true, message: "Enter Title" }]}
              children={<Input />}
              icon="FileTextOutlined"
            />
            <FormIconInput
              label="Subtitle"
              name="subtitle"
              rules={[{ required: false, message: "Enter Subtitle" }]}
              children={<Input />}
              icon="FileTextOutlined"
            />
            <FormIconInput
  label="Description"
  name="description"
  children={
    <Editor
      apiKey="iyoxbsi6qt2fnv3umd4zbs52tca0yupfw2h2o6g3n16mx9hv" // Optional, free key at https://www.tiny.cloud/
      init={{
        height: 300,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste help wordcount'
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | help'
      }}
      onEditorChange={(value) =>
        formProps.form?.setFieldsValue({ description: value })
      }
      value={formProps.form?.getFieldValue("description")}
    />
  }
  icon="EditOutlined"
/>

            {/* <FormIconInput
              label="Description"
              name="description"
              children={<TextArea />}
              icon="DollarOutlined"
            /> */}

            <div className="icon-input-field">
              <CustomIcon
                type="PictureOutlined"
                styleProps={{ style: { fontSize: 20, marginTop: 15 } }}
              />
              <Form.Item label={t("image")}>
                <Form.Item
                  name="image"
                  valuePropName="fileList"
                  getValueProps={(data) =>
                    getValueProps({ data, imageUrl: apiUrl })
                  }
                  
                  noStyle
                  rules={[{ required: true, message: "Image is required" }]}
                >
                  <Upload.Dragger
                    name="file"
                    listType="picture"
                    multiple={false}
                    beforeUpload={() => false}
                    {...getUploadProps("image")}
                  >
                    <p className="ant-upload-text">
                      {t("drag&dropafileinthisarea")}
                    </p>
                  </Upload.Dragger>
                </Form.Item>
              </Form.Item>
            </div>
          </Form>
        </Create>
      </div>
    </div>
  );
};

export default CountryCreate;
