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
  useTable,
  TextField,
  getDefaultSortOrder,
  ImageField,
} from "@refinedev/antd";
import { Table, Space, Typography, Input, Form, Button,Tag, Badge } from "antd";
import React, { useEffect, useState } from "react";
import { CustomIcon } from "src/components/datacomponents/CustomIcon";

import { commonServerSideProps } from "src/commonServerSideProps";
import { useTeam } from "src/teamProvider";
import CtcCreate from "./create";
import CtcEdit from "./edit";
import CtcShow from "./show";
import CustomDrawer from "@components/datacomponents/CustomDrawer";
import AvatarField from "@components/datacomponents/AvatarField";
import NextRouter from "@refinedev/nextjs-router";
import dayjs from "dayjs";
const { Link } = NextRouter;
export const getServerSideProps = commonServerSideProps;

const NotesCreate: React.FC<IResourceComponentsProps> = ({ initialData }) => {
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const { setSelectedMenu, setHeaderTitle, identity, isAdmin } = useTeam();
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [gridview, setGridview] = useState(false);
  const [editId, setEditId] = useState(null);
  const [items, setItems] = useState<any>([]);

  useEffect(() => {
    setSelectedMenu("/notes", "/notes");
    setHeaderTitle("EOR Notes");
  }, []);

  const { tableProps, sorters, tableQueryResult, filters, searchFormProps } =
    useTable<any>({
      resource: "eor_notes",
      syncWithLocation: true,
      pagination: {
        pageSize: 20,
        mode: "server",
      },
      queryOptions: {
        initialData,
      },
      metaData: {
        fields: ["*", "country.name"],
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
        initial: [
          {
            field: "sort",
            order: "asc",
          },
        ],
       },
    });

  const record = tableQueryResult?.data?.data;
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

  return (
    <>
      <div className="stickyheader">
        <div className="flex-row" style={{ alignItems: "center" }}>
          <Typography.Title level={5} className="headTitle">
            Notes 
          </Typography.Title>
          <Form
            layout="vertical"
            {...searchFormProps}
            onValuesChange={() => {
              searchFormProps.form?.submit();
            }}
          >
            <Space>
              <Form.Item name="search" className="card-search mt-20 ml-10">
                <Input
                  allowClear
                  style={{ width: 180 }}
                  className="search-input"
                  placeholder="Search"
                  prefix={<CustomIcon type="SearchOutlined" />}
                />
              </Form.Item>
            </Space>
          </Form>
        </div>

        <div style={{ marginRight: 30 }}>
          <Space>
            <CreateButton
              onClick={() => setShowCreateDrawer(true)}
              type="primary"
              className="mr-5"
            >
              Add
            </CreateButton>
          </Space>
        </div>
      </div>

      <Table
        rowKey="id"
        {...tableProps}
        scroll={{ y: "calc(100vh - 220px)", x: "900px" }}
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
          width={90}
          dataIndex="sno"
          key="sno"
          title={t("sno")}
          render={(text, object, index) => index + 1}
        />

         
          <Table.Column
            dataIndex={"notes"}
            key="notes"
            title="EOR Notes"
            render={(value) => (
              <TextField value={value} />
            )}
            //defaultSortOrder={getDefaultSortOrder("itemname", sorter)}
            //sorter
          />

        <Table.Column
          width={100}
          dataIndex={["country", "name"]}
          key="sort"
          title={"Country"}
          render={(value) => (
            <Tag style={{fontSize:14, padding:'4px 8px'}} >{value}</Tag>
          )}
        />
          

        <Table.Column
          width={90}
          dataIndex="sort"
          key="sort"
          title={"Order"}
          render={(value) => (
            <Badge count={value} color="#1492fa"/>
          )}
        />
       

        <Table.Column<any>
          width={100}
          title="Actions"
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
        <CtcCreate callback={createCallback} visible={showCreateDrawer} />
      )}

      {showEditDrawer && (
        <CustomDrawer
          callback={editCallback}
          visible={showEditDrawer}
          resource={"eor_notes"}
          permissionResource={"eor_notes"}
          module={"administration"}
          id={editId}
          viewProps={false}
          editProps={<CtcEdit id={editId} callback={editCallback} />}
        />
      )}
    </>
  );
};

export default NotesCreate;
