import {
  IResourceComponentsProps,
  useTranslate,
  useExport,
  useShow,
  CrudFilters,
  useApiUrl,
} from "@refinedev/core";

import {
  DateField,
  CreateButton,
  ExportButton,
  BooleanField,
  useTable,
  getDefaultSortOrder,
  ImageField,
  useSelect,
  TextField,
} from "@refinedev/antd";
import {
  Table,
  Space,
  Typography,
  Input,
  Form,
  Select,
  Tooltip,
  Popover,
  Button,
  Breadcrumb,
} from "antd";
import React, { useEffect, useState } from "react";
import { CustomIcon } from "src/components/datacomponents/CustomIcon";
import dayjs from "dayjs";
import { commonServerSideProps } from "src/commonServerSideProps";
import { useTeam } from "src/teamProvider";
import BannerCreate from "./create";
import BannerEdit from "./edit";
import BannerShow from "./show";
import CustomDrawer from "@components/datacomponents/CustomDrawer";
import AvatarField from "@components/datacomponents/AvatarField";
import { useRouter } from "next/router";
export const getServerSideProps = commonServerSideProps;

const BannerList: React.FC<IResourceComponentsProps> = ({ initialData }) => {
  const t = useTranslate();
  const router = useRouter();
  const { setSelectedMenu, setHeaderTitle, identity, isAdmin } = useTeam();
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [gridview, setGridview] = useState(false);
  const [editId, setEditId] = useState(null);
  const apiUrl = useApiUrl();

  useEffect(() => {
    setSelectedMenu("/featured", "/banners");
    setHeaderTitle(t("banners"));
  }, []);

  const { tableProps, sorters, tableQueryResult, filters, searchFormProps } =
    useTable<any>({
      resource: "home_banners",
      syncWithLocation: true,
      pagination: {
        pageSize: 20,
        mode: "server",
      },
      queryOptions: {
        initialData,
      },
      metaData: {
        fields: ["id", "image", "title", "link", "isactive", "date_created"],
      },
      onSearch: (params: any) => {
        const filters: CrudFilters = [];
        const { search, merchant, city } = params;

        filters.push({
          field: "search",
          operator: "contains",
          value: search,
        });

        return filters;
      },
      sorters: {
        initial: [
          {
            field: "date_created",
            order: "desc",
          },
        ],
      },
    });

  console.log("tableProps", tableProps);

  const createCallback = (status) => {
    if (status === "success") {
      setShowCreateDrawer(false);
      tableQueryResult.refetch();
    }
    if (status === "error") {
      setShowCreateDrawer(false);
    }
    if (status === "close") {
      setShowCreateDrawer(false);
    }
  };

  const editCallback = (status) => {
    if (status === "success") {
      setShowEditDrawer(false);
      tableQueryResult.refetch();
    }
    if (status === "error") {
      setShowEditDrawer(false);
    }
    if (status === "close") {
      setShowEditDrawer(false);
    }
  };

  const { triggerExport, isLoading } = useExport<any>({
    resource: "banners",
    filters: filters,
    metaData: {
      fields: ["id", "image", "link", "isactive", "date_created"],
    },
    mapData: (item) => {
      return {
        Id: item.id,
        Image: item.image,
        Link: item.link,
        Merchant: item.merchant?.name,
        City: item?.city?.map((item: any) => item?.city_id?.name).join(", "),
        Status: item.isactive,
        Date_Created: dayjs(item?.date_created, "YYYY-MM-DD HH:mm").format(
          "DD-MM-YYYY HH:mm"
        ),
      };
    },
  });

  const content = (
    <div>
      <Form.Item name="search" className="card-search mt-20 ml-10">
        <Input
          allowClear
          className="search-input"
          placeholder={t("search")}
          prefix={<CustomIcon type="SearchOutlined" />}
        />
      </Form.Item>
    </div>
  );

  return (
    <>
      <Breadcrumb style={{ margin: "16px" }}>
        <Breadcrumb.Item
          className="clickable"
          onClick={() => router.push("/website-settings")}
        >
          Web Settings
        </Breadcrumb.Item>
        <Breadcrumb.Item>Home page Banners</Breadcrumb.Item>
      </Breadcrumb>
      <div className="stickyheader">
        <div className="flex-row" style={{ alignItems: "center" }}>
          <Typography.Title level={5} className="headTitle">
            Home Banners
          </Typography.Title>
        </div>

        <div style={{ marginRight: 30 }}>
          <Space>
            <Form
              layout="vertical"
              {...searchFormProps}
              onValuesChange={() => {
                searchFormProps.form?.submit();
              }}
            >
             
            </Form>
            <CreateButton
              onClick={() => setShowCreateDrawer(true)}
              type="primary"
              className="mr-5"
            >
              {t("new")}
            </CreateButton>
            {/* <ExportButton
            type="primary"
            onClick={triggerExport}
            loading={isLoading}
            className="ml-5"
          >
            {t("export")}
          </ExportButton> */}
          </Space>
        </div>
      </div>

      <Table
        rowKey="id"
        {...tableProps}
        scroll={{ y: "calc(100vh - 220px)", x: "1000px" }}
        pagination={{
          ...tableProps.pagination,
          ...{
            size: "small",
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${t("showing")} ${range[0]}-${range[1]} ${t("of")} ${total} ${t(
                "items"
              )}`,
          },
        }}
      >
        <Table.Column
          width={80}
          dataIndex="sno"
          key="sno"
          title={t("sno")}
          render={(text, object, index) => index + 1}
          // render={(value) => <TextField value={value} />}
          // defaultSortOrder={getDefaultSortOrder("id", sorter)}
          // sorter
        />
        <Table.Column
          width={80}
          dataIndex="title"
          key="title"
          title="Title"
          render={(value) => <TextField value={value} />}

          // sorter
        />
        <Table.Column
          width={100}
          dataIndex="image"
          key="image"
          title={t("image")}
          render={(value: any) => (
            value ? <ImageField
              value={apiUrl + "assets/" + value}
              width={40}
              height={40}
              style={{ objectFit: "cover" }}
            /> : '-'
          )}
          defaultSortOrder={getDefaultSortOrder("image", sorters)}
          //sorter
        />

        <Table.Column
          width={80}
          dataIndex="isactive"
          key="isactive"
          title={t("status")}
          render={(value) => (
            <BooleanField
              value={value}
              trueIcon={
                <CustomIcon
                  type="CheckCircleFilled"
                  styleProps={{
                    style: {
                      color: "green",
                      fontSize: "20px",
                    },
                  }}
                />
              }
              falseIcon={
                <CustomIcon
                  type="CloseCircleFilled"
                  styleProps={{
                    style: {
                      color: "red",
                      fontSize: "20px",
                    },
                  }}
                />
              }
            />
          )}
        />

        <Table.Column
          width={130}
          dataIndex="date_created"
          key="date_created"
          title="Date Created"
          render={(value) =>
            value && <DateField value={value} format="MMM DD, YYYY HH:mm" />
          }
          //defaultSortOrder={getDefaultSortOrder("date_created", sorters)}
          sorter
        />
        <Table.Column<any>
          width={100}
          title={t("actions")}
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              <div
                className="actionBtn"
                onClick={(): void => {
                  setEditId(record.id);
                  setShowEditDrawer(true);
                }}
              >
                <CustomIcon type="FormOutlined" />
              </div>
            </Space>
          )}
        />
      </Table>

      {showCreateDrawer && (
        <BannerCreate callback={createCallback} visible={showCreateDrawer} />
      )}

      {showEditDrawer && (
        <CustomDrawer
          callback={editCallback}
          visible={showEditDrawer}
          resource={"home_banners"}
          permissionResource={"home_banners"}
          module={"administration"}
          id={editId}
          viewProps={<BannerShow id={editId} />}
          editProps={<BannerEdit id={editId} callback={editCallback} />}
        />
      )}
    </>
  );
};

export default BannerList;
