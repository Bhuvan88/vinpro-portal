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
    resource: "banners",
    id: id,
    metaData: {
      fields: ["image.*","client_name","isactive","link","date_created","date_updated"],
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
        icon="LinkOutlined"
        label={t("bannerlink")}
        textValue={record?.link}
      />
      
      <TextField
        icon="ShopOutlined"
        label="client_name"
        textValue={record?.client_name}
      />
      <BooleanField
        textValue={record?.isactive}
        label="Is Active"
        icon={"CheckCircleOutlined"}
      />
      {/* <BooleanField
        textValue={record?.iscommercial}
        label={t("iS commercial")}
        icon={"DollarOutlined"}
      /> */}
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
          label={t("datecreated")}
          format={"MMM DD, YYYY HH:mm"}
          textValue={record?.date_created}
        />
        <DateTextField
          icon={undefined}
          label={t("dateupdated")}
          format={"MMM DD, YYYY HH:mm"}
          textValue={record?.date_updated}
        />
      </div>
    </Show>
  );
};

export default BannerShow;
