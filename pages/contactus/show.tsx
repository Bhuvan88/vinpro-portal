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
    resource: "contactus",
    id: id,
    metaData: {
      fields: ["id","first_name","last_name","date_created","email","message","company","phone","status"],
    },
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show
      title="Contact us Details"
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
        textValue={record?.email}
      />
       <TextField
        icon="PhoneOutlined"
        label="Phone"
        textValue={record?.phone}
      />
     <TextField
        icon="UserOutlined"
        label="Company Name"
        textValue={record?.company}
      />
      
       <TextField
        icon="QuestionCircleOutlined"
        label="Message"
        textValue={record?.message}
      />

      <TextField
        icon="CheckCircleOutlined"
        label={t("Status")}
        textValue={record?.status =="draft" ? "Pending" : record?.status}
      />
  

    <DateTextField
        icon={"CalendarOutlined"}
        label="Date Created"
        format={"MMM DD, YYYY HH:mm"}
        textValue={record?.date_created}
      />
    
      
    </Show>
  );
};

export default UserShow;
