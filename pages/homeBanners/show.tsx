import { useTranslate } from "@refinedev/core";
import { useShow } from "@refinedev/core";
import TextField from "@components/fields/TextField";
import BooleanField from "@components/fields/BooleanField";
import DateTextField from "@components/fields/DateTextField";

import { Show } from "@refinedev/antd";
import ImageTextField from "@components/fields/ImageTextField";
import { commonServerSideProps } from 'src/commonServerSideProps';
export const getServerSideProps = commonServerSideProps;

const BannerShow: React.FC<any> = ({ id }) => {
  const t = useTranslate();
  // Show Drawer
  const { showId, setShowId, queryResult } = useShow<any>({
    resource: "home_banners",
    id: id,
    metaData: {
      fields: ["image.*","title","description","button1_text","button1_link","button2_text","button2_link","isactive","link","date_created","date_updated"],
    },
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  
  return (
    <Show
      title="Banner"
      headerProps={{
        extra: false,
       // subTitle: "View",
      }}
      isLoading={isLoading}
    >
      <TextField
        icon="ShopOutlined"
        label="Title"
        textValue={record?.title}
      />
  
      <TextField
        icon="FileTextOutlined"
        label="Description"
        textValue={record?.description}
      />
     
       <TextField
        textValue={record?.button1_link}
        label={"Button 1: " +record?.button1_text}
        icon={"FileSearchOutlined"}
      />
      
      <TextField
        textValue={record?.button2_link}
        label={"Button 2: " +record?.button2_text}
        icon={"FileSearchOutlined"}
      />

       <BooleanField
        textValue={record?.isactive}
        label="Is Active"
        icon={"CheckCircleOutlined"}
      />
      <ImageTextField
        icon="PictureOutlined"
        label="Image"
        imageValue={record?.image?.id}
        size={70}
      />
      <div className="view-info-card">
        {/* <TextField icon={undefined} label={t("label.createdby")} textValue={record?.user_created.first_name + ' ' +record?.user_created.last_name } />
					<TextField icon={undefined} label={t("label.updatedby")} textValue={record?.user_updated && record?.user_updated.first_name + ' ' +record?.user_updated.last_name } />*/}
        <DateTextField
          icon={undefined}
          label="Date Created"
          format={"MMM DD, YYYY HH:mm"}
          textValue={record?.date_created}
        />
        <DateTextField
          icon={undefined}
          label="Date Updated"
          format={"MMM DD, YYYY HH:mm"}
          textValue={record?.date_updated}
        />
      </div>
    </Show>
  );
};

export default BannerShow;
