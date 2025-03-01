import {
  IResourceComponentsProps,
  useTranslate,
  CrudFilters,
} from "@refinedev/core";

import {
  DateField,
  TextField,
  getDefaultSortOrder,
  useTable,
  DeleteButton
} from "@refinedev/antd";

import {
  Table,
  Typography,
  Input,
  Form,
  Space
} from "antd";

import AvatarField from "@components/datacomponents/AvatarField";
import React, { useEffect,useState } from "react";
import { CustomIcon } from "src/components/datacomponents/CustomIcon";
import { commonServerSideProps } from "src/commonServerSideProps";
import { useTeam } from "src/teamProvider";
import CustomDrawer from "@components/datacomponents/CustomDrawer";
import UserShow from "./show";

export const getServerSideProps = commonServerSideProps;

const CustomerList: React.FC<IResourceComponentsProps> = ({ initialData }) => {

  const t = useTranslate();
  const { setSelectedMenu, setHeaderTitle} = useTeam();

        const [showEditDrawer, setShowEditDrawer] = useState(false);
        const [editId, setEditId] = useState(null);
        const [ showDrawer, setShowDrawer] = useState<boolean>(false);

  useEffect(() => {
    setSelectedMenu("/contactus", "/contactus");
    setHeaderTitle(t("contactus"));
  }, []);

  const { tableProps, sorters, searchFormProps ,tableQueryResult} =
    useTable<any>({
      resource: "contactus",
      syncWithLocation: true,
      pagination:{
        pageSize:25,
        mode:"server"
      },
      queryOptions: {
        initialData,
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
      sorters:{
        initial: [
          {
            field: "first_name",
            order: "asc",
          },
          {
            field: "date_created",
            order: "desc",
          },
        ],

      },
     
    });

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
      setShowDrawer(false);
      setEditId(undefined);
    };


  return (
    <>
      <div className="stickyheader">
        <div className="flex-row" style={{ alignItems: "center" }}>
          <Typography.Title level={5} className="headTitle">
          Contact Us
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
                placeholder="Search"
                prefix={<CustomIcon type="SearchOutlined" />}
              />
            </Form.Item>
          </Form>
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
          width={250}
          dataIndex="first_name"
          key="first_name"
          title="Name"
          render={(_, record: any) => {
            let firstName = record.first_name
              ? record.first_name.charAt(0).toUpperCase()
              : "";
            let lastName = record.last_name
              ? record.last_name.charAt(0).toUpperCase()
              : "";
            return (
              <AvatarField
                title={
                  record.first_name +
                  " " +
                  (record.last_name ? record.last_name : "")
                }
                initials={firstName + lastName}
                linkUrl={undefined}
                linkSrc={undefined}
                imagesrc={record.avatar && record.avatar.id}
              />
            );
          }}
         // defaultSortOrder={getDefaultSortOrder("first_name", sorters)}
          sorter
        />
         
        
        <Table.Column
          width={250}
          dataIndex="company"
          key="company"
          title="Company"
          render={(value) => <TextField value={value} />}
          defaultSortOrder={getDefaultSortOrder("email", sorters)}
          //sorter
        />
         <Table.Column
          width={250}
          dataIndex="phone"
          key="phone"
          title="Phone"
          render={(value) => <TextField value={value} />}
          defaultSortOrder={getDefaultSortOrder("phone", sorters)}
          //sorter
        />

       <Table.Column
          width={250}
          dataIndex="email"
          key="email"
          title="Email"
          render={(value) => <TextField value={value} />}
          defaultSortOrder={getDefaultSortOrder("email", sorters)}
          //sorter
        />
       
        <Table.Column
          width={200}
          dataIndex="date_created"
          key="date_created"
          title="Date Created"
          render={(value) => value && <DateField value={value} format="MMM DD, YYYY HH:mm" />}
         // defaultSortOrder={getDefaultSortOrder("date_created", sorters)}
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
                    setEditId(record?.id);
                    setShowEditDrawer(true);
                    console.log("record", record);
                  }}
                >
                 <CustomIcon type="EyeOutlined" />
                </div>
              

              <DeleteButton
                hideText
                resource={"contactus"}
                size="small"
                onSuccess={() => tableQueryResult.refetch()}
                recordItemId={record?.id}
                accessControl={{ enabled: true }}
                meta={{ deleteType: "archive" }}
                confirmTitle={t("confirm")}
                successNotification={{
                  message: t("deletedsuccessfully"),
                  type: "success",
                }}
              />
                {/* <div
                  className="actionBtn"
                  onClick={(): void => { 
                    setEditId(record?.id);
                    setShowDrawer(true);  
                    console.log("record>>>>>.", record);               
                  }}
                >
                  <CustomIcon type="LockOutlined" />
                </div> */}
              </Space>
            )}
          />
      
      </Table>
      {showEditDrawer && (
        <CustomDrawer
          callback={editCallback}
          visible={showEditDrawer}
          resource={"contactus"}
          permissionResource={"directus_users"}
          module={"administration"}
          id={editId}
          viewProps={<UserShow id={editId} />}
          // editProps={<OwnerEdit id={editId} callback={editCallback} visible={false} />}
          hideDelete
        />
      )}  
    </>
  );
};

export default CustomerList;
