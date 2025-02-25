
import React from "react";
import { Affix, Typography } from "antd";
import { useTranslate } from "@refinedev/core";
export const Footer: React.FC = () => {
    const t = useTranslate();
    return (
        <Affix className="footerWrapper">
            <div className="footer" style={{textAlign:'center', height:30, lineHeight:'36px'}}>
                <Typography.Text style={{paddingBottom:5, fontSize:11}}>{
                        t("© 2024 All Rights Reserved. Powered by Inspirepro Technology AB")  
                    }
                </Typography.Text>
            </div>
        </Affix>
    );
};
