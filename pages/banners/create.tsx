import React, { useEffect, useState } from "react";
import { useApiUrl, useTranslate,CrudFilters } from "@refinedev/core";
import {
  Create,
  useSelect,
  useDrawerForm,
} from "@refinedev/antd";
import { 
  Form,
  Input,
  Drawer,
  Upload,
  Select,
  Switch,
} from "antd";
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
      resource: "banners",
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

  const { selectProps: cityProps } = useSelect({
    resource: "city",
    optionLabel: "name",
    optionValue: "id",
    sorters: [
      {
        field: "name",
        order: "asc",
      },
    ],
    filters: [
      {
          field: "name",
          operator:  "ne",
          value:"Namakkal"
      },
    ],
    pagination:{
      pageSize:-1
    }
  });

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
    if(params["city"] && params["city"].length > 0){
      let cities = [];
      params["city"].map((item: any) => {   
        cities.push({
          "banners_id": "+",
          "city_id": {
              "id": item
          }
        }); 
      });
      params["city"] = {create:cities};
    }

    return {
      ...params,
    };
  };

  const { selectProps: merchantProps } = useSelect({
    resource: "merchant",
    optionLabel: "name",
    optionValue: "id",
    onSearch: (params: any) => {
      const filters: CrudFilters = [];

      filters.push({
        field: "search",
        operator: "contains",
        value: params,
      });
      return filters;
    },
    sorters: [
      {
        field: "name",
        order: "asc",
      },
    ],
  });

  return (
    <Drawer
      {...drawerProps}
      onClose={() => {
        callback("close");
      }}
      width={450}
    >
      <Create saveButtonProps={saveButtonProps} goBack
       headerProps={{ extra: false, title: t("create"), className: "drawer-body" }}
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
              isactive:true
          }}
        >
          <FormIconInput
            label={t("bannerlink")}
            name={"link"}
            rules={[{ required: true, message: t("enterlink") }]}
            children={<Input />}
            icon={"LinkOutlined"}
          />

          <FormIconInput
            label={t("city")}
            name={"city"}
            rules={[{ required: true, message: t("choosecity") }]}
            children={<Select {...cityProps} style={{ width: "100%" }} mode="multiple" />}
            icon={"GlobalOutlined"}
          />
         <FormIconInput
          label={t("shopname")}
          name={"merchant"}
          rules={[{ required: true, message: t("chooseshop") }]}
          children={<Select {...merchantProps} allowClear style={{ width: "100%" }} />}
          icon={"ShopOutlined"}
         />

          <FormIconInput
            label={t("isactive")}
            name={"isactive"}
            children={<Switch checkedChildren="Yes" unCheckedChildren="No" defaultChecked={true} disabled/>}
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
                    required: true, message: t("enterimage")
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
      </Create>
    </Drawer>
  );
};

export default BannerCreate;
