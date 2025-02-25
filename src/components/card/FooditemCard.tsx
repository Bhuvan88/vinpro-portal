import { CustomIcon } from "@components/datacomponents/CustomIcon";
import { useApiUrl, useTranslate } from '@refinedev/core';

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

const FooditemCard: React.FC<any> = ({title, imagesrc, data, callback, addbutton, cardStyle}) => {
    const apiUrl = useApiUrl();
    const t = useTranslate();
    //style={{justifyContent:'center',alignItems: 'center'}}
    console.log('callback', callback);
    return (
        <Card className={cardStyle}>
            <Row>
                <Col span={16}>
                    <Typography.Title level={5}>{data?.itemname}</Typography.Title>
                    <Typography.Paragraph className="greyText" ellipsis={{rows: 2}} style={{width:'90%'}} >{data?.itemdescription}</Typography.Paragraph>
                    {data.discount && data?.itemdiscountprice != null ?
                        <p className="greyText" > <span style={{textDecoration : "line-through", marginRight:10}}>{data?.itemprice + ' kr '}</span>{data?.discountprice + ' kr'} </p>
                        : <p className="blackText font-weight-bold" > {data?.itemprice + ' kr'}</p>
                    }
                </Col>
                <Col span={8}>
                    <div className={imagesrc ? "flex-column" : "flex-addbtn"} >
                    {imagesrc &&<ImageField
                            preview={false}
                            value={imagesrc ? apiUrl+"assets/" + imagesrc : '/images/default.png'}
                            imageTitle={title} style={{width:'100%', maxHeight:120}}
                        />
                    }
                    {addbutton && 
                         <Button onClick={()=>callback(data)} size="small" style={{width:84, fontSize:12, marginTop:10}}>
                           {t("add")}
                        </Button>
                    }
                    </div>
                </Col>
            </Row>
        </Card>	
    )
}

export default FooditemCard;