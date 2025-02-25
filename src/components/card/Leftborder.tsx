import { CustomIcon } from "@components/datacomponents/CustomIcon";


interface borders {
    borderColor: string;
    showIcon?: boolean;
    children?: any;
    callback?: any;
}

const Leftborder: React.FC<borders> = ({borderColor, children, showIcon, callback}) => {

    return (
        <div className="cardLeftBorder" style={{ borderLeftColor: borderColor}}>
            <div className="card-flex">
                {children}
                <div
                    style={{ cursor: 'pointer',}}
                    onClick={() => {callback()}}
                >
                <CustomIcon type="MoreOutlined" />
                </div>  
            </div>
        </div> 
    )
}

export default Leftborder;