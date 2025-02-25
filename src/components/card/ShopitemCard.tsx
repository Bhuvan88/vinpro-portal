import { CustomIcon } from "@components/datacomponents/CustomIcon";
import { useApiUrl, useNavigation } from '@refinedev/core';

import {
    ImageField,
} from "@refinedev/antd";
import {
	Card,
	Row,
	Col,
    Typography,
    Button
} from "antd";


const ShopitemCard: React.FC<any> = ({title, bannersrc, data, callback}) => {
    const apiUrl = useApiUrl();
    const { push } = useNavigation();

    return (
        <Card
            className="fooditem-card"
            hoverable
            
            cover={<ImageField
                preview={false}
                value={bannersrc ? apiUrl+"assets/" + bannersrc : '/images/default.png'}
                imageTitle={title} style={{width:'100%', maxHeight:160}}/>
            }
        >
            <div onClick={(): void => push('/city/shop/' + data?.slug)} >
            <Typography.Title level={5} className="greyText">{data?.name}</Typography.Title>
            <p className="greyText">{data?.descriptions}</p>
            </div>
        </Card>	
    )
}

export default ShopitemCard;