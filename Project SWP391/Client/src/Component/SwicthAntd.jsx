import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Space, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { doDarkMode } from '../Store/reducer/userReducer';

const SwicthAntd = () => {
    const [switchMode, setSwitchMode] = useState(() => {
        const storedMode = localStorage.getItem('darkMode');
        return storedMode ? JSON.parse(storedMode) : false;
    });

    const dispatch = useDispatch();

    const selectSwitchMode = (mode) => {
        setSwitchMode(mode);
        localStorage.setItem('darkMode', JSON.stringify(mode));
        dispatch(doDarkMode(mode));
    };

    useEffect(() => {
        const darkmode = document.querySelector(".select-mode");
        if (darkmode) {
            if (switchMode) {
                darkmode.classList.add('dark-mode');
            } else {
                darkmode.classList.remove('dark-mode');
            }
        }
    }, [switchMode]);

    return (
        <Space direction="vertical">
            <Switch
                checkedChildren={<SunOutlined />}
                unCheckedChildren={<MoonOutlined />}
                checked={switchMode}
                onChange={() => selectSwitchMode(!switchMode)}
            />
        </Space>
    );
};

export default SwicthAntd;
