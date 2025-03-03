import React, {useCallback, useState, useEffect, useRef} from 'react';
import Button from '@enact/sandstone/Button';
import {InputField} from '@enact/sandstone/Input';
import {fabric} from 'fabric';
import {Column, Row, Cell, Layout} from '@enact/ui/Layout';
import Scroller from '@enact/sandstone/Scroller';
import Slider from '@enact/sandstone/Slider';
import axios from 'axios';
import { CreateAccount, GetUserbyName, GetAccount, DeleteAccount, UpdateAccount } from './User';
import {SavePainting, LoadPainting, LoadPaintingbyId, LoadPaintingbyUser, UpdatePainting, DeletePainting, PostPreview} from './Paintings';
// src default path : public = "./"
import {getSystemInfo, launch} from '../libs/services'
import {getCpuInfo,getMemoryInfo} from '../libs/services'
import TabLayout, {Tab} from '@enact/sandstone/TabLayout';
import { Draw_Square, Draw_Triangle, Draw_Circle, Draw_Line, Draw_Polygon, Draw_Image, Draw_TextAi } from './DrawPolygon';
import {strToInt} from './SketchColor';
import Popup from '@enact/sandstone/Popup';
import Spinner from '@enact/sandstone/Spinner';


import {Btn_trash, Btn_drawingMode, Btn_bgColor, Btn_penColor, Btn_penWidth, Btn_loadCanvas, 
	 Btn_shadowColor, Btn_shadowWidth, Btn_penType, Btn_AiTool,Btn_addCanvas, Btn_saveCanvas,
	Btn_Undo, Btn_Redo, Btn_Delete, Btn_loadChart, Btn_TextBox, Btn_polyType, Btn_Copy,
	Btn_deleteCanvas} from './Button.js' 

// todo : polygon / account / genImage

const Sketch = ({CanvasIDList, setCanvasList, CanvasList, setMainTitle, setResetCanvas, ResetCanvas, CanvasTitle, setCanvasTitle, setcurPage, LoginUser, curPainting, setcurPainting}) => {
	
	const [TitleInput, setTitleInput] = useState('');
	const [savetitle, setsavetitle] = useState(false);
	const [savetitleAi, setsavetitleAi] = useState(false);
	const [saveTextAi, setsaveTextAi] = useState(false);
	const [Popup_Open, Popup_setOpen] = useState(false);
	const [Popup_Msg, Popup_setMsg] = useState('');
	const ClickDelay = useRef(false);
	const [LoadingAi, setLoadingAi] = useState(false);


	const initbgColor = useRef('#ffffff');
	const [canvas, setCanvas] = useState();
	const [bgColor, setbgColor] = useState('#ffffff');
	const [penColor, setpenColor] = useState('#000000');
	const [penOpacity, setpenOpacity] = useState(256);
	const [penWidth, setpenWidth] = useState(30);
	const [shadowColor, setshadowColor] = useState('#000000');
	const [shadowWidth, setshadowWidth] = useState(0);
	const [trash_Open, trash_setOpen] = useState(false);
	const [drawingMode, setdrawingMode] = useState(true);
	const [drawingMode_request, setdrawingMode_request] = useState(0);
	const [penType, setpenType] = useState('Pencil');
	const [Copy, setCopy] = useState(false);
	const [Undo, setUndo] = useState(false);
	const [Redo, setRedo] = useState(false);
	const [PrevObj, setPrevObj] = useState([]);
	const [Delete, setDelete] = useState(false);
	const [DrawImageAi_Alpha, DrawImageAi_setAlpha] = useState(256);
	const [DrawImageAi, setDrawImageAi] = useState(false);
	const [DrawInput_prompt, setDrawInput_prompt] = useState('');
	const [polyType, setpolyType] = useState('None');
	const [PolyNum, setPolyNum] = useState(5);
	const [TextSize, setTextSize] = useState(84);
	const [TextFont, setTextFont] = useState('Normal');
	const [TextOpen, setTextOpen] = useState(false);
	const [addCanvas, setaddCanvas] = useState(false);
	const [saveCanvas, setsaveCanvas] = useState(false);
	const [deleteCanvas, setdeleteCanvas] = useState(false);
	const [clearCanvas, setclearCanvas] = useState(false);
	const [addCanvasNum,setaddCanvasNum] = useState(0);

	useEffect(() => {
		let initCanvas = new fabric.Canvas('canvas', {
			height: 840,
			width: 1660,
			backgroundColor: initbgColor.current,
			isDrawingMode: true
		})

		if (ResetCanvas == true) {
			setLoadingAi(true);
			let LoadedCanvas = JSON.parse(curPainting.imageUrl)
			setbgColor(LoadedCanvas.background);

			initCanvas.loadFromJSON(curPainting.imageUrl, () =>{
				setCanvas(initCanvas);

				let dummy = new fabric.Rect({
					width: 0,
					height: 0,
					left: 0,
					top: 0,
					angle: 0,
					fill: '#000000',
					opacity: 0
				});
				initCanvas.add(dummy);
				setLoadingAi(false);
			});
		}
		else {
			setCanvas(initCanvas);
		}
		setResetCanvas(false);
	}, []);

	useEffect(()=>{
		if (canvas) {
			canvas.backgroundColor = bgColor;
			canvas.renderAll();
			console.log("BGCOLOR "+JSON.stringify(canvas));
		}
	},[canvas,bgColor])
	
	useEffect(()=>{
		if (canvas) {
			let penRGBA = penColor;
			if (penOpacity < 256) {
				penRGBA += penOpacity.toString(16);
			}
			canvas.freeDrawingBrush.color = penRGBA;
		}
	},[canvas,penColor,penOpacity])

	useEffect(() => {
		if (canvas) {
			canvas.freeDrawingBrush.width = penWidth;
		}
	},[canvas,penWidth]);

	useEffect(()=>{
		if (canvas) {
			canvas.freeDrawingBrush.shadow = new fabric.Shadow({
				blur: shadowWidth,
				offsetX: 0,
				offsetY: 0,
				affectStroke: true,
				color: shadowColor,
			  });
		}
	},[canvas,shadowColor,shadowWidth])

	useEffect(() => {
		if (canvas) {
			canvas.isDrawingMode = drawingMode;
			if (drawingMode == true) {
				setpolyType('None');
			}
		}
	},[canvas,drawingMode])

	const Brush_load_preset = () =>{
		canvas.freeDrawingBrush.width = penWidth;
		canvas.freeDrawingBrush.color = penColor;
		canvas.freeDrawingBrush.shadow = 
		new fabric.Shadow({
			blur: shadowWidth,
			offsetX: 0,
			offsetY: 0,
			affectStroke: true,
			color: shadowColor,
		  });
	}

	useEffect(()=>{
		if (canvas) {
			if (penType == "Pencil") {
				canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
				Brush_load_preset();
			}
			else if (penType == "Circle") {
				canvas.freeDrawingBrush = new fabric.CircleBrush(canvas);
				Brush_load_preset();
			}
			else if (penType == "Spray") {
				canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
				Brush_load_preset();
			}
			else if (penType == "Eraser") {
				const erase = (canvas, pointer)=>{
					const target = canvas._searchPossibleTargets(canvas.getObjects(),{x: pointer.x, y: pointer.y});
					canvas.remove(target);
					canvas.renderAll();
				}
				
				fabric.EraseBrush = fabric.util.createClass(fabric.BaseBrush, {
					initialize: function(canvas) {
					  var context = this;
					  this.canvas = canvas;
					},
					_render: function() {},
					onMouseUp: function(pointer) {},
					onMouseDown: function(pointer) {erase(this.canvas,pointer)},
					onMouseMove: function(pointer) {erase(this.canvas,pointer)},
				});

				canvas.freeDrawingBrush = new fabric.EraseBrush(canvas);
			}
		}
	},[canvas, penType])

	useEffect(()=>{
		if (canvas) {
			if (polyType == "None") {
				canvas.off('mouse:down');
			}
			else {
				setdrawingMode_request(2);
				let rgba = strToInt(penColor);
				let fillColor = 'rgba('+rgba.r+','+rgba.g+','+rgba.b+','+penOpacity/256+')'
				
				if (polyType == "Square") {
					canvas.off('mouse:down');
					Draw_Square(canvas, fillColor);
				}
				else if (polyType == "Triangle") {
					canvas.off('mouse:down');
					Draw_Triangle(canvas, fillColor);
				}
				else if (polyType == "Circle") {
					canvas.off('mouse:down');
					Draw_Circle(canvas, fillColor);
				}
				else if (polyType == "Line") {
					canvas.off('mouse:down');
					Draw_Line(canvas, penWidth,penColor,penOpacity);
				}
				else if (polyType == "Polygon") {
					canvas.off('mouse:down');
					Draw_Polygon(canvas,fillColor,PolyNum);
				}
			}
		}
	},[canvas, polyType, penColor, penOpacity, penWidth, PolyNum])

	useEffect(()=>{
		if (canvas && ClickDelay.current == false) {
			ClickDelay.current = true;
			setTimeout(() =>{ClickDelay.current = false}, 500);
			if (DrawImageAi == true) {
				const RequestImageAi = async () => {
					setLoadingAi(true);
					await Draw_Image(canvas,DrawInput_prompt,DrawImageAi_Alpha);
					setLoadingAi(false);
				}
				RequestImageAi();
			}
		}
		setDrawImageAi(false);
	},[DrawImageAi])
	
	useEffect(()=>{
		if (canvas) {
			if (Copy == true && ClickDelay.current == false) {
				ClickDelay.current = true;
				setTimeout(() =>{ClickDelay.current = false}, 200);
				let Aobj = [];
				let Iobj = [];
				let orig = canvas.getActiveObject();
				if (orig != null) {
					if (orig.get("type")=='activeSelection') {
						let objects = canvas.getActiveObjects();
						for (let obj of objects) {
							if (obj.get("type")=="image") {
								Iobj.push(obj);
							}
							else {
								Aobj.push(obj);
							}
						}
						if (Aobj.length > 0) {
							canvas.discardActiveObject();
							let sel = new fabric.ActiveSelection(Aobj, {
								canvas: canvas,
							});
							canvas.setActiveObject(sel);
							canvas.renderAll();
						}
					}
					else if (orig.get("type")=='image') {
						Iobj = [orig];
						canvas.discardActiveObject();
						canvas.renderAll();
					}
					else {
						Aobj = [orig];
					}

					let _clipboard;
					if (Aobj.length > 0) {
						canvas.getActiveObject().clone((cloned)=>{
							_clipboard = cloned;
						});
						
						_clipboard.clone((clonedObj)=>{
							canvas.discardActiveObject();
							clonedObj.set({
								left: clonedObj.left + 25,
								top: clonedObj.top + 25,
								evented: true,
							});
							if (clonedObj.type === 'activeSelection') {
								clonedObj.canvas = canvas;
								clonedObj.forEachObject((obj)=>{
									canvas.add(obj);
								});
								clonedObj.setCoords();
							} else {
								canvas.add(clonedObj);
							}
							canvas.setActiveObject(clonedObj);
							canvas.requestRenderAll();
						});
					}
					
					let nimg;
					for (let img of Iobj) {
						let imgPath = img.getSrc();
						let imgleft = img.get("left");
						let imgtop = img.get("top");
						let imgopacity = img.get("opacity");
						let imgwidth = img.get("width");
						let imgheight = img.get("height");
						let imgscaleX = img.get("scaleX");
						let imgscaleY = img.get("scaleY");

						fabric.Image.fromURL(imgPath, function(e) {                    
							nimg = e.set({left: imgleft+25, top: imgtop+25, opacity: imgopacity, 
										width:imgwidth, height:imgheight, scaleX:imgscaleX, scaleY:imgscaleY});

							canvas.add(nimg);
							canvas.renderAll();
						})
					}
				}
			}
		}
		setCopy(false);
	},[canvas, Copy])

	useEffect(()=>{
		if (canvas) {
			let objects = canvas.getObjects();
			if (objects.length > 0 && ClickDelay.current == false) {
				let obj = objects.pop();
				let copy = [...PrevObj, obj];
				setPrevObj(copy);
				canvas.remove(obj);
				canvas.renderAll();
				ClickDelay.current = true;
				setTimeout(() =>{ClickDelay.current = false}, 200);
			}
		}
		setUndo(false);
	},[canvas, Undo])

	useEffect(()=>{
		if (canvas) {
			if (PrevObj.length > 0 && ClickDelay.current == false) {
				let copy = [...PrevObj];
				canvas.add(copy.pop());
				setPrevObj(copy);
				canvas.renderAll();
				ClickDelay.current = true;
				setTimeout(() =>{ClickDelay.current = false}, 200);
			}
		}
		setRedo(false);
	},[canvas, Redo])

	useEffect(()=>{
		if (canvas) {
			let copy = [...PrevObj,...canvas.getActiveObjects()];
			setPrevObj(copy);
			canvas.remove(...canvas.getActiveObjects());
			canvas.discardActiveObject();
			canvas.renderAll();
		}
		setDelete(false);
	},[canvas, Delete])

	useEffect(() => {
		if (clearCanvas == true) {
			canvas.clear();
			setPrevObj([]);
			setbgColor(initbgColor.current);
			canvas.backgroundColor = initbgColor.current;
			trash_setOpen(false);
			setdrawingMode_request(1);
		}
		setclearCanvas(false);
	}, [clearCanvas]);

	useEffect(()=>{
		if (addCanvas == true && ClickDelay.current == false) {
			ClickDelay.current = true;
			setTimeout(() =>{ClickDelay.current = false}, 200);
			console.log("add "+addCanvasNum);
			if (addCanvasNum == 0) {
				Popup_setMsg('Invalid Painting.');
				Popup_setOpen(true);
			}
			else {
				const MergeCanvas = async () => {
					setLoadingAi(true);

					let TCanvas = new fabric.Canvas('canvas', {
						height: 840,
						width: 1660,
						backgroundColor: '#ffffff',
						isDrawingMode: true
					})

					let PaintingList = await LoadPaintingbyId(CanvasIDList[addCanvasNum-1]);
					let P = PaintingList.data;
					console.log(PaintingList.data.imageUrl);

					TCanvas.loadFromJSON(P.imageUrl, ()=>{
						let objects = TCanvas.getObjects();

						for (let obj of objects) {
							canvas.add(obj);
						}

						canvas.renderAll();
						setLoadingAi(false);

						Popup_setMsg(P.title+' has been successfully Added.');
						Popup_setOpen(true);
					});
				}
				MergeCanvas();
			}
		}
		setaddCanvas(false);
	},[addCanvas])

	useEffect(()=>{
		if (savetitle == true) {
			if (TitleInput == '') {
				Popup_setMsg('Invalid Title.');
				Popup_setOpen(true);
				return;
			}
			setCanvasTitle(TitleInput);
			setMainTitle(TitleInput);
			Popup_setMsg('The title has been successfully saved. ('+TitleInput+')');
			Popup_setOpen(true);
		}
		setsavetitle(false);
	},[savetitle])

	useEffect(()=> {
		if (saveCanvas == true && ClickDelay.current == false) {
			ClickDelay.current = true;
			setTimeout(() =>{ClickDelay.current = false}, 500);
			const SavecurCanvas = async () => {
				const newPainting = {
					userId: LoginUser._id,
					title: CanvasTitle,
					description: "-",
					imageUrl: JSON.stringify(canvas),
					preview: canvas.toDataURL({
						format: 'jpg',
						quality: 0.8
					})
				};
				setLoadingAi(true);
				await UpdatePainting(curPainting._id,newPainting);
				setLoadingAi(false);
				Popup_setMsg(CanvasTitle+' has been successfully saved.');
				Popup_setOpen(true);
				let copy = [...CanvasList, CanvasTitle];
				setCanvasList(copy);
			}
			SavecurCanvas();
		}
		setsaveCanvas(false);
	}, [saveCanvas]);

	useEffect(()=> {
		if (deleteCanvas == true) {
			const DeletecurCanvas = async () => {
				await DeletePainting(curPainting._id);
				Popup_setMsg(CanvasTitle+' has been successfully deleted.');
				Popup_setOpen(true);
				setcurPainting('');
				setcurPage(2);
			}
			DeletecurCanvas();
		}
		setdeleteCanvas(false);
	}, [deleteCanvas]);
	
	useEffect(()=>{
		if (saveTextAi == true && ClickDelay.current == false) {
			ClickDelay.current = true;
			setTimeout(() =>{ClickDelay.current = false}, 500);
			const RequestTextAi = async () => {
				var Preview = await canvas.toDataURL({
					format: 'jpg',
					quality: 0.8
				});
				setLoadingAi(true);
				await Draw_TextAi(canvas, Preview, 'text', TextSize);
				setLoadingAi(false);
			}
			RequestTextAi();
		}
		setsaveTextAi(false);
	},[saveTextAi])

	useEffect(()=>{
		if (savetitleAi == true && ClickDelay.current == false) {
			ClickDelay.current = true;
			setTimeout(() =>{ClickDelay.current = false}, 500);
			const RequestTitleAi = async () => {
				var Preview = await canvas.toDataURL({
					format: 'jpg',
					quality: 0.8
				});
				setLoadingAi(true);
				let newTitle = await Draw_TextAi(canvas, Preview, 'title');
				setLoadingAi(false);
				setCanvasTitle(newTitle);
				setMainTitle(newTitle);
				Popup_setMsg('The title has been successfully saved. ('+newTitle+')');
				Popup_setOpen(true);
			}
			RequestTitleAi();
		}
		setsavetitleAi(false);
	},[savetitleAi])


	return (
		<div>
		<Row style={{position:'relative', left:'-120px', top: '-70px'}}>
			<Layout align='end'>
				<Cell shrink>
					<Column>
						<Btn_Undo Undo={Undo} setUndo={setUndo}/>
						<Btn_Redo Redo={Redo} setRedo={setRedo}/>
						<Btn_Copy Copy={Copy} setCopy={setCopy}/>
						<Btn_Delete Delete={Delete} setDelete={setDelete}/>
					</Column>
				</Cell>
			</Layout>
			<Column>
				<Row style={{position: "relative", top: '-10px', left: '380px'}}>
					<Btn_bgColor bgColor={bgColor} setbgColor={setbgColor}/>
					<Btn_drawingMode drawingMode={drawingMode} setdrawingMode={setdrawingMode} 
										drawingMode_request={drawingMode_request} setdrawingMode_request={setdrawingMode_request}/>
					<Btn_penType penType={penType} setpenType={setpenType}/>
					<Btn_penWidth penWidth={penWidth} setpenWidth={setpenWidth}/>
					<Btn_penColor penColor={penColor} setpenColor={setpenColor} penOpacity={penOpacity} setpenOpacity={setpenOpacity}/>
					<Btn_shadowWidth shadowWidth={shadowWidth} setshadowWidth={setshadowWidth}/>
					<Btn_shadowColor shadowColor={shadowColor} setshadowColor={setshadowColor}/>
					<Btn_polyType polyType={polyType} setpolyType={setpolyType} PolyNum={PolyNum} setPolyNum={setPolyNum}/>
					<Btn_TextBox TextSize={TextSize} setTextSize={setTextSize}
								 TextFont={TextFont} setTextFont={setTextFont} TextOpen={TextOpen} setTextOpen={setTextOpen}
								 penColor={penColor} penOpacity={penOpacity} canvas={canvas}/>
					<Btn_AiTool DrawInput_prompt={DrawInput_prompt} setDrawInput_prompt={setDrawInput_prompt} setsaveTextAi={setsaveTextAi}
								DrawImageAi={DrawImageAi} setDrawImageAi={setDrawImageAi} canvas ={canvas} CanvasTitle={CanvasTitle}
								DrawImageAi_Alpha={DrawImageAi_Alpha} DrawImageAi_setAlpha={DrawImageAi_setAlpha}/>
					<Btn_loadChart setcurPage={setcurPage}/>
					{(LoadingAi == true) ? 
					(<div style={{width:'fit-content', position:'relative', top:'-2px', left:'15px'}}>   
						<Spinner style={{scale:'1'}}/>
					</div>) : null}
				</Row>
				<canvas id="canvas"/>
			</Column>
			<Layout align='end'>
				<Cell shrink>
					<Column>
						<Btn_saveCanvas saveCanvas={saveCanvas} setsaveCanvas={setsaveCanvas} TitleInput={TitleInput} setTitleInput={setTitleInput}
										setsavetitle={setsavetitle} setsavetitleAi={setsavetitleAi} CanvasTitle={CanvasTitle}
						/>
						<Btn_addCanvas addCanvas={addCanvas} setaddCanvas={setaddCanvas} setaddCanvasNum={setaddCanvasNum} CanvasList={CanvasList}/>
						<Btn_trash trash_Open={trash_Open} trash_setOpen={trash_setOpen} clearCanvas={clearCanvas} setclearCanvas={setclearCanvas}/>
						<Btn_deleteCanvas deleteCanvas={deleteCanvas} setdeleteCanvas={setdeleteCanvas} CanvasTitle={CanvasTitle}/>
					</Column>
				</Cell>
			</Layout>
		</Row>
		<Popup open={Popup_Open} onClose={()=>{Popup_setOpen(false)}}>
			{Popup_Msg}
		</Popup>
		</div>
	);
};

export default Sketch;
//<Btn_loadCanvas loadCanvas={loadCanvas} setloadCanvas={setloadCanvas}/>
