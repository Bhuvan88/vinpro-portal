import { useShow, useTranslate } from "@refinedev/core";
import TextField from "@components/fields/TextField";
import DateTextField from "@components/fields/DateTextField";
import { Show } from "@refinedev/antd";
import { commonServerSideProps } from 'src/commonServerSideProps';


export const getServerSideProps = commonServerSideProps;

const UserShow: React.FC<any> = ({ id }) => {
const t = useTranslate();
  // Show Drawer
  const {  queryResult } = useShow<any>({
    resource: "demo_users",
    id: id,
    metaData: {
      fields: ["id","first_name","last_name","date_created","company_mail","company_size","help_description","company_name","country","status"],
    },
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show
      title="Customer Details"
      headerProps={{
        extra: false,
      }}
      isLoading={isLoading}
    >

    <TextField
        icon="UserOutlined"
        label="First Name"
        textValue={record?.first_name}
      />

      <TextField
        icon="UserOutlined"
        label="Last Name"
        textValue={record?.last_name}
      />

      <TextField
        icon="MailOutlined"
        label="Email"
        textValue={record?.company_mail}
      />
       <TextField
        icon="GlobalOutlined"
        label="Country"
        textValue={record?.country}
      />
     <TextField
        icon="UserOutlined"
        label="Company Name"
        textValue={record?.company_name}
      />
      
       <TextField
        icon="UserOutlined"
        label="Company Size"
        textValue={record?.company_size}
      />
       <TextField
        icon="QuestionCircleOutlined"
        label="Country"
        textValue={record?.help_description}
      />

      <TextField
        icon="CheckCircleOutlined"
        label={t("Status")}
        textValue={t(record?.status)}
      />
  

    <DateTextField
        icon={"CalendarOutlined"}
        label={t("datecreated")}
        format={"MMM DD, YYYY HH:mm"}
        textValue={record?.date_created}
      />
    
      
    </Show>
  );
};

export default UserShow;
