import React, { useEffect, useState } from "react";
import { useApiUrl, useTranslate } from "@refinedev/core";
import {
  Edit,
  useForm,
} from "@refinedev/antd";
import {
  Form,
  Input,
  Upload,
} from "antd";
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
    id:id,
    action: "edit",
    resource: "countries",
    metaData: {
      fields: ["name","image.*","description"]
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
          name={"name"}
          rules={[{ required: true, message: "Please enter name" }]}
          children={<Input />}
          icon={"UserOutlined"}
        />

<FormIconInput
                    label="Description"
                    name={"description"}
                    rules={[{ required: false, message: t("enteritemdescrption") }]}
                    children={<TextArea />}
                    icon={"DollarOutlined"}
                  />

           <div className="icon-input-field">
                            <CustomIcon
                              type={"PictureOutlined"}
                              styleProps={{ style: { fontSize: 20, marginTop: 15 } }}
                            />
                            <Form.Item label={t("image")}>
                              <Form.Item
                                name="image"
                                valuePropName="fileList"
                                getValueProps={(data) =>
                                  getValueProps({
                                    data,
                                    imageUrl: apiUrl,
                                  })
                                }
                                noStyle
                                rules={[
                                  {
                                    required:true,message:"Image is required"
                                  },
                                ]}
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
    </Edit>
  );
};

export default CuisineEdit;
