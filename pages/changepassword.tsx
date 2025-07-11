import { useForm } from "@refinedev/antd";
import { useApiUrl, useGetIdentity, useTranslate } from "@refinedev/core";
import { Form, Input, Button, Row, Col, Typography, Card, Upload } from "antd";

import { useEffect, useState } from "react";
import { useTeam } from "src/teamProvider";
import { commonServerSideProps } from "src/commonServerSideProps";
import {
  getValueProps,
  MediaConfig,
  mediaUploadMapper,
  useDirectusUpload,
} from "@tspvivek/refine-directus";
import { directusClient } from "src/directusClient";
import { PlusOutlined } from "@ant-design/icons";

export const getServerSideProps = commonServerSideProps;
const EditProfile: React.FC = () => {
  const t = useTranslate();
  const { setHeaderTitle, setSelectedMenu, selectedRole } = useTeam();
  const [isloading, setIsLoading] = useState(false);
  const apiUrl = useApiUrl();
  const mediaConfigList: MediaConfig[] = [
    { name: "avatar", multiple: false, maxCount: 1 },
  ];
  const getUploadProps = useDirectusUpload(mediaConfigList, directusClient);
  const { data: identity, refetch } = useGetIdentity({
    v3LegacyAuthProviderCompatible: true,
  });

  useEffect(() => {
    setSelectedMenu("/changepassword", "/changepassword");
    setHeaderTitle("Change Password");
  }, []);

  const { formProps, queryResult } = useForm({
    resource: "directus_users",
    id: identity?.id,
    action: "edit",
    redirect: false,
    successNotification: { message: "Successfully Updated", type: "success" },
    onMutationSuccess() {
      setIsLoading(false);
      refetch();
    },
    onMutationError() {
      setIsLoading(false);
    },
  });

  const { formProps: passwordFormProps, queryResult: passwordQueryResult } =
    useForm({
      resource: "directus_users",
      id: identity?.id,
      action: "edit",
      redirect: false,
      successNotification: {
        message: "Password Successfully Updated",
        type: "success",
      },
    });

  const { isLoading } = queryResult;

  const defaultMapper = (params: any) => {
    mediaUploadMapper(params, mediaConfigList);
    if (params?.avatar) {
      params["avatar"] = params?.avatar;
    } else {
      params["avatar"] = null;
    }
    return { ...params };
  };

  return (
    <Card loading={isLoading}>
      <div style={{ height: "calc(100vh - 120px)", overflow: "auto" }}>
        <Typography.Title level={4} style={{ margin: "20px 0px 20px" }}>
          {"Change Password"}
        </Typography.Title>
        <Form
          name="ResetPassword"
          layout="vertical"
          {...passwordFormProps}
          initialValues={{
            password: null,
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="New Password"
                name="password"
                rules={[
                  { required: true, message: "Password is required" },
                  { min: 6, message: "Password must be atleast 6 characters" },
                ]}
              >
                <Input.Password type="password" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Confirm Password"
                rules={[
                  { required: true, message: "Confirm Password is required" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The two passwords that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
                name="confirmpassword"
              >
                <Input.Password type="password" />
              </Form.Item>
            </Col>
          </Row>
              <br/>
          <Row>
            <Col span={6}>
              <Form.Item>
                <Button type="primary" size="large" block htmlType="submit">
                  {"Update Password"}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Card>
  );
};

export default EditProfile;
