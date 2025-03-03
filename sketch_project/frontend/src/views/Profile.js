/* eslint-disable */
import Button from '@enact/sandstone/Button';
import {InputField} from '@enact/sandstone/Input';
import axios from 'axios';
import {useEffect, useState} from 'react';
import $L from '@enact/i18n/$L';
import Panels, {Header, Panel} from '@enact/sandstone/Panels';
import Layout, { Column,Row, Cell } from '@enact/ui/Layout';
import { Btn_updateUser, Btn_deleteUser } from './Button';
import {DeleteAccount, GetAccount, UpdateAccount, GetUserbyName} from './User';
import {LoadPaintingbyUser, LoadPainting, SavePainting} from './Paintings';
import Spinner from '@enact/sandstone/Spinner';
import {fabric} from 'fabric';

const Profile = ({CanvasIDList ,setCanvasIDList,CanvasList ,setCanvasList, setResetCanvas, setCanvasTitle, nullUser, LoginUser, setLoginUser,curPage, setcurPage, setcurPainting}) => {
	const [updateUser, setupdateUser] = useState(false);
    const [deleteUser, setdeleteUser] = useState(false);
	const [btn_UpdateErr_Open,btn_UpdateErr_setOpen] = useState(false);
	const [btn_UpdateErrMsg,btn_UpdateErrMsg_set] = useState('');
	const [LoadingCanvas, setLoadingCanvas] = useState(false); 
	const [newUser, setnewUser] = useState({
		username: '',
		password: '',
		password_confirm: '',
		mode: false
	})
	const [PaintingList, setPaintingList] = useState([]);

	const setnewUser_Field = (e,field)=>{
		let copy = {...newUser};
		if (field == 'username') {
			copy.username = e;
		}
		else if (field == 'password') {
			copy.password = e;
		}
		else if (field == 'password_confirm') {
			copy.password_confirm = e;
		}
		else if (field == 'mode') {
			copy.mode = e;
		}
		setnewUser(copy);
	}
	
	useEffect(()=>{
		if (deleteUser == true) {
			const DeleteUserData = async (Name) => { 
				await DeleteAccount(Name);
				setLoginUser(nullUser);
				setcurPage(1);
			}
			DeleteUserData(LoginUser.username);
		}
		setdeleteUser(false);
	},[deleteUser])

	useEffect(()=>{
		if (updateUser == true) {
			const UpdateUserData = async (Name) => { 
				let UserList = await GetAccount();
				UserList = UserList.data;

				if (newUser.username == '') {
					btn_UpdateErrMsg_set('Invalid Username.');
					btn_UpdateErr_setOpen(true);
					return;
				}
				if (newUser.password == '') {
					btn_UpdateErrMsg_set('Invalid Password.');
					btn_UpdateErr_setOpen(true);
					return;
				}
				if (newUser.password != newUser.password_confirm) {
					btn_UpdateErrMsg_set('Password doesn\'t match the Confirmation Password.');
					btn_UpdateErr_setOpen(true);
					return;
				}
		
				const uniqueCheck = UserList.find((user)=>{
					return user.username === newUser.username;
				})
				if (uniqueCheck === undefined || uniqueCheck.username === Name) {
					let KidsMode = '0';
					if (newUser.mode == true)
					{
						KidsMode = '1';
					}
					let User = {
						username: newUser.username,
						password: newUser.password,
						mode: KidsMode
					};

					await UpdateAccount(Name,User);
					let newLoginUser = await GetUserbyName(User.username); 
					setLoginUser(newLoginUser.data);
					btn_UpdateErrMsg_set('Your profile has been successfully updated.');
					btn_UpdateErr_setOpen(true);
				}
				else {
					btn_UpdateErrMsg_set('This Username is already exists.');
					btn_UpdateErr_setOpen(true);
					return;
				}
			}
			UpdateUserData(LoginUser.username);
		}
		setupdateUser(false);
	})

	const LoadPaintingList = async () => {
		setLoadingCanvas(true);
		let Paintings = await LoadPaintingbyUser(LoginUser);	
		let newP = {
			_id: '0',
			userId: '0',
			title: "New Painting",
			description: "-",
			imageUrl: null,
			preview: './newCanvas.png'
		}
		setLoadingCanvas(false);
		if (typeof(Paintings.data)=='object') {
			let copy = [newP,...Paintings.data];
			setPaintingList(copy);
			let copy2 = ['None'];
			let copy3 = [];
			for (let P of Paintings.data) {
				copy2.push(P.title);
				copy3.push(P._id);
			}
			setCanvasList(copy2);
			setCanvasIDList(copy3);
		}
		else {
			setPaintingList([newP]);
			setCanvasList(['None']);
		}
	};

	useEffect(() => {
		LoadPaintingList();
	}, []);

	const OpenCanvas = (P,mode) => {
		if (mode == 'new') {
			const CreateCanvas = async () => {
				let newCanvas = new fabric.Canvas('canvas', {
					height: 840,
					width: 1660,
					backgroundColor: '#ffffff',
					isDrawingMode: true
				})
		
				const newPainting = await {
					userId: LoginUser._id,
					title: 'Untitled',
					description: "-",
					imageUrl: JSON.stringify(newCanvas),
					preview: newCanvas.toDataURL({
						format: 'jpg',
						quality: 0.8
					})
				};
				let P = await SavePainting(newPainting);
				setcurPainting(P.data);
				setCanvasTitle('Untitled');
				setResetCanvas(false);

				let copy = [...CanvasList,'Untitled'];
				setCanvasList(copy);
				copy = [...CanvasIDList,P.data._id];
				setCanvasIDList(copy);

				setcurPage(3);
			}
			CreateCanvas();
		}
		else {
			setcurPainting(P);
			setCanvasTitle(P.title);
			setResetCanvas(true);
			setcurPage(3);
		}
 	}

	return (
		<>
			<div style={{position:'relative',top:'-100px'}}>
				<Row align='center'>
					<Cell style = {{position:'relative', top:'-0px', textAlign:'center'}}>
						<h2>{$L(LoginUser.username)}</h2>
					</Cell>
					<Cell shrink>
						<Row style={{position:'relative', left:'0px'}}>
							<Btn_updateUser setupdateUser={setupdateUser} newUser={newUser} setnewUser_Field={setnewUser_Field}
											btn_UpdateErr_Open={btn_UpdateErr_Open} btn_UpdateErrMsg={btn_UpdateErrMsg}
											btn_UpdateErr_setOpen={btn_UpdateErr_setOpen}/>
							<Btn_deleteUser setdeleteUser={setdeleteUser} DelUser={LoginUser}/>
						</Row>
					</Cell>
				</Row>
				<hr style={{ borderTop: '5px solid #bbb', borderRadius: '5px'}}/>
			</div>
			{(LoadingCanvas == true) ? 
				(<div style={{width:'fit-content', margin: '0 auto', display:'block' }}>   
					<Spinner style={{scale:'1.5'}}>{'Loading '+LoginUser.username +'\'s Canvas...'}</Spinner>
				</div>) : null}
			
			{Array.isArray(PaintingList) ? (
			<div style={{
				position:'relative',
				top:'-50px',
				overflowX:'auto',
				alignItems:'center',
				width: 'fit-content',
				height: '100%',
				display: 'grid',
				gridTemplateColumns: 'repeat(3, 1fr)',
				gridColumnGap: '100px',
				gridRowGap: '0px',
			}}>
			{PaintingList.map((P, idx) => (
				<Column key={P._id} align='center' style={{position:'relative', top:`${-Math.floor(idx/3)*20}px`}}>
					<h2>{$L(P.title)}</h2>
					<Button 
						onClick={() => {idx == 0 ? OpenCanvas(P,'new') : OpenCanvas(P,'Open')}}
						size="large"
						icon={true}
						iconComponent={<img src={P.preview} alt="-" style={{height:'80%'}} />}
						iconOnly
						backgroundOpacity="transparent"
						style={{width:'500px', height:'300px',
								position:'relative', top:'-30px'}}>
					</Button>
				</Column>
			))}
			</div>) : (
				<p>{$L('Cannot retreive Painting data!')}</p>
			)}
		
			
			
			
		</>
	);
};

export default Profile;
