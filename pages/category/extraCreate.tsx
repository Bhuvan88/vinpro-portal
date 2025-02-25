import React, { useEffect, useState } from "react";
import { useApiUrl, useTranslate, CrudFilters, useOne, useList } from "@refinedev/core";

import {
  Create,
  useDrawerForm,
  useSelect,
} from "@refinedev/antd";
import {
  Form,
  Input,
  Drawer,
  Upload,
  Switch,
  Select,
  Button,
  InputNumber,
} from "antd";
import FormIconInput from "@components/Inputs/FormIconInput";
import {
  getValueProps,
  MediaConfig,
  mediaUploadMapper,
  useDirectusUpload,
} from "@tspvivek/refine-directus";
import { directusClient } from "src/directusClient";
import { useTeam } from "src/teamProvider";
import { CustomIcon } from "@components/datacomponents/CustomIcon";
import { commonServerSideProps } from "src/commonServerSideProps";
import { useRouter } from "next/router";
import CreateExtra from "pages/extras/createExtra";

export const getServerSideProps = commonServerSideProps;

type CreateDrawerProps = {
  callback: (status: string) => void;
  visible: boolean;
  category: any;
  settingsId: any;
};

const CreateCategory: React.FC<CreateDrawerProps> = ({ callback, visible, category, settingsId }) => {
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const router = useRouter();
  const { identity } = useTeam();
  const [formdata, setFormData] = useState<any>({});
  const [showExtraDrawer, setShowExtraDrawer] = useState(false);
  const { query } = router;

  const mediaConfigList: MediaConfig[] = [
    { name: "image", multiple: false, maxCount: 1 },
  ];
  const getUploadProps = useDirectusUpload(mediaConfigList, directusClient);

  // Create Drawer
  const { drawerProps, formProps, saveButtonProps, show, close } =
    useDrawerForm({
      mutationMode: "pessimistic",
      onMutationSuccess: (data) => {
        callback("success");
      },
      action: "create",
      resource: "fooditemsextras",
      redirect: false,
      metaData: {
        fields: ["price", "fooditemsextras.name", "isactive"],
      },
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


  if (settingsId && settingsId.data.length == 0) {
    console.log("extraSettings", settingsId.data);
  }

  const defaultMapper = (params: any) => {
    mediaUploadMapper(params, mediaConfigList);
    params["fooditems"] = query?.id;
    params["extracategory"] = category;
    if (settingsId && settingsId.data.length == 0) {
      params["extracategory_settings"] = { category: category, fooditem: query?.id };
    } else {
      params["extracategory_settings"] = settingsId.data[0]?.id;
    }
    // params["extracategory_settings"]=category;

    // params["category"] = [{ category_id: { id: params["category"] } }];
    console.log("paramsfff", params);

    // obj["merchant"] = { id: identity?.merchant?.id };

    return {
      ...params,
    };
  };

  const { selectProps: extrasProps } =
    useSelect({
      resource: "extras",
      optionLabel: "name",
      optionValue: "id",
      onSearch: (params: any) => {
        const filters: CrudFilters = [];

        filters.push({
          operator: "or",
          value: [
            {
              field: "name",
              operator: "startswith",
              value: params?.charAt(0).toUpperCase() + params?.slice(1).toLowerCase(), //first letter to uppercase
            },
            {
              field: "name",
              operator: "startswith",
              value: params?.toLowerCase(),
            },
            {
              field: "name",
              operator: "startswith",
              value: params,
            }
          ]
        });
        return filters;
      },
      pagination:
      {
        pageSize: 20,
      },
      sorters: [
        {
          field: "name",
          order: "asc",
        },
      ],
    });
  //console.log("extrasProps", query?.id);



  //console.log('categoryData', categoryData);


  const createCallback = (status) => {
    if (status === "success") {
      setShowExtraDrawer(false);
    }
    if (status === "error") {
      setShowExtraDrawer(false);
    }
    if (status === "close") {
      setShowExtraDrawer(false);
    }
  };

  return (
    <Drawer
      {...drawerProps}
      onClose={() => {
        callback("close");
      }}
      width={400}
    >
      <Create
        saveButtonProps={saveButtonProps} goBack
        headerProps={{
          extra: false,
          title: t("createaddons"),
          className: "drawer-body",
        }}
      >
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
            isactive: true
          }}
        >
          <div className="flex-row">
            <div style={{ width: "90%" }}>
              <FormIconInput
                label={t("addonsname")}
                name={"extras"}
                rules={[{ required: true, message: t("enteraddonsname") }]}
                children={<Select allowClear {...extrasProps} />}
                icon={"DiffOutlined"}
              />
            </div>
            <div style={{ width: "9%", marginTop: 28 }}>
              <Button
                type="primary"
                onClick={() => setShowExtraDrawer(true)}
              >
                <CustomIcon type="PlusOutlined" />
              </Button>
            </div>
          </div>

          <FormIconInput
            label={t("price")}
            name={"price"}
            children={<InputNumber min={0} style={{ width: "100%" }} />}
            icon={"DiffOutlined"}
          />

          <FormIconInput
            label={t("isactive")}
            name={"isactive"}
            children={<Switch checkedChildren="Yes" unCheckedChildren="No" defaultChecked={true} disabled />}
            icon={"CheckCircleOutlined"}
          />
        </Form>

        {showExtraDrawer && (<CreateExtra callback={createCallback} visible={showExtraDrawer} />)}

      </Create>
    </Drawer>
  );
};

export default CreateCategory;
