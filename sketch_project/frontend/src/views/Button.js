import ChromeColorBox from './SketchColor';
import {useCallback, useState, useEffect, useRef} from 'react';
import Button from '@enact/sandstone/Button';
import {fabric} from 'fabric';
import {Column, Row, Cell, Layout} from '@enact/ui/Layout';
import Panels, {Panel, Header} from '@enact/sandstone/Panels';
import $L from '@enact/i18n/$L';
import css from './Main.module.less';
import Alert from '@enact/sandstone/Alert';
import Dropdown from '@enact/sandstone/Dropdown';
import {InputField} from '@enact/sandstone/Input';
import { Draw_TextAi, Draw_TextBox } from './DrawPolygon';
import CheckboxItem from '@enact/sandstone/CheckboxItem';
import Popup from '@enact/sandstone/Popup';
import Spinner from '@enact/sandstone/Spinner';
// bright : e6e6e6, dark : 4c5059

export const Btn_trash = ({trash_Open, trash_setOpen, setclearCanvas}) => {
    const [btn_Trash_Open,btn_Trash_setOpen] = useState(0);
    const btn_Trash_isovered = useRef(false);
	const btn_Trash_img = ['./cross1.png','./cross2.png'];
	const [btn_Trash_val,btn_Trash_setval] = useState(btn_Trash_img[0]);
	const btn_Trash_resetval = () => {
		if (btn_Trash_isovered.current == true) {
			btn_Trash_setval(btn_Trash_img[0]);
			btn_Trash_isovered.current = false;
		}
	};  

	return (
		<Column>
            <Cell>
                <Button style={{position:'relative', top:'-20px'}}
                    icon={true}
                    iconComponent={<img src={btn_Trash_val} alt="Trash" style={{height:'75%'}} />}
                    iconOnly
                    backgroundOpacity="opaque"
                    onClick={()=>{btn_Trash_setOpen(btn_Trash_Open+1); trash_setOpen(true)}}
                    onMouseOut={btn_Trash_resetval}
                    onMouseOver={()=>{btn_Trash_setval(btn_Trash_img[1]); btn_Trash_isovered.current=true}}
                />
                <Alert type="overlay" open={trash_Open} onClose={()=>{trash_setOpen(false)}}>
                    <h3>{$L('Clear Canvas?\n')}</h3>
                    <Row align = "center">
                        <Cell>
                            <Button
                                size="small"
                                className={css.buttonCell}
                                onClick={()=>{trash_setOpen(false); setclearCanvas(true)}}>
                                {$L('Yes')}
                            </Button>
                        </Cell>
                        <Cell>
                            <Button
                                size="small"
                                className={css.buttonCell}
                                onClick={()=>{trash_setOpen(false)}}>
                                {$L('No')}
                            </Button>
                        </Cell>
                    </Row>
                </Alert>
            </Cell>
        </Column>
	);
};

export const Btn_drawingMode = ({drawingMode, setdrawingMode, drawingMode_request, setdrawingMode_request}) => {
	const [btn_drawingMode_Open,btn_drawingMode_setOpen] = useState(0);
	const btn_drawingMode_isovered = useRef(false);
	const btn_drawingMode_img = ['./Mode1.png','./Mode2.png','./Mode3.png','./Mode4.png'];
	const [btn_drawingMode_val,btn_drawingMode_setval] = useState(btn_drawingMode_img[0]);

    useEffect(()=>{
        if (drawingMode_request == 1) {
            if (btn_drawingMode_Open%2 == 1) {
                if (btn_drawingMode_isovered.current == true) {
                    btn_drawingMode_setval(btn_drawingMode_img[1]);
                }
                else {
                    btn_drawingMode_setval(btn_drawingMode_img[0]);
                }
                setdrawingMode(true);
                btn_drawingMode_setOpen(btn_drawingMode_Open+1);
            }
            setdrawingMode_request(0);
        }
        else if (drawingMode_request == 2) {
            if (btn_drawingMode_Open%2 == 0) {
                if (btn_drawingMode_isovered.current == true) {
                    btn_drawingMode_setval(btn_drawingMode_img[3]);
                }
                else {
                    btn_drawingMode_setval(btn_drawingMode_img[2]);
                }
                setdrawingMode(false);
                btn_drawingMode_setOpen(btn_drawingMode_Open+1);
            }
            setdrawingMode_request(0);
        }
    },[drawingMode_request]);

	const btn_drawingMode_resetval = () => {
		if (btn_drawingMode_isovered.current == true) {
            if (btn_drawingMode_Open%2 == 0) {
                btn_drawingMode_setval(btn_drawingMode_img[0]);
            }
            else {
                btn_drawingMode_setval(btn_drawingMode_img[2]);
            }
			btn_drawingMode_isovered.current = false;
		}
	};

    const btn_drawingMode_Click = () => {
        if (btn_drawingMode_Open%2 == 1) {
            btn_drawingMode_setval(btn_drawingMode_img[1]);
            setdrawingMode(true);
        }
        else {
            btn_drawingMode_setval(btn_drawingMode_img[3]);
            setdrawingMode(false);
        }
        btn_drawingMode_setOpen(btn_drawingMode_Open+1);
    };

    const btn_drawingMode_MouseOver = () => {
        if (btn_drawingMode_Open%2 == 0) {
            btn_drawingMode_setval(btn_drawingMode_img[1]);
        }
        else {
            btn_drawingMode_setval(btn_drawingMode_img[3]);
        }
        btn_drawingMode_isovered.current=true;
    };

	return (
		<Column align='center'>
			<Cell>
				<Button className='btn_drawingMode'
					icon={true}
					iconComponent={<img src={btn_drawingMode_val} alt="drawingMode" style={{height:'75%'}} />}
					iconOnly
					backgroundOpacity="opaque"
					onClick={btn_drawingMode_Click}
					onMouseOut={btn_drawingMode_resetval}
					onMouseOver={btn_drawingMode_MouseOver}>
				</Button>
			</Cell>
		</Column>
	);
};

export const Btn_bgColor = ({bgColor, setbgColor}) => {
	const [btn_bgColor_Open,btn_bgColor_setOpen] = useState(0);
	const btn_bgColor_isovered = useRef(false);
	const btn_bgColor_img = ['./bgColor1.png','./bgColor2.png'];
	const [btn_bgColor_val,btn_bgColor_setval] = useState(btn_bgColor_img[0]);
	const btn_bgColor_resetval = () => {
		if (btn_bgColor_isovered.current == true) {
			btn_bgColor_setval(btn_bgColor_img[0]);
			btn_bgColor_isovered.current = false;
		}
	};

	return (
		<Column align='center'>
			<Cell>
				<Button className='btn_bgColor'
					icon={true}
					iconComponent={<img src={btn_bgColor_val} alt="bgColor" style={{height:'75%'}} />}
					iconOnly
					backgroundOpacity="opaque"
					onClick={()=>{btn_bgColor_setOpen(btn_bgColor_Open+1)}}
					onMouseOut={btn_bgColor_resetval}
					onMouseOver={()=>{btn_bgColor_setval(btn_bgColor_img[1]); btn_bgColor_isovered.current=true}}>
				</Button>
			</Cell>
            <Cell shrink>
                {btn_bgColor_Open%2 == 1 && <ChromeColorBox color={bgColor} onChange_callfunc={(e)=>{setbgColor(e.hex)}}/>}
            </Cell>                                               
		</Column>
	);
};

export const Btn_penColor = ({penColor, setpenColor, penOpacity, setpenOpacity}) => {
    const [btn_penColor_Open,btn_penColor_setOpen] = useState(0);
    const btn_penColor_isovered = useRef(false);
	const btn_penColor_img = ['./pencolor1.png','./pencolor2.png'];
	const [btn_penColor_val,btn_penColor_setval] = useState(btn_penColor_img[0]);
	const btn_penColor_resetval = () => {
		if (btn_penColor_isovered.current == true) {
			btn_penColor_setval(btn_penColor_img[0]);
			btn_penColor_isovered.current = false;
		}
	};

    return (
        <Column align = "center">
            <Cell>
                <Button className='btn_penColor'
                    icon={true}
                    iconComponent={<img src={btn_penColor_val} alt="penColor" style={{height:'75%'}} />}
                    iconOnly
                    backgroundOpacity="opaque"
                    onClick={()=>{btn_penColor_setOpen(btn_penColor_Open+1)}}
                    onMouseOut={btn_penColor_resetval}
                    onMouseOver={()=>{btn_penColor_setval(btn_penColor_img[1]); btn_penColor_isovered.current=true}}
                />
            </Cell>
            <Cell shrink> 
                {btn_penColor_Open%3 == 1 && <ChromeColorBox color={penColor} onChange_callfunc={(e)=>{setpenColor(e.hex)}}/>}
                {btn_penColor_Open%3 == 2 && <input type="range" min="0" max="256" defaultValue={penOpacity} onChange={(e)=>{setpenOpacity(Number(e.target.value))}}/>}
            </Cell>
        </Column>
    );
};

export const Btn_penWidth = ({penWidth, setpenWidth}) => {
    const [btn_penWidth_Open,btn_penWidth_setOpen] = useState(0);
    const btn_penWidth_isovered = useRef(false);
	const btn_penWidth_img = ['./thickness1.png','./thickness2.png'];
	const [btn_penWidth_val,btn_penWidth_setval] = useState(btn_penWidth_img[0]);
	const btn_penWidth_resetval = () => {
		if (btn_penWidth_isovered.current == true) {
			btn_penWidth_setval(btn_penWidth_img[0]);
			btn_penWidth_isovered.current = false;
		}
	};

    return (
        <Column align = "center">
            <Cell>
                <Button className='btn_penWidth'
                    icon={true}
                    iconComponent={<img src={btn_penWidth_val} alt="penWidth" style={{height:'75%'}} />}
                    iconOnly
                    backgroundOpacity="opaque"
                    onClick={()=>{btn_penWidth_setOpen(btn_penWidth_Open+1)}}
                    onMouseOut={btn_penWidth_resetval}
                    onMouseOver={()=>{btn_penWidth_setval(btn_penWidth_img[1]); btn_penWidth_isovered.current=true}}
                />
            </Cell>
            <Cell shrink>
                {btn_penWidth_Open%2 == 1 && <input type="range" defaultValue={penWidth} onChange={(e)=>{setpenWidth(Number(e.target.value))}}/>}
            </Cell>
        </Column>
    );
};

export const Btn_shadowColor = ({shadowColor, setshadowColor}) => {
    const [btn_shadowColor_Open,btn_shadowColor_setOpen] = useState(0);
    const btn_shadowColor_isovered = useRef(false);
	const btn_shadowColor_img = ['./shadowColor1.png','./shadowColor2.png'];
	const [btn_shadowColor_val,btn_shadowColor_setval] = useState(btn_shadowColor_img[0]);
	const btn_shadowColor_resetval = () => {
		if (btn_shadowColor_isovered.current == true) {
			btn_shadowColor_setval(btn_shadowColor_img[0]);
			btn_shadowColor_isovered.current = false;
		}
	};

    return (
        <Column align = "center">
            <Cell>
                <Button className='btn_shadowColor'
                    icon={true}
                    iconComponent={<img src={btn_shadowColor_val} alt="shadowColor" style={{height:'75%'}} />}
                    iconOnly
                    backgroundOpacity="opaque"
                    onClick={()=>{btn_shadowColor_setOpen(btn_shadowColor_Open+1)}}
                    onMouseOut={btn_shadowColor_resetval}
                    onMouseOver={()=>{btn_shadowColor_setval(btn_shadowColor_img[1]); btn_shadowColor_isovered.current=true}}
                />
            </Cell>
            <Cell shrink>
                {btn_shadowColor_Open%2 == 1 && <ChromeColorBox color={shadowColor} onChange_callfunc={(e)=>{setshadowColor(e.hex)}}/>}
            </Cell>
        </Column>
    );
};

export const Btn_shadowWidth = ({shadowWidth, setshadowWidth}) => {
    const [btn_shadowWidth_Open,btn_shadowWidth_setOpen] = useState(0);
    const btn_shadowWidth_isovered = useRef(false);
	const btn_shadowWidth_img = ['./shadow1.png','./shadow2.png'];
	const [btn_shadowWidth_val,btn_shadowWidth_setval] = useState(btn_shadowWidth_img[0]);
	const btn_shadowWidth_resetval = () => {
		if (btn_shadowWidth_isovered.current == true) {
			btn_shadowWidth_setval(btn_shadowWidth_img[0]);
			btn_shadowWidth_isovered.current = false;
		}
	};

    return (
        <Column align = "center">
            <Cell>
                <Button className='btn_shadowWidth'
                    icon={true}
                    iconComponent={<img src={btn_shadowWidth_val} alt="shadowWidth" style={{height:'75%'}} />}
                    iconOnly
                    backgroundOpacity="opaque"
                    onClick={()=>{btn_shadowWidth_setOpen(btn_shadowWidth_Open+1)}}
                    onMouseOut={btn_shadowWidth_resetval}
                    onMouseOver={()=>{btn_shadowWidth_setval(btn_shadowWidth_img[1]); btn_shadowWidth_isovered.current=true}}
                />
            </Cell>
            <Cell shrink>
                {btn_shadowWidth_Open%2 == 1 && <input type="range" defaultValue={shadowWidth} onChange={(e)=>{setshadowWidth(Number(e.target.value))}}/>}
            </Cell>
        </Column>
    );
};

export const Btn_penType = ({penType, setpenType}) => {
    const btn_penType_opt = ['Pencil', 'Circle', 'Spray', 'Eraser'];

    const [btn_penType_Open,btn_penType_setOpen] = useState(0);
    const btn_penType_isovered = useRef(false);
	const btn_penType_img = ['./penType1.png','./penType2.png'];
	const [btn_penType_val,btn_penType_setval] = useState(btn_penType_img[0]);
	const btn_penType_resetval = () => {
		if (btn_penType_isovered.current == true) {
			btn_penType_setval(btn_penType_img[0]);
			btn_penType_isovered.current = false;
		}
	};

    return (
        <Column align = "center">
            <Cell>
                <Button className='btn_penType'
                    icon={true}
                    iconComponent={<img src={btn_penType_val} alt="penType" style={{height:'75%'}} />}
                    iconOnly
                    backgroundOpacity="opaque"
                    onClick={()=>{btn_penType_setOpen(btn_penType_Open+1)}}
                    onMouseOut={btn_penType_resetval}
                    onMouseOver={()=>{btn_penType_setval(btn_penType_img[1]); btn_penType_isovered.current=true}}
                />
            </Cell>

            <Cell shrink >
                {btn_penType_Open%2 == 1 &&  <Dropdown defaultSelected={0} width="tiny" onSelect={(e)=>{setpenType(e.data)}}
                                                        style={{position: 'absolute', left:'-200px', top:'20px', zIndex:'3'}}>
                                                {btn_penType_opt}
                                            </Dropdown>}
            </Cell>
        </Column>
    );
};


export const Btn_Copy = ({Copy, setCopy}) => {
    const [btn_Copy_Open,btn_Copy_setOpen] = useState(0);
    const btn_Copy_isovered = useRef(false);
	const btn_Copy_img = ['./Copy1.png','./Copy2.png'];
	const [btn_Copy_val,btn_Copy_setval] = useState(btn_Copy_img[0]);
	const btn_Copy_resetval = () => {
		if (btn_Copy_isovered.current == true) {
			btn_Copy_setval(btn_Copy_img[0]);
			btn_Copy_isovered.current = false;
		}
	};

    return (
        <Button className='btn_Copy' style={{position:'relative', top:'-20px'}}
            icon={true}
            iconComponent={<img src={btn_Copy_val} alt="Copy" style={{height:'75%'}} />}
            iconOnly
            backgroundOpacity="opaque"
            onClick={()=>{btn_Copy_setOpen(btn_Copy_Open+1); setCopy(true)}}
            onMouseOut={btn_Copy_resetval}
            onMouseOver={()=>{btn_Copy_setval(btn_Copy_img[1]); btn_Copy_isovered.current=true}}
        />
    );
};

export const Btn_Undo = ({Undo, setUndo}) => {
    const [btn_Undo_Open,btn_Undo_setOpen] = useState(0);
    const btn_Undo_isovered = useRef(false);
	const btn_Undo_img = ['./Undo1.png','./Undo2.png'];
	const [btn_Undo_val,btn_Undo_setval] = useState(btn_Undo_img[0]);
	const btn_Undo_resetval = () => {
		if (btn_Undo_isovered.current == true) {
			btn_Undo_setval(btn_Undo_img[0]);
			btn_Undo_isovered.current = false;
		}
	};

    return (
        <Button style={{position:'relative', top:'-60px'}}
            className='btn_Undo'
            icon={true}
            iconComponent={<img src={btn_Undo_val} alt="Undo" style={{height:'75%'}} />}
            iconOnly
            backgroundOpacity="opaque"
            onClick={()=>{btn_Undo_setOpen(btn_Undo_Open+1); setUndo(true)}}
            onMouseOut={btn_Undo_resetval}
            onMouseOver={()=>{btn_Undo_setval(btn_Undo_img[1]); btn_Undo_isovered.current=true}}
        />
    );
};

export const Btn_Redo = ({Redo, setRedo}) => {
    const [btn_Redo_Open,btn_Redo_setOpen] = useState(0);
    const btn_Redo_isovered = useRef(false);
	const btn_Redo_img = ['./Redo1.png','./Redo2.png'];
	const [btn_Redo_val,btn_Redo_setval] = useState(btn_Redo_img[0]);
	const btn_Redo_resetval = () => {
		if (btn_Redo_isovered.current == true) {
			btn_Redo_setval(btn_Redo_img[0]);
			btn_Redo_isovered.current = false;
		}
	};

    return (
        <Button style={{position:'relative', top:'-40px'}} 
            className='btn_Redo'
            icon={true}
            iconComponent={<img src={btn_Redo_val} alt="Redo" style={{height:'75%'}} />}
            iconOnly
            backgroundOpacity="opaque"
            onClick={()=>{btn_Redo_setOpen(btn_Redo_Open+1); setRedo(true)}}
            onMouseOut={btn_Redo_resetval}
            onMouseOver={()=>{btn_Redo_setval(btn_Redo_img[1]); btn_Redo_isovered.current=true}}
        />
    );
};

export const Btn_Delete = ({Delete, setDelete}) => {
    const [btn_Delete_Open,btn_Delete_setOpen] = useState(0);
    const btn_Delete_isovered = useRef(false);
	const btn_Delete_img = ['./Delete1.png','./Delete2.png'];
	const [btn_Delete_val,btn_Delete_setval] = useState(btn_Delete_img[0]);
	const btn_Delete_resetval = () => {
		if (btn_Delete_isovered.current == true) {
			btn_Delete_setval(btn_Delete_img[0]);
			btn_Delete_isovered.current = false;
		}
	};

    return (
        <Column align = "center">
            <Cell>
                <Button className='btn_Delete'
                    icon={true}
                    iconComponent={<img src={btn_Delete_val} alt="Delete" style={{height:'75%'}} />}
                    iconOnly
                    backgroundOpacity="opaque"
                    onClick={()=>{btn_Delete_setOpen(btn_Delete_Open+1); setDelete(true)}}
                    onMouseOut={btn_Delete_resetval}
                    onMouseOver={()=>{btn_Delete_setval(btn_Delete_img[1]); btn_Delete_isovered.current=true}}
                />
            </Cell>
        </Column>
    );
};


export const Btn_DrawInput = ({DrawInput, setDrawInput}) => {
    const [btn_DrawInput_Open,btn_DrawInput_setOpen] = useState(0);
    const btn_DrawInput_isovered = useRef(false);
	const btn_DrawInput_img = ['./DrawInput1.png','./DrawInput2.png'];
	const [btn_DrawInput_val,btn_DrawInput_setval] = useState(btn_DrawInput_img[0]);
	const btn_DrawInput_resetval = () => {
		if (btn_DrawInput_isovered.current == true) {
			btn_DrawInput_setval(btn_DrawInput_img[0]);
			btn_DrawInput_isovered.current = false;
		}
	};

    return (
        <Column align = "center">
            <Cell>
                <Button className='btn_DrawInput'
                    icon={true}
                    iconComponent={<img src={btn_DrawInput_val} alt="Input" style={{height:'75%'}} />}
                    iconOnly
                    backgroundOpacity="opaque"
                    onClick={()=>{btn_DrawInput_setOpen(btn_DrawInput_Open+1); setDrawInput(true)}}
                    onMouseOut={btn_DrawInput_resetval}
                    onMouseOver={()=>{btn_DrawInput_setval(btn_DrawInput_img[1]); btn_DrawInput_isovered.current=true}}
                />
            </Cell>
        </Column>
    );
};


export const Btn_polyType = ({polyType, setpolyType, PolyNum, setPolyNum}) => {
    const btn_polyType_opt = ['None','Line','Triangle','Square','Circle','Polygon'];

    const [btn_polyType_Open,btn_polyType_setOpen] = useState(0);
    const btn_polyType_isovered = useRef(false);
	const btn_polyType_img = ['./addPolygon1.png','./addPolygon2.png'];
	const [btn_polyType_val,btn_polyType_setval] = useState(btn_polyType_img[0]);
	const btn_polyType_resetval = () => {
		if (btn_polyType_isovered.current == true) {
			btn_polyType_setval(btn_polyType_img[0]);
			btn_polyType_isovered.current = false;
		}
	};

    return (
        <Column align = "center">
            <Cell>
                <Button className='btn_polyType'
                    icon={true}
                    iconComponent={<img src={btn_polyType_val} alt="polyType" style={{height:'75%'}} />}
                    iconOnly
                    backgroundOpacity="opaque"
                    onClick={()=>{btn_polyType_setOpen(btn_polyType_Open+1)}}
                    onMouseOut={btn_polyType_resetval}
                    onMouseOver={()=>{btn_polyType_setval(btn_polyType_img[1]); btn_polyType_isovered.current=true}}
                />
            </Cell>
            <Cell shrink >
                {(btn_polyType_Open%2 == 1 && polyType=='Polygon') && <input type="range" min="3" max="12" step='1' defaultValue={PolyNum} onChange={(e)=>{setPolyNum(Number(e.target.value))}}/>}
            </Cell>
            <Cell shrink >
                {btn_polyType_Open%2 == 1 &&  <Dropdown defaultSelected={0} width="tiny" onSelect={(e)=>{setpolyType(e.data)}}
                                                            style={{position: 'absolute', left:'-200px', top:'20px', zIndex:'3'}}>
                                                    {btn_polyType_opt}
                                            </Dropdown>}
            </Cell>
        </Column>
    );
};

export const Btn_TextBox = ({TextSize, setTextSize, TextFont, setTextFont, TextOpen, setTextOpen,penColor,penOpacity,canvas}) => {
    const btn_TextBox_opt = ['Normal','Bold','italic','Bold italic'];
    const [TextInput, setTextInput] = useState('');

    const btn_TextBox_isovered = useRef(false);
	const btn_TextBox_img = ['./addText1.png','./addText2.png'];
	const [btn_TextBox_val,btn_TextBox_setval] = useState(btn_TextBox_img[0]);
	const btn_TextBox_resetval = () => {
		if (btn_TextBox_isovered.current == true) {
			btn_TextBox_setval(btn_TextBox_img[0]);
			btn_TextBox_isovered.current = false;
		}
	};

    return (
        <Column align = "center">
            <Cell>
                <Button className='btn_TextBox'
                    icon={true}
                    iconComponent={<img src={btn_TextBox_val} alt="TextBox" style={{height:'75%'}} />}
                    iconOnly
                    backgroundOpacity="opaque"
                    onClick={()=>{setTextOpen(true)}}
                    onMouseOut={btn_TextBox_resetval}
                    onMouseOver={()=>{btn_TextBox_setval(btn_TextBox_img[1]); btn_TextBox_isovered.current=true}}
                />
            </Cell>

            <Alert type="overlay" open={TextOpen} onClose={()=>{setTextOpen(false)}} style={{height:'600px'}}>
                    <h2 style={{textAlign: 'center', fontWeight:'900', fontSize:"48px"}}>Create TextBox</h2>
                    <Column>
                        <Cell style={{position:'relative', left:'170px'}}>
                            TextSize : <input type="range" min="8" max="240" defaultValue={TextSize} onChange={(e)=>{setTextSize(Number(e.target.value))}}/>
                        </Cell>
                        <Cell style={{position:'relative', left:'390px', top:'30px'}}>
                            <div style={{position:'relative', left:'-270px', top:'30px'}}>TextFont  :</div>
                            <Dropdown defaultSelected={0} width="tiny" onSelect={(e)=>{setTextFont(e.data)}}
                                                style={{position: 'absolute', left:'-160px', top:'20px', zIndex:'3'}}>
                                                    {btn_TextBox_opt}
                                        </Dropdown>
                        </Cell>
                        <Cell style={{position:'relative', top:'100px', left:'-30px'}}>
                            <InputField
                                type="text"
                                value={TextInput}
                                onChange={(e)=>{setTextInput(e.value)}}
                                placeholder="Enter the string to create"
                                style={{backgroundColor:'rgba(64, 64, 64, .75)'}}
                            />
                        </Cell>
                        <Row style={{position:'relative',top:'150px',left:'30px'}}>
                            <Cell>
                                <Button
                                    size="small"
                                    className={css.buttonCell}
                                    onClick={()=>{Draw_TextBox(canvas,penColor,penOpacity,TextSize,TextFont,TextInput)}}>
                                    Add
                                </Button>
                            </Cell>
                            <Cell>
                                <Button
                                    size="small"
                                    className={css.buttonCell}
                                    onClick={()=>{setTextOpen(false)}}>
                                    Cancel
                                </Button>
                            </Cell>
                        </Row>
                    </Column>
            </Alert>
        </Column>
    );
};


export const Btn_AiTool = ({setsaveTextAi, CanvasTitle ,canvas, DrawInput_prompt, setDrawInput_prompt, DrawImageAi, setDrawImageAi, DrawImageAi_Alpha, DrawImageAi_setAlpha}) => {
    const [btn_AiTool_Open,btn_AiTool_setOpen] = useState(false);
    const [btn_ImageAi_Open,btn_ImageAi_setOpen] = useState(false);
    const [btn_TextAi_Open,btn_TextAi_setOpen] = useState(false);
    const [btn_ImageAi_Pop_Open, btn_ImageAi_Pop_setOpen] = useState(false);
    const btn_AiTool_isovered = useRef(false);
    const btn_ImageAi_isovered = useRef(false);
    const btn_TextAi_isovered = useRef(false);
	const btn_AiTool_img = ['./AiTool1.png','./AiTool2.png'];
    const btn_ImageAi_img = ['./ImageAi1.png','./ImageAi2.png'];
    const btn_TextAi_img = ['./TextAi1.png','./TextAi2.png'];
	const [btn_AiTool_val,btn_AiTool_setval] = useState(btn_AiTool_img[0]);
    const [btn_ImageAi_val,btn_ImageAi_setval] = useState(btn_ImageAi_img[0]);
    const [btn_TextAi_val,btn_TextAi_setval] = useState(btn_TextAi_img[0]);
	const btn_AiTool_resetval = () => {
		if (btn_AiTool_isovered.current == true) {
			btn_AiTool_setval(btn_AiTool_img[0]);
			btn_AiTool_isovered.current = false;
		}
	};
    const btn_ImageAi_resetval = () => {
		if (btn_ImageAi_isovered.current == true) {
			btn_ImageAi_setval(btn_ImageAi_img[0]);
			btn_ImageAi_isovered.current = false;
		}
	};
    const btn_TextAi_resetval = () => {
		if (btn_TextAi_isovered.current == true) {
			btn_TextAi_setval(btn_TextAi_img[0]);
			btn_TextAi_isovered.current = false;
		}
	};

    return (
        <Column align = "center">
            <Cell>
                <Button className='btn_AiTool'
                    icon={true}
                    iconComponent={<img src={btn_AiTool_val} alt="AiTool" style={{height:'75%'}} />}
                    iconOnly
                    backgroundOpacity="opaque"
                    onClick={()=>{btn_AiTool_setOpen(true)}}
                    onMouseOut={btn_AiTool_resetval}
                    onMouseOver={()=>{btn_AiTool_setval(btn_AiTool_img[1]); btn_AiTool_isovered.current=true}}
                />
            </Cell>

            <Alert type="overlay" open={btn_AiTool_Open} onClose={()=>{btn_AiTool_setOpen(false)}} style={{height:'500px'}}>
                    <h2 style={{textAlign: 'center', fontWeight:'900'}}>Ai Generation Tools</h2>
                    <Column>
                        <Cell style={{position:'relative', left:'70px'}}>
                                Ai Image Generator : <Button className='btn_ImageAi'
                                    icon={true}
                                    iconComponent={<img src={btn_ImageAi_val} alt="ImageAi" style={{height:'75%'}} />}
                                    iconOnly
                                    backgroundOpacity="opaque"
                                    onClick={()=>{btn_AiTool_setOpen(false); btn_ImageAi_setOpen(true)}}
                                    onMouseOut={btn_ImageAi_resetval}
                                    onMouseOver={()=>{btn_ImageAi_setval(btn_ImageAi_img[1]); btn_ImageAi_isovered.current=true}}
                                /> 
                        </Cell>
                        <Cell style={{position:'relative', left:'70px', top:'40px'}}>
                        Ai Canvas Text Scanner : <Button className='btn_TextAi'
                                    icon={true}
                                    iconComponent={<img src={btn_TextAi_val} alt="TextAi" style={{height:'75%'}} />}
                                    iconOnly
                                    backgroundOpacity="opaque"
                                    onClick={()=>{btn_AiTool_setOpen(false); btn_TextAi_setOpen(true);  setsaveTextAi(true)}}
                                    onMouseOut={btn_TextAi_resetval}
                                    onMouseOver={()=>{btn_TextAi_setval(btn_TextAi_img[1]); btn_TextAi_isovered.current=true}}
                                /> 
                        </Cell>
                        <Row style={{position:'relative',top:'80px',left:'160px'}}>
                            <Cell>
                                <Button
                                    size="small"
                                    className={css.buttonCell}
                                    onClick={()=>{btn_AiTool_setOpen(false)}}>
                                    Cancel
                                </Button>
                            </Cell>
                        </Row>
                    </Column>
            </Alert>

            <Alert type="overlay" open={btn_ImageAi_Open} onClose={()=>{btn_ImageAi_setOpen(false)}} style={{height:'500px'}}>
                    <h2 style={{textAlign: 'center', fontWeight:'900'}}>Ai Image Generator</h2>
                    <Column>
                        <Cell style={{position:'relative', left:'70px'}}>
                            <InputField
                                    type="text"
                                    value={DrawInput_prompt}
                                    onChange={(e)=>{setDrawInput_prompt(e.value)}}
                                    placeholder="Enter the Image title to create"
                                    style={{backgroundColor:'rgba(64, 64, 64, .75)', width:'100%',left:'-85px',top:'10px'}}
                            />
                        </Cell>
                        <Cell style={{position:'relative', top:'50px', left:'120px'}}>
                            Image Opacity : <input type="range" min="0" max="256" style={{width:'30%', height:'100%'}} 
                                defaultValue={DrawImageAi_Alpha} onChange={(e)=>{DrawImageAi_setAlpha(Number(e.target.value))}}/>
                        </Cell>
                        <Row style={{position:'relative',top:'100px',left:'20px'}}>
                            <Cell>
                                <Button
                                    size="small"
                                    className={css.buttonCell}
                                    onClick={()=>{btn_ImageAi_setOpen(false); DrawInput_prompt.length > 0 ? (setDrawImageAi(true),btn_ImageAi_Pop_setOpen(true)) : null}}>
                                    Generate
                                </Button>
                            </Cell>
                            <Cell>
                                <Button
                                    size="small"
                                    className={css.buttonCell}
                                    onClick={()=>{btn_ImageAi_setOpen(false)}}>
                                    Cancel
                                </Button>
                            </Cell>
                        </Row>
                    </Column>
            </Alert>

            <Alert type="overlay" open={btn_ImageAi_Pop_Open} onClose={()=>{btn_ImageAi_Pop_setOpen(false)}} style={{height:'360px'}}>
                    <h2 style={{textAlign: 'center', fontWeight:'900'}}>Ai Image Generator</h2>
                    <Column>
                        <Cell style={{position:'relative'}}>
                            <div style={{textAlign:'center'}}>'{DrawInput_prompt}' is being generated...</div>
                            <div style={{textAlign:'center'}}>This takes about 10 seconds.</div>
                        </Cell>
                        <Row style={{position:'relative',top:'40px',left:'160px'}}>
                            <Cell>
                                <Button
                                    size="small"
                                    className={css.buttonCell}
                                    onClick={()=>{btn_ImageAi_Pop_setOpen(false)}}>
                                    OK
                                </Button>
                            </Cell>
                        </Row>
                    </Column>
            </Alert>
            <Alert type="overlay" open={btn_TextAi_Open} onClose={()=>{btn_TextAi_setOpen(false)}} style={{height:'420px'}}>
                    <h2 style={{textAlign: 'center', fontWeight:'900'}}>Ai Text Scanner Generator</h2>
                    <Column>
                        <Cell style={{position:'relative'}}>
                            <div style={{textAlign:'center'}}>'{CanvasTitle}'s Text is being generated...</div>
                            <div style={{textAlign:'center'}}>This takes about 5 seconds.</div>
                        </Cell>
                        <Row style={{position:'relative',top:'40px',left:'160px'}}>
                            <Cell>
                                <Button
                                    size="small"
                                    className={css.buttonCell}
                                    onClick={()=>{btn_TextAi_setOpen(false)}}>
                                    OK
                                </Button>
                            </Cell>
                        </Row>
                    </Column>
            </Alert>
        </Column>
    );
};




export const Btn_addCanvas = ({CanvasList, setaddCanvasNum, addCanvas, setaddCanvas}) => {
    const [addCanvas_Open,addCanvas_setOpen] = useState(false);
    const [btn_addCanvas_Open,btn_addCanvas_setOpen] = useState(0);
    const btn_addCanvas_isovered = useRef(false);
	const btn_addCanvas_img = ['./AddCanvas1.png','./AddCanvas2.png'];
	const [btn_addCanvas_val,btn_addCanvas_setval] = useState(btn_addCanvas_img[0]);
	const btn_addCanvas_resetval = () => {
		if (btn_addCanvas_isovered.current == true) {
			btn_addCanvas_setval(btn_addCanvas_img[0]);
			btn_addCanvas_isovered.current = false;
		}
	};

    return (
        <Column align = "center">
            <Cell>
                <Button className='btn_addCanvas' style={{position:'relative', top:'-40px'}}
                    icon={true}
                    iconComponent={<img src={btn_addCanvas_val} alt="addCanvas" style={{height:'75%'}} />}
                    iconOnly
                    backgroundOpacity="opaque"
                    onClick={()=>{btn_addCanvas_setOpen(btn_addCanvas_Open+1); addCanvas_setOpen(true)}}
                    onMouseOut={btn_addCanvas_resetval}
                    onMouseOver={()=>{btn_addCanvas_setval(btn_addCanvas_img[1]); btn_addCanvas_isovered.current=true}}
                />
            </Cell>
            <Alert type="overlay" open={addCanvas_Open} onClose={()=>{addCanvas_setOpen(false)}} style={{height:'400px'}}>
                    <h2 style={{textAlign: 'center', fontWeight:'900'}}>Add Canvas</h2>
                    <Column>
                        <Cell style={{position:'relative', top:'-50px'}}>
							<h3 style={{textAlign:'center'}}>Choose a Painting to Add</h3>
                        </Cell>
                        <Cell style={{position:'relative', top:'-80px', left:'0px'}}>
                            <Dropdown defaultSelected={0} width="x-large" onSelect={(e)=>{setaddCanvasNum(e.selected)}}
                                        style={{position: 'absolute', top:'20px', zIndex:'3', width:'200px'}}>
                                    {CanvasList}
                            </Dropdown>
                        </Cell>
                        <Row style={{position:'relative',top:'30px',left:'60px'}}>
                            <Cell>
                                <Button
                                    size="small"
                                    onClick={()=>{addCanvas_setOpen(false); setaddCanvas(true);}}>
                                    Confirm
                                </Button>
                            </Cell>
                            <Cell>
                                <Button
                                    size="small"
                                    onClick={()=>{addCanvas_setOpen(false)}}>
                                    Cancel
                                </Button>
                            </Cell>
                        </Row>
                    </Column>
            </Alert>
        </Column>
    );
};

export const Btn_saveCanvas = ({CanvasTitle ,saveCanvas, setsaveCanvas, setTitleInput, TitleInput, setsavetitle, setsavetitleAi}) => {
    const [btn_saveCanvas_Open,btn_saveCanvas_setOpen] = useState(0);
    const btn_saveCanvas_isovered = useRef(false);
	const btn_saveCanvas_img = ['./saveCanvas1.png','./saveCanvas2.png'];
	const [btn_saveCanvas_val,btn_saveCanvas_setval] = useState(btn_saveCanvas_img[0]);
	const btn_saveCanvas_resetval = () => {
		if (btn_saveCanvas_isovered.current == true) {
			btn_saveCanvas_setval(btn_saveCanvas_img[0]);
			btn_saveCanvas_isovered.current = false;
		}
	};
    const [btn_titleAi_Open,btn_titleAi_setOpen] = useState(false);
    const btn_titleAi_isovered = useRef(false);
	const btn_titleAi_img = ['./title_Ai1.png','./title_Ai2.png'];
	const [btn_titleAi_val,btn_titleAi_setval] = useState(btn_titleAi_img[0]);
	const btn_titleAi_resetval = () => {
		if (btn_titleAi_isovered.current == true) {
			btn_titleAi_setval(btn_titleAi_img[0]);
			btn_titleAi_isovered.current = false;
		}
	};
    const [btn_titleN_Open,btn_titleN_setOpen] = useState(false);
    const btn_titleN_isovered = useRef(false);
	const btn_titleN_img = ['./title1.png','./title2.png'];
	const [btn_titleN_val,btn_titleN_setval] = useState(btn_titleN_img[0]);
	const btn_titleN_resetval = () => {
		if (btn_titleN_isovered.current == true) {
			btn_titleN_setval(btn_titleN_img[0]);
			btn_titleN_isovered.current = false;
		}
	};


    const [btn_SaveTool_Open, btn_SaveTool_setOpen] = useState(false);

    return (
        <Column align = "center">
            <Cell>
                <Button className='btn_saveCanvas' style={{position:'relative', top:'-60px'}}
                    icon={true}
                    iconComponent={<img src={btn_saveCanvas_val} alt="saveCanvas" style={{height:'75%'}} />}
                    iconOnly
                    backgroundOpacity="opaque"
                    onClick={()=>{btn_saveCanvas_setOpen(btn_saveCanvas_Open+1); btn_SaveTool_setOpen(true)}}
                    onMouseOut={btn_saveCanvas_resetval}
                    onMouseOver={()=>{btn_saveCanvas_setval(btn_saveCanvas_img[1]); btn_saveCanvas_isovered.current=true}}
                />
            </Cell>

            <Alert type="overlay" open={btn_SaveTool_Open} onClose={()=>{btn_SaveTool_setOpen(false)}} style={{height:'500px'}}>
                    <h2 style={{textAlign: 'center', fontWeight:'900'}}>Canvas Save Options</h2>
                    <Column>
                        <Cell style={{position:'relative', left:'70px'}}>
                        Save Canvas Title : <Button className='btn_titleN'
                                    icon={true}
                                    iconComponent={<img src={btn_titleN_val} alt="titleN" style={{height:'75%'}} />}
                                    iconOnly
                                    backgroundOpacity="opaque"
                                    onClick={()=>{btn_SaveTool_setOpen(false); btn_titleN_setOpen(true)}}
                                    onMouseOut={btn_titleN_resetval}
                                    onMouseOver={()=>{btn_titleN_setval(btn_titleN_img[1]); btn_titleN_isovered.current=true}}
                                /> 
                        </Cell>
                        <Cell style={{position:'relative', left:'70px', top:'40px'}}>
                        Ai Canvas Title Generator : <Button className='btn_titleAi'
                                    icon={true}
                                    iconComponent={<img src={btn_titleAi_val} alt="titleAi" style={{height:'75%'}} />}
                                    iconOnly
                                    backgroundOpacity="opaque"
                                    onClick={()=>{btn_SaveTool_setOpen(false); btn_titleAi_setOpen(true); setsavetitleAi(true)}}
                                    onMouseOut={btn_titleAi_resetval}
                                    onMouseOver={()=>{btn_titleAi_setval(btn_titleAi_img[1]); btn_titleAi_isovered.current=true}}
                                /> 
                        </Cell>
                        <Row style={{position:'relative',top:'80px',left:'20px'}}>
                            <Cell>
                                <Button
                                    size="small"
                                    className={css.buttonCell}
                                    onClick={()=>{btn_SaveTool_setOpen(false); setsaveCanvas(true)}}>
                                    Save
                                </Button>
                            </Cell>
                            <Cell>
                                <Button
                                    size="small"
                                    className={css.buttonCell}
                                    onClick={()=>{btn_SaveTool_setOpen(false);}}>
                                    Cancel
                                </Button>
                            </Cell>
                        </Row>
                    </Column>
            </Alert>

            <Alert type="overlay" open={btn_titleN_Open} onClose={()=>{btn_titleN_setOpen(false)}} style={{height:'400px'}}>
                    <h2 style={{textAlign: 'center', fontWeight:'900'}}>Save Canvas Title</h2>
                    <Column>
                        <Cell style={{position:'relative', left:'70px'}}>
                            <InputField
                                    type="text"
                                    value={TitleInput}
                                    onChange={(e)=>{setTitleInput(e.value)}}
                                    placeholder="Enter a name for the sketch."
                                    style={{backgroundColor:'rgba(64, 64, 64, .75)', width:'100%',left:'-85px',top:'10px'}}
                            />
                        </Cell>
                        <Row style={{position:'relative',top:'60px',left:'20px'}}>
                            <Cell>
                                <Button
                                    size="small"
                                    className={css.buttonCell}
                                    onClick={()=>{btn_titleN_setOpen(false); setsavetitle(true)}}>
                                    Confirm
                                </Button>
                            </Cell>
                            <Cell>
                                <Button
                                    size="small"
                                    className={css.buttonCell}
                                    onClick={()=>{btn_titleN_setOpen(false)}}>
                                    Cancel
                                </Button>
                            </Cell>
                        </Row>
                    </Column>
            </Alert>
            <Alert type="overlay" open={btn_titleAi_Open} onClose={()=>{btn_titleAi_setOpen(false)}} style={{height:'360px'}}>
                    <h2 style={{textAlign: 'center', fontWeight:'900'}}>Ai Canvas Title Generator</h2>
                    <Column>
                        <Cell style={{position:'relative'}}>
                            <div style={{textAlign:'center'}}>'{CanvasTitle}'s Title is being generated...</div>
                            <div style={{textAlign:'center'}}>This takes about 5 seconds.</div>
                        </Cell>
                        <Row style={{position:'relative',top:'40px',left:'160px'}}>
                            <Cell>
                                <Button
                                    size="small"
                                    className={css.buttonCell}
                                    onClick={()=>{btn_titleAi_setOpen(false)}}>
                                    OK
                                </Button>
                            </Cell>
                        </Row>
                    </Column>
            </Alert>
        </Column>
    );
};

export const Btn_deleteCanvas = ({deleteCanvas, setdeleteCanvas, CanvasTitle}) => {
    const [deleteCanvas_Open, deleteCanvas_setOpen] = useState(false);
    const [btn_deleteCanvas_Open,btn_deleteCanvas_setOpen] = useState(0);
    const btn_deleteCanvas_isovered = useRef(false);
	const btn_deleteCanvas_img = ['./Trash1.png','./Trash2.png'];
	const [btn_deleteCanvas_val,btn_deleteCanvas_setval] = useState(btn_deleteCanvas_img[0]);
	const btn_deleteCanvas_resetval = () => {
		if (btn_deleteCanvas_isovered.current == true) {
			btn_deleteCanvas_setval(btn_deleteCanvas_img[0]);
			btn_deleteCanvas_isovered.current = false;
		}
	};

    return (
        <Column align = "center">
            <Cell>
                <Button className='btn_deleteCanvas'
                    icon={true}
                    iconComponent={<img src={btn_deleteCanvas_val} alt="deleteCanvas" style={{height:'75%'}} />}
                    iconOnly
                    backgroundOpacity="opaque"
                    onClick={()=>{btn_deleteCanvas_setOpen(btn_deleteCanvas_Open+1); deleteCanvas_setOpen(true)}}
                    onMouseOut={btn_deleteCanvas_resetval}
                    onMouseOver={()=>{btn_deleteCanvas_setval(btn_deleteCanvas_img[1]); btn_deleteCanvas_isovered.current=true}}
                />
            </Cell>
            <Alert type="overlay" open={deleteCanvas_Open} onClose={()=>{deleteCanvas_setOpen(false)}} style={{height:'500px'}} >
                <h2 style={{textAlign:'center'}}>{$L('Delete Painting\n')}</h2>
                <div style={{textAlign:'center'}}>Are you sure you want to delete this painting?</div>
                <h3  style={{textAlign:'center'}}>{CanvasTitle}</h3>
                <div style={{textAlign:'center'}}>Deleted paintings cannot be recovered.</div>
                <Row align = "center" style={{position:'relative', top:'30px', left:'20px'}}>
                    <Cell>
                        <Button
                            size="small"
                            className={css.buttonCell}
                            onClick={()=>{deleteCanvas_setOpen(false); setdeleteCanvas(true)}}>
                            {$L('Yes')}
                        </Button>
                    </Cell>
                    <Cell>
                        <Button
                            size="small"
                            className={css.buttonCell}
                            onClick={()=>{deleteCanvas_setOpen(false)}}>
                            {$L('No')}
                        </Button>
                    </Cell>
                </Row>
            </Alert>
        </Column>
    );
};

export const Btn_loadChart = ({setcurPage}) => {
    const [btn_loadChart_Open,btn_loadChart_setOpen] = useState(0);
    const btn_loadChart_isovered = useRef(false);
	const btn_loadChart_img = ['./Chart1.png','./Chart2.png'];
	const [btn_loadChart_val,btn_loadChart_setval] = useState(btn_loadChart_img[0]);
	const btn_loadChart_resetval = () => {
		if (btn_loadChart_isovered.current == true) {
			btn_loadChart_setval(btn_loadChart_img[0]);
			btn_loadChart_isovered.current = false;
		}
	};

    return (
        <Column align = "center">
            <Cell>
                <Button className='btn_loadChart'
                    icon={true}
                    iconComponent={<img src={btn_loadChart_val} alt="loadChart" style={{height:'75%'}} />}
                    iconOnly
                    backgroundOpacity="opaque"
                    onClick={()=>{btn_loadChart_setOpen(btn_loadChart_Open+1); setcurPage(4)}}
                    onMouseOut={btn_loadChart_resetval}
                    onMouseOver={()=>{btn_loadChart_setval(btn_loadChart_img[1]); btn_loadChart_isovered.current=true}}
                />
            </Cell>
        </Column>
    );
};

export const Btn_updateUser = ({btn_UpdateErr_Open, btn_UpdateErrMsg, setupdateUser, newUser, setnewUser_Field, btn_UpdateErr_setOpen}) => {
    const [btn_updateUser_Open,btn_updateUser_setOpen] = useState(0);
    const [btn_Update_Open,btn_Update_setOpen] = useState(false);
	const [btn_Update_Msg,btn_Update_setMsg] = useState(''); 
    const btn_updateUser_isovered = useRef(false);
	const btn_updateUser_img = ['./profile_update1.png','./profile_update2.png'];
	const [btn_updateUser_val,btn_updateUser_setval] = useState(btn_updateUser_img[0]);
	const btn_updateUser_resetval = () => {
		if (btn_updateUser_isovered.current == true) {
			btn_updateUser_setval(btn_updateUser_img[0]);
			btn_updateUser_isovered.current = false;
		}
	};

    return (
        <Column align = "center">
            <Cell>
                <Button className='btn_updateUser'
                    icon={true}
                    iconComponent={<img src={btn_updateUser_val} alt="updateUser" style={{height:'75%'}} />}
                    iconOnly
                    backgroundOpacity="opaque"
                    onClick={()=>{btn_updateUser_setOpen(btn_updateUser_Open+1); btn_Update_setOpen(true)}}
                    onMouseOut={btn_updateUser_resetval}
                    onMouseOver={()=>{btn_updateUser_setval(btn_updateUser_img[1]); btn_updateUser_isovered.current=true}}
                />
            </Cell>
            <Alert type="overlay" open={btn_Update_Open} onClose={()=>{btn_Update_setOpen(false)}} style={{height:'800px',width:'800px'}}>
                <h2 style={{textAlign: 'center', fontWeight:'900'}}>Update Profile</h2>
                <Column>
                    <Cell style={{position:'relative', top:'-40px', left:'-20px'}}>
                        <h4>Name</h4>
                        <InputField 
                            type="text"
                            value={newUser.username}
                            onChange={(e)=>{setnewUser_Field(e.value,'username')}}
                            placeholder="Name"
                            style={{backgroundColor:'rgba(64, 64, 64, .75)', position:'relative', top:'-30px'}}
                        />
                    </Cell>
                    <Cell style={{position:'relative', top:'-80px', left:'-20px'}}>
                        <h4>Password</h4>
                        <InputField
                            type="text"
                            value={newUser.password}
                            onChange={(e)=>{setnewUser_Field(e.value,'password')}}
                            placeholder="Password"
                            style={{backgroundColor:'rgba(64, 64, 64, .75)',position:'relative', top:'-30px'}}
                        />
                    </Cell>
                    <Cell style={{position:'relative', top:'-120px', left:'-20px'}}>
                        <h4>Confirm Password</h4>
                        <InputField
                            type="text"
                            value={newUser.password_confirm}
                            onChange={(e)=>{setnewUser_Field(e.value,'password_confirm')}}
                            placeholder="Confirm Password"
                            style={{backgroundColor:'rgba(64, 64, 64, .75)',position:'relative', top:'-30px'}}
                        />
                    </Cell>
                    <Cell style={{position:'relative', top:'-160px', left:'-25px'}}>
                        <h4>Option</h4>
                        <CheckboxItem defaultSelected={newUser.mode} style={{position:'relative',top:'-40px'}}
                            onToggle={()=>{(newUser.mode==true) ? setnewUser_Field(false,'mode'):setnewUser_Field(true,'mode')}}>
                            Enable Kids Mode
                        </CheckboxItem>
                    </Cell>
                    <Row style={{position:'relative',top:'-200px',left:'60px'}}>
                        <Cell>
                            <Button
                                size="small"
                                onClick={()=>{btn_Update_setOpen(false); setupdateUser(true)}}>
                                Confirm
                            </Button>
                        </Cell>
                        <Cell>
                            <Button
                                size="small"
                                onClick={()=>{btn_Update_setOpen(false)}}>
                                Cancel
                            </Button>
                        </Cell>
                    </Row>
                </Column>
            </Alert>
			<Popup open={btn_UpdateErr_Open} onClose={()=>{btn_UpdateErr_setOpen(false)}}>
				{btn_UpdateErrMsg}
			</Popup>
        </Column>
    );
};

export const Btn_deleteUser = ({DelUser,setdeleteUser}) => {
    const [deleteUser_Open, deleteUser_setOpen] = useState(false);
    const [btn_deleteUser_Open,btn_deleteUser_setOpen] = useState(0);
    const btn_deleteUser_isovered = useRef(false);
	const btn_deleteUser_img = ['./profile_delete1.png','./profile_delete2.png'];
	const [btn_deleteUser_val,btn_deleteUser_setval] = useState(btn_deleteUser_img[0]);
	const btn_deleteUser_resetval = () => {
		if (btn_deleteUser_isovered.current == true) {
			btn_deleteUser_setval(btn_deleteUser_img[0]);
			btn_deleteUser_isovered.current = false;
		}
	};

    return (
        <Column align = "center">
            <Cell>
                <Button className='btn_deleteUser'
                    icon={true}
                    iconComponent={<img src={btn_deleteUser_val} alt="deleteUser" style={{height:'75%'}} />}
                    iconOnly
                    backgroundOpacity="opaque"
                    onClick={()=>{btn_deleteUser_setOpen(btn_deleteUser_Open+1); deleteUser_setOpen(true)}}
                    onMouseOut={btn_deleteUser_resetval}
                    onMouseOver={()=>{btn_deleteUser_setval(btn_deleteUser_img[1]); btn_deleteUser_isovered.current=true}}
                />
            </Cell>
            <Alert type="overlay" open={deleteUser_Open} onClose={()=>{deleteUser_setOpen(false)}} style={{height:'500px'}} >
                <h2 style={{textAlign:'center'}}>{$L('Delete Account\n')}</h2>
                <div style={{textAlign:'center'}}>Are you sure you want to delete your account?</div>
                <h3  style={{textAlign:'center'}}>{DelUser.username}</h3>
                <div style={{textAlign:'center'}}>Deleted accounts cannot be recovered.</div>
                <Row align = "center" style={{position:'relative', top:'30px', left:'20px'}}>
                    <Cell>
                        <Button
                            size="small"
                            className={css.buttonCell}
                            onClick={()=>{deleteUser_setOpen(false); setdeleteUser(true)}}>
                            {$L('Yes')}
                        </Button>
                    </Cell>
                    <Cell>
                        <Button
                            size="small"
                            className={css.buttonCell}
                            onClick={()=>{deleteUser_setOpen(false)}}>
                            {$L('No')}
                        </Button>
                    </Cell>
                </Row>
            </Alert>
        </Column>
    );
};