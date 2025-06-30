import React, { useEffect, useState } from "react";
import { useApiUrl, useTranslate, CrudFilters } from "@refinedev/core";
import { Create, useSelect, useDrawerForm } from "@refinedev/antd";
import { Form, Input, Drawer, Upload, Select, Switch, Row, Col } from "antd";
import FormIconInput from "@components/Inputs/FormIconInput";
import { ICategory } from "src/interfaces";
import {
  getValueProps,
  MediaConfig,
  mediaUploadMapper,
  useDirectusUpload,
} from "@tspvivek/refine-directus";
import { directusClient } from "src/directusClient";
import { CustomIcon } from "@components/datacomponents/CustomIcon";

type CreateDrawerProps = {
  callback: (status: string) => void;
  visible: boolean;
};

const BannerCreate: React.FC<CreateDrawerProps> = ({ callback, visible }) => {
  const { TextArea } = Input;
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const [formdata, setFormData] = useState<any>({});

  const mediaConfigList: MediaConfig[] = [
    { name: "image", multiple: false, maxCount: 1 },
  ];
  const getUploadProps = useDirectusUpload(mediaConfigList, directusClient);

  // Create Drawer
  const { drawerProps, formProps, saveButtonProps, show, close } =
    useDrawerForm({
      mutationMode: "pessimistic",
      onMutationSuccess: (data) => {
        formProps.form.resetFields();
        callback("success");
      },
      action: "create",
      resource: "home_banners",
      redirect: false,
      successNotification: (data) => {
        return {
          message: t("successfullycreated"),
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

  // const { selectProps: cityProps } = useSelect({
  //   resource: "city",
  //   optionLabel: "name",
  //   optionValue: "id",
  //   sorters: [
  //     {
  //       field: "name",
  //       order: "asc",
  //     },
  //   ],
  //   filters: [
  //     {
  //         field: "name",
  //         operator:  "ne",
  //         value:"Namakkal"
  //     },
  //   ],
  //   pagination:{
  //     pageSize:-1
  //   }
  // });

  const defaultMapper = (params: any) => {
    mediaUploadMapper(params, mediaConfigList);
    //   [
    //     {
    //         "banners_id": "+",
    //         "city_id": {
    //             "id": 1
    //         }
    //     },
    //     {
    //         "banners_id": "+",
    //         "city_id": {
    //             "id": 2
    //         }
    //     }
    // ]

    return {
      ...params,
    };
  };

  return (
    <Drawer
      {...drawerProps}
      onClose={() => {
        callback("close");
      }}
      width={450}
    >
      <Create
        saveButtonProps={saveButtonProps}
        goBack
        headerProps={{
          extra: false,
          title: t("create"),
          className: "drawer-body",
        }}
      >
        {" "}
        {/* actionbutton={false} */}
        <Form
          {...formProps}
          layout="vertical"
          onFinish={(values) => {
            return (
              formProps.onFinish && formProps.onFinish(defaultMapper(values))
            );
          }}
          onValuesChange={(changedValues, allValues) => {
            setFormData(allValues);
          }}
          initialValues={{
            isactive: true,
          }}
        >
          <FormIconInput
            label="Title"
            name="title"
            rules={[{ required: true, message: "Enter Client Name" }]}
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

          {/* <FormIconInput
            label={t("city")}
            name={"city"}
            rules={[{ required: true, message: t("choosecity") }]}
            children={<Select {...cityProps} style={{ width: "100%" }} mode="multiple" />}
            icon={"GlobalOutlined"}
          /> */}

          <FormIconInput
            label={t("isactive")}
            name={"isactive"}
            children={
              <Switch
                checkedChildren="Yes"
                unCheckedChildren="No"
                defaultChecked={true}
                disabled
              />
            }
            icon={"CheckCircleOutlined"}
          />

          {/* <FormIconInput
            label="Is commercial"
            name={"iscommercial"}
            children={<Switch checkedChildren="Yes" unCheckedChildren="No" />}
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
                    required: false,
                    message: t("enterimage"),
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
      </Create>
    </Drawer>
  );
};

export default BannerCreate;
