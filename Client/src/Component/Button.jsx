import { Button } from "antd";
import PropTypes from "prop-types";

const ButtonAntd = ({ type, icon, style, onClick, content }) => {
    return (
        <Button 
            type={type}
            icon={icon}
            style={style}
            onClick={onClick}
        >
            {content}
        </Button>
    );
};

ButtonAntd.propTypes = {
    type: PropTypes.oneOf(["primary", "default", "dashed", "link", "text"]).isRequired,
    icon: PropTypes.node,
    style: PropTypes.object,
    onClick: PropTypes.func,
    content: PropTypes.string
};

export default ButtonAntd;
