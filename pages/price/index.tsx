import {
  IResourceComponentsProps,
  useTranslate,
  useExport,
  useShow,
  CrudFilters,
  useApiUrl
} from "@refinedev/core";
import {
  DateField,
  CreateButton,
  ExportButton,
  useTable,
  TextField,
  getDefaultSortOrder,
  ImageField
} from "@refinedev/antd";
import {
  Table,
  Space,
  Typography,
  Input,
  Form,
  Button,
} from "antd";
import React, { useEffect, useState } from "react";
import { CustomIcon } from "src/components/datacomponents/CustomIcon";

import { commonServerSideProps } from "src/commonServerSideProps";
import { useTeam } from "src/teamProvider";
import CuisineCreate from "./create";
import CuisineEdit from "./edit";
import CuisineShow from "./show";
import CustomDrawer from "@components/datacomponents/CustomDrawer";
import AvatarField from "@components/datacomponents/AvatarField";
import NextRouter from "@refinedev/nextjs-router";
import dayjs from "dayjs";
const { Link } = NextRouter;
export const getServerSideProps = commonServerSideProps;

const CuisineList: React.FC<IResourceComponentsProps> = ({ initialData }) => {
  const t = useTranslate();
   const apiUrl = useApiUrl();
  const { setSelectedMenu, setHeaderTitle, identity, isAdmin } = useTeam();
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [gridview, setGridview] = useState(false);
  const [editId, setEditId] = useState(null);
  const [items, setItems] = useState<any>([]);

  useEffect(() => {
    setSelectedMenu("/price", "/price");
    setHeaderTitle("PriceList");
  }, []);

  const { tableProps, sorters, tableQueryResult, filters, searchFormProps } =
    useTable<any>({
      resource: "price_list",
      syncWithLocation: true,
      pagination: {             
               pageSize:20,
               mode:'server'
           },
      queryOptions: {
        initialData,
      },
      metaData: {
        fields: ["id","title","details","date_created","details"]
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
                    field: "date_created",
                    order: "desc",
                  },
                ],
           },
  //     sorters: {              
  //       initial: [
  //         {
  //           field: "date_created",
  //           order: "desc",
  //         },
  //         {
  //           field: "name",
  //           order: "asc",
  //         },
  //       ],
  //  },
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
            Price List
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
                 style={{width:180}}
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
              `${t("showing")} ${range[0]}-${range[1]} ${t("of")} ${total} ${t("items")}`,
          },
        }}
      >

         <Table.Column
          width={50}
          dataIndex="sno"
          key="sno"
          title={t("sno")}
          render={(text, object, index) => index + 1}
        />

     

        <Table.Column
          width={150}
          dataIndex="title"
          key="title"
          title="title"
          render={(value) => <TextField value={value} />}
          //defaultSortOrder={getDefaultSortOrder("name", sorters)}
          //sorter
        />
        
       
              

        <Table.Column
          width={130}
          dataIndex="date_created"
          key="date_created"
          title="Date Created"
          render={(value) => value && <DateField value={value} format="MMM DD, YYYY HH:mm" />}
          //defaultSortOrder={getDefaultSortOrder("date_created", sorters)}
          //sorter
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
        <CuisineCreate callback={createCallback} visible={showCreateDrawer} />
      )}

      {showEditDrawer && (
        <CustomDrawer
          callback={editCallback}
          visible={showEditDrawer}
          resource={"price_list"}
          permissionResource={"price_list"}
          module={"administration"}
          id={editId}
          viewProps={<CuisineShow id={editId} />}
          editProps={<CuisineEdit id={editId} callback={editCallback} />}
        />
      )}
    </>
  );
};

export default CuisineList;
