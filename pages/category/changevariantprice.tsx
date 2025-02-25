import React, { useEffect, useState } from "react";
import { useApiUrl, useCustom, useList, useTranslate } from "@refinedev/core";
import {
  Form,
  Input,
  Drawer,
  Grid,
  Button,
  Flex,
  Typography,
  Card,
  Empty,
  InputNumber,
} from "antd";
import { useTeam } from "src/teamProvider";
import { commonServerSideProps } from "src/commonServerSideProps";

export const getServerSideProps = commonServerSideProps;

interface categoryProps {
  id: string;
  name: string;
}

type CreateDrawerProps = {
  callback: (status: string) => void;
  visible: boolean;
  category: categoryProps;
};

const ChangeVariantPrice: React.FC<CreateDrawerProps> = ({
  callback,
  visible,
  category,
}) => {
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const { identity } = useTeam();
  const [formdata, setFormData] = useState(null);
  const [form] = Form.useForm();
  const breakpoint = Grid.useBreakpoint();
  const [loading, setLoading] = useState(false);

  // Create Drawer
  const { data, isLoading } = useList({
    resource: "variants",
    queryOptions: {
      cacheTime: 0,
      enabled: identity?.merchant?.id ? true : false,
    },
    meta: {
      fields: ["id", "name"],
    },
    filters: [
      {
        field: "merchant",
        operator: "eq",
        value: identity?.merchant?.id,
      },
      {
        field: "isactive",
        operator: "eq",
        value: true,
      },
    ],
    pagination:{
      pageSize:-1
    }
  });
  const variantList = data?.data;

  // console.log("formdata", formdata);

  const { refetch } = useCustom({
    url: `${apiUrl}merchant/updatepricebyvaraint`,
    method: "post",
    config: {
      payload: {
        ...formdata,
      },
    },
    queryOptions: {
      enabled: false,
      onSuccess: (data) => {
        //console.log("data **", data);
        setFormData(null);
        setLoading(false);
        callback("success");
      },
      onError: (error) => {
        console.log("error", error);
        setLoading(false);
      },
    },
    successNotification: {
      type: "success",
      message: t("variantspriceadded"),
    },
  });

  const handleFinish = (values) => {
    let variantTemp = values?.variants?.map((item) => {
      return { id: item?.id, price: item?.price ? item?.price : null };
    });
    let variantData = variantTemp?.filter((item) => item?.price != null);
    if (variantData?.length > 0) {
      setFormData({
        categoryid: category?.id,
        variants: variantData,
      });
    }
  };

  useEffect(() => {
    if (formdata?.categoryid && formdata?.variants?.length > 0) {
      setLoading(true);
      refetch();
    }
  }, [formdata]);

  return (
    <Drawer
      title={
        <span style={{ textTransform: "capitalize" }}>{category?.name}</span>
      }
      open={visible}
      onClose={() => {
        callback("close");
      }}
      width={!breakpoint?.xs && 400}
      loading={isLoading}
    >
      {variantList?.length > 0 ? (
        <Form
          layout="vertical"
          form={form}
          onFinish={handleFinish}
          initialValues={{
            variants: variantList,
          }}
        >
          <Form.List name="variants">
            {(fields) => (
              <Flex gap={15} vertical className="mb-20">
                {fields.map(({ key, name, ...restField }, index: any) => (
                  <Card
                    style={{ background: "#ffddc7" }}
                    size="small"
                    key={key}
                  >
                    <Flex
                      gap={10}
                      wrap
                      align="baseline"
                      justify="space-between"
                    >
                      <Typography.Text style={{ textTransform: "capitalize" }}>
                        {variantList[index]?.name}
                      </Typography.Text>
                      <Form.Item
                        style={{ width: 100 }}
                        className="mb-0"
                        {...restField}
                        name={[name, "price"]}
                      >
                        <InputNumber min={0} placeholder={t("price")} />
                      </Form.Item>
                    </Flex>
                  </Card>
                ))}
              </Flex>
            )}
          </Form.List>

          <Form.Item>
            <Button loading={loading} type="primary" htmlType="submit">
              {t("save")}
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Empty description={t("variantsnotavailable")} />
      )}
    </Drawer>
  );
};

export default ChangeVariantPrice;
