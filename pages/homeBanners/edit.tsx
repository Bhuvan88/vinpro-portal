import React, { useEffect, useState } from "react";
import { useApiUrl, useTranslate,CrudFilters } from "@refinedev/core";
import {
  Edit,
  useForm,
  useSelect,
} from "@refinedev/antd";
import {
  Form,
  Input,
  Select,
  Switch,
  Upload,
  Row,
  Col,
  Card,
  Divider,
  Button,
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
import {FileDoneOutlined} from '@ant-design/icons';

export const getServerSideProps = commonServerSideProps;
 
type EditProps = {
  callback: (status: string) => void;
  id: string;
};
const BannerEdit: React.FC<EditProps> = ({ callback, id }) => {
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
    action: "edit",
    id:id,
    resource: "home_banners",
    metaData: {
      fields: ["image.*","title","button1_text","button1_link","button2_text","button2_link","isactive","description"],
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
//    { "create": [
//       {
//           "banners_id": "1",
//           "city_id": {
//               "id": 1
//           }
//       },
//       {
//           "banners_id": "1",
//           "city_id": {
//               "id": 2
//           }
//       }
//   ],
//   "update": [],
//   "delete": []
// }

    
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
      //deleteButtonProps={deleteButtonProps}
      // actionButtons={
			// 	<Form {...formProps}>
			// 		<Form.Item className="drawer-flex-footer">
			// 			<Button type="primary" htmlType="submit" icon={<FileDoneOutlined />}>
      //       Save
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
        initialValues={
          {
            ...record,      
          }
        }
      >
       
      

        <FormIconInput
          label="Title"
          name={"title"}
          rules={[{ required: true, message:"Enter Title" }]}
          children={<Input />}
          icon={"ShopOutlined"}
        />
         <FormIconInput
            label="Description"
            name={"description"}
            rules={[{ required: false, message: "Enter Description" }]}
            children={<TextArea />}
            icon={"InfoCircleOutlined"}
          />

        <FormIconInput
          label={t("isactive")}
          name={"isactive"}
          children={<Switch defaultChecked={record?.isactive} checkedChildren="Yes" unCheckedChildren="No" />}
          icon={"CheckCircleOutlined"}
        />

        {/* <FormIconInput
          label="Is commercial"
          name={"iscommercial"}
          children={<Switch defaultChecked={record?.iscommercial}  checkedChildren="Yes" unCheckedChildren="No" />}
          icon={"DollarOutlined"}
        /> */}

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
                  required:true,message: t("enterimage")
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
           <Row gutter={16}>
            <Col span={12}>
              <FormIconInput
                label="Button1 Text"
                name="button1_text"
                rules={[{ required: true, message: "Enter Button1 Text" }]}
                children={<Input />}
                icon={"ShopOutlined"}
              />
            </Col>
            <Col span={12}>
              <FormIconInput
                label="Button1 Link"
                name="button1_link"
                rules={[{ required: true, message: "Enter Button1 Link" }]}
                children={<Input />}
                icon={"LinkOutlined"}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormIconInput
                label="Button2 Text"
                name="button2_text"
                rules={[{ required: true, message: "Enter Button2 Text" }]}
                children={<Input />}
                icon={"ShopOutlined"}
              />
            </Col>
            <Col span={12}>
              <FormIconInput
                label="Button2 Link"
                name="button2_link"
                rules={[{ required: true, message: "Enter Button2 Link" }]}
                children={<Input />}
                icon={"LinkOutlined"}
              />
            </Col>
          </Row>
      </Form>
    </Edit>
  );
};

export default BannerEdit;
