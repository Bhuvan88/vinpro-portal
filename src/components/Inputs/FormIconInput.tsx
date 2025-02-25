import React from "react";
import { CustomIcon } from "@components/datacomponents/CustomIcon";
import { Form } from "antd";

export declare type IconInputProps = {
  icon?: string;
  label?: string;
  name: string;
  rules?: any;
  children: React.ReactNode;
  formItemProps?: any;
};

const IconInput: React.FC<IconInputProps> = ({
  icon,
  label,
  name,
  rules,
  children,
  formItemProps,
}) => {
  return (
    <Form.Item label={label} name={name} rules={rules} {...formItemProps}>
      {children}
    </Form.Item>
  );
};

export default IconInput;
