import {
  IResourceComponentsProps,
  useTranslate,
  useExport,
  useShow,
  CrudFilters,
} from "@refinedev/core";

import {
  DateField,
  CreateButton,
  useSimpleList,
  TextField,
  useTable,
} from "@refinedev/antd";
import {
  Table,
  Space,
  Tooltip,
  Card,
  Typography,
  Input,
  Form,
  Button,
  List as AntdList
} from "antd";

import AvatarField from "@components/datacomponents/AvatarField";
import React, { useEffect, useState } from "react";
import { CustomIcon } from "src/components/datacomponents/CustomIcon";

import { commonServerSideProps } from "src/commonServerSideProps";
import { useTeam } from "src/teamProvider";
import CreateCategory from "./create";
import EditCategory from "./edit";
import ShowCategory from "./show";
import CustomDrawer from "@components/datacomponents/CustomDrawer";
import { dotTocomma } from "src/functions";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import NextRouter from "@refinedev/nextjs-router";
//import { utilitySort } from "@tspvivek/refine-directus";
import { directusClient } from "src/directusClient";
import ChangeVariantPrice from "./changevariantprice";
const { Link } = NextRouter;

export const getServerSideProps = commonServerSideProps;

const CategoryList: React.FC<IResourceComponentsProps> = ({ initialData }) => {
  const t = useTranslate();
  const { setSelectedMenu, setHeaderTitle, isAdmin, identity } = useTeam();
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [editId, setEditId] = useState(null);
  const [gridview, setGridview] = useState(false);

  const [items, setItems] = useState<any>([]);
  const [loadingIds, setLoadingIds] = useState<any>([]);
  const [isVariantChangeVisible, setIsVariantChangeVisible] = useState(false);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    setSelectedMenu("/category", "/category");
    setHeaderTitle(t("category"));
    console.log("identity", identity?.merchant?.id);
  }, []);

  const {
    tableProps,
    searchFormProps,
    tableQueryResult: formQuery,
  } = useTable<any>({
    resource: "category",
    syncWithLocation: true,
    queryOptions: {
      initialData,
    },
    pagination: {
      pageSize:10,
      mode:"server"
    },
    metaData: {
      fields: ["commission","name","date_created","id"],
    },
    filters:{
      permanent : 
      [{
        field: "merchant",
        operator: "eq",
        value: identity?.merchant?.id,
      }]
    },
    onSearch: (params: any) => {
      const filters: CrudFilters = [];
      const { search } = params;

      filters.push({
        field: "search",
        operator: "contains",
        value: search,
      });
      return filters;
    },
    sorters: {              
      permanent: [
        {
          field: "sort",
          order: "asc",
        },
      ],
      initial: [
        {
          field: "sort",
          order: "asc",
        },
      ],
 },
   
  });

  const record = formQuery?.data?.data;
  useEffect(() => {
    if (record) {
      setItems(record);
    } else {
      setItems([]);
    }
  }, [record]);


  const createCallback = (status) => {
    if (status === "success") {
      setShowCreateDrawer(false);
      formQuery.refetch();
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
      formQuery.refetch();
    }
    if (status === "error") {
      setShowEditDrawer(false);
    }
    if (status === "close") {
      setShowEditDrawer(false);
    }
  };


  const ChangeVariantCallback = (status) => {
    if (status === "success") {
      setIsVariantChangeVisible(false);
      formQuery.refetch();
    }
    if (status === "error") {
      setIsVariantChangeVisible(false);
    }
    if (status === "close") {
      setIsVariantChangeVisible(false);
    }
  };


  return (
    <>
      <div className="stickyheader">
        <div className="flex-row" style={{ alignItems: "center" }}>
          <Typography.Title level={5} className="headTitle">
            {t("category")}
          </Typography.Title>

          <Form
            layout="vertical"
            {...searchFormProps}
            onValuesChange={() => {
              searchFormProps.form?.submit();
            }}
          >
            <Form.Item name="search" className="card-search mt-20 ml-10">
              <Input
                allowClear
                style={{width:180}}
                className="search-input"
                placeholder={t("search")}
                prefix={<CustomIcon type="SearchOutlined" />}
              />
            </Form.Item>
          </Form>
          <div style={{ marginLeft: 10 }}>
            <Link to={`/category/sortCategory`}>
              <Button
                icon={<CustomIcon type="SortAscendingOutlined" />}
                size="middle"
                type="primary"
              >
               {t("sort")}
              </Button>
            </Link>
          </div>
        </div>

        <div style={{ marginRight: 30 }}>
          <CreateButton
            onClick={() => setShowCreateDrawer(true)}
            type="primary"
            className="mr-5"
          >
            {t("new")}
          </CreateButton>
        </div>
      </div>

    
        <Table
          rowKey="id"
          {...tableProps}
          dataSource={record}
          loading={record ? false : true}
          pagination={{
            ...tableProps.pagination,
            ...{
              size: "small",
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${t("showing")} ${range[0]}-${range[1]} ${t("of")} ${total} ${t("items")}`,
            },
          }}
          scroll={{ y: "calc(100vh - 220px)", x: "500px" }}
        >
          <Table.Column
            width={100}
            dataIndex="name"
            key="itemname"
            title={t("categoryname")}
            render={(value) => <TextField style={{textTransform:"capitalize"}} value={value} />}
          />

          <Table.Column
            width={100}
            dataIndex="commission"
            key="commission"
            title={t("commission(kr)")}
            render={(value) => (
              <TextField
                value={value ? dotTocomma(parseFloat(value).toFixed(2)) : null}
              />
            )}
          />

          <Table.Column
            width={100}
            dataIndex="date_created"
            key="date_created"
            title={t("datecreated")}
            render={(value) => value && <DateField value={value} format="MMM DD, YYYY HH:mm" />}
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
                  <CustomIcon type="SettingOutlined" />
                </div>
                <Tooltip title={t("changevariantprice")}>
                  <div
                    className="actionBtn"
                    onClick={(): void => {
                      setIsVariantChangeVisible(true);
                      setCategory({id:record?.id,name:record?.name});
                    }}
                  >
                    <CustomIcon type="DollarOutlined" />
                  </div>
                </Tooltip>
              </Space>
            )}
          />
        </Table>
      

      {showCreateDrawer && (
        <CreateCategory callback={createCallback} visible={showCreateDrawer} />
      )}

      {showEditDrawer && (
        <CustomDrawer
          callback={editCallback}
          visible={showEditDrawer}
          resource={"category"}
          permissionResource={"category"}
          module={"administration"}
          id={editId}
          viewProps={<ShowCategory id={editId} />}
          editProps={<EditCategory id={editId} callback={editCallback} />}
        />
      )}
       {isVariantChangeVisible && (
        <ChangeVariantPrice
          category={category}
          visible={isVariantChangeVisible}
          callback={ChangeVariantCallback}
        />
      )}
    </>
  );
};

export default CategoryList;
