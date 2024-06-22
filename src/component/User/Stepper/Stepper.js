import * as React from 'react';
import PropTypes from 'prop-types';
import {styled} from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Check from '@mui/icons-material/Check';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import DepartureBoardIcon from '@mui/icons-material/DepartureBoard';
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import LoopIcon from '@mui/icons-material/Loop';
import StepConnector, {stepConnectorClasses} from '@mui/material/StepConnector';
import {useEffect} from "react";

const ColorlibConnector = styled(StepConnector)(({theme}) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor:
            theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderRadius: 1,
    },
}));

const ColorlibStepIconRoot = styled('div')(({theme, ownerState}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
        backgroundImage:
            'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
        backgroundImage:
            'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    }),
}));

function ColorlibStepIcon(props) {
    const {active, completed, className} = props;

    const icons = {
        1: <InventoryIcon/>,
        2: <RemoveShoppingCartIcon/>,
        3: <ContentPasteGoIcon/>,
        4: <DepartureBoardIcon/>,
        5: <LocalShippingIcon/>,
        6: <CreditScoreIcon/>,
        7: <LoopIcon/>,
    };

    return (
        <ColorlibStepIconRoot ownerState={{completed, active}} className={className}>
            {icons[String(props.icon)]}
        </ColorlibStepIconRoot>
    );
}

ColorlibStepIcon.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    completed: PropTypes.bool,
    icon: PropTypes.node,
};

const allSteps = ['Chờ xác nhận', 'Hủy đơn hàng', 'Đang lấy hàng', 'Đang vận chuyển', 'Đang giao hàng', 'Đã giao hàng', 'Trả hàng']
export default function CustomizedSteppers({status}) {
    const steps = [];
    const icons = [];

    if (status === 'cancel') {
        steps.push(...allSteps.slice(0, 2)); // 'Hủy đơn hàng'
        icons.push(1, 2);
    }

    if (status !== 'cancel') {
        steps.push(...allSteps.slice(0, 1), ...allSteps.slice(2, 6));
        icons.push(1, 3, 4, 5, 6);
    }

    if (status === 'returned') {
        steps.push(allSteps[6]); // 'Trả hàng'
        icons.push(7);
    }
    useEffect(() => {
    }, [status]);
    let index;
    if (status !== "cancel") {
        switch (status) {
            case 'pending':
                index = 0
                break;
            case 'picking':
                index = 1
                break;
            case 'transporting':
                index = 2
                break;
            case 'delivering':
                index = 3
                break;
            case 'delivered':
                index = 4
                break;
            case 'returned':
                index = 5
                break;
            default:
                index = 0
                break;
        }
    } else {
        switch (status) {
            case 'pending':
                index = 0
                break;
            case 'cancel':
                index = 1
                break;
        }
    }
    console.log(index)

    return (
        <Stack sx={{width: '100%'}} spacing={4}>
            <Stepper alternativeLabel activeStep={index} connector={<ColorlibConnector/>}>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel StepIconComponent={(props) => <ColorlibStepIcon {...props} icon={icons[index]}/>}>
                            {label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Stack>
    );
}

CustomizedSteppers.propTypes = {
    status: PropTypes.string.isRequired
};
