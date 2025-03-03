/* eslint-disable */
import Button from '@enact/sandstone/Button';
import {InputField} from '@enact/sandstone/Input';
import axios from 'axios';
import {useEffect, useState} from 'react';
import $L from '@enact/i18n/$L';
import Panels, {Header, Panel} from '@enact/sandstone/Panels';
import { Column,Row, Cell, Layout } from '@enact/ui/Layout';
import { CreateAccount, GetUserbyName, GetAccount, DeleteAccount, UpdateAccount } from './User';
import Alert from '@enact/sandstone/Alert';
import CheckboxItem from '@enact/sandstone/CheckboxItem';
import Popup from '@enact/sandstone/Popup';
import Spinner from '@enact/sandstone/Spinner';

const Account = ({setcurPage, setLoginUser}) => {
	const [LoadingUser, setLoadingUser] = useState(false); 
	const [btn_LoginErr_Open,btn_LoginErr_setOpen] = useState(false);
	const [btn_LoginErrMsg,btn_LoginErrMsg_set] = useState('');
	const [btn_Login_Open,btn_Login_setOpen] = useState(false);
	const [btn_Login_Msg,btn_Login_setMsg] = useState(''); 
	const [btn_Login_Pop,btn_Login_setPop] = useState(false); 
	const [btn_Signup_Open,btn_Signup_setOpen] = useState(false);
	const [newUser, setnewUser] = useState({
		username: '',
		password: '',
		password_confirm: '',
		mode: false
	})
	const [UserList, setUserList] = useState([]);
	const [curUser, setcurUser] = useState({
		_id: '',
		username: '',
		password: '',
		mode: '0'
	});
	const [Input_pwd,setInput_pwd] = useState('');

	const LoadUserList = async () => {
		setLoadingUser(true);
		let Users = await GetAccount();
		setUserList(Users.data);
		console.log(Users.data);
		setLoadingUser(false);
	};

	const AddUser = async (newUser) => {
		if (newUser.username == '') {
			btn_LoginErrMsg_set('Invalid Username.');
			btn_LoginErr_setOpen(true);
			return;
		}
		if (newUser.password == '') {
			btn_LoginErrMsg_set('Invalid Password.');
			btn_LoginErr_setOpen(true);
			return;
		}
		if (newUser.password != newUser.password_confirm) {
			btn_LoginErrMsg_set('Password doesn\'t match the Confirmation Password.');
			btn_LoginErr_setOpen(true);
			return;
		}

		const uniqueCheck = UserList.find((user)=>{
			return user.username === newUser.username;
		})
		if (uniqueCheck === undefined) {
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
			console.log(JSON.stringify(User))
			await CreateAccount(User);
			await LoadUserList();
			btn_LoginErrMsg_set('Your account has been successfully created.');
			btn_LoginErr_setOpen(true);
		}
		else {
			btn_LoginErrMsg_set('This Username is already exists.');
			btn_LoginErr_setOpen(true);
			return;
		}
	};

	const SignIn = (Input_pwd) => {
		if (Input_pwd == '') {
			btn_Login_setMsg('Invalid Password.');
			btn_Login_setPop(true);
			return;
		}
		if (Input_pwd != curUser.password) {
			btn_Login_setMsg('Incorrect Password.');
			btn_Login_setPop(true);
			return;
		}
		setLoginUser(curUser);
		setcurPage(2);
	}

	useEffect(() => {
		LoadUserList();
	}, []);

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

	/*
	<Panels {...props}>
		<MainPanel/>
	</Panels>
	*/

	return (
		<>
			<h2>User List</h2>
			{(LoadingUser == true) ? 
				(<div style={{width:'fit-content', margin: '0 auto', display:'block' }}>   
					<Spinner style={{scale:'1.5'}}>{'Loading User List...'}</Spinner>
				</div>) : null}
			{Array.isArray(UserList) ? 
				(
				<div style={{height:'50%', overflow:'auto'}}>
					<ul >
						{UserList.map((user) => (
							<li key={user._id}>
								<Button onClick={() => {btn_Login_setOpen(true); setInput_pwd('');
								setcurUser({_id:user._id, username:user.username, password:user.password, mode:user.mode})}}
									size="large"
									backgroundOpacity="transparent"
									style={{color:'#ffffff', textAlign:'left'}}>
									{$L(user.username)}
								</Button>
							</li>
						))}
					</ul>
				</div>
				): (
				<p>{$L('Cannot retreive User data!')}</p>
			)}
			<hr style={{ borderTop: '8px solid #bbb', borderRadius: '5px'}}/>
			<h2>Add User</h2>
			
			<Button onClick={()=>{btn_Signup_setOpen(true); setnewUser({username: '',password: '',password_confirm: '',mode: false})}} 
			style={{position:'relative',left:'35px',color:'#ffffff'}}>
				{$L('Sign Up')}
			</Button>
			
			<Alert type="overlay" open={btn_Signup_Open} onClose={()=>{btn_Signup_setOpen(false)}} style={{height:'800px',width:'800px'}}>
                    <h2 style={{textAlign: 'center', fontWeight:'900'}}>Create Account</h2>
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
                                    onClick={()=>{btn_Signup_setOpen(false); AddUser(newUser);}}>
                                    Register
                                </Button>
                            </Cell>
                            <Cell>
                                <Button
                                    size="small"
                                    onClick={()=>{btn_Signup_setOpen(false)}}>
                                    Cancel
                                </Button>
                            </Cell>
                        </Row>
                    </Column>
            </Alert>
			<Popup open={btn_LoginErr_Open} onClose={()=>{btn_LoginErr_setOpen(false)}}>
				{btn_LoginErrMsg}
			</Popup>

			<Alert type="overlay" open={btn_Login_Open} onClose={()=>{btn_Login_setOpen(false)}} style={{height:'500px',width:'800px'}}>
                    <h2 style={{textAlign: 'center', fontWeight:'900'}}>Sign In</h2>
                    <Column>
                        <Cell style={{position:'relative', top:'-40px', textAlign:'center'}}>
							<h3>{$L(curUser.username)}</h3>
                        </Cell>
                        <Cell style={{position:'relative', top:'-100px', left:'-20px'}}>
							<h4>Password</h4>
							<InputField
                                type="text"
                                value={Input_pwd}
                                onChange={(e)=>{setInput_pwd(e.value)}}
                                placeholder="Password"
                                style={{backgroundColor:'rgba(64, 64, 64, .75)',position:'relative', top:'-30px'}}
                            />
                        </Cell>
                        <Row style={{position:'relative',top:'-70px',left:'60px'}}>
                            <Cell>
                                <Button
                                    size="small"
                                    onClick={()=>{btn_Login_setOpen(false); SignIn(Input_pwd)}}>
                                    OK
                                </Button>
                            </Cell>
                            <Cell>
                                <Button
                                    size="small"
                                    onClick={()=>{btn_Login_setOpen(false)}}>
                                    Cancel
                                </Button>
                            </Cell>
                        </Row>
                    </Column>
            </Alert>
			<Popup open={btn_Login_Pop} onClose={()=>{btn_Login_setPop(false)}}>
				{btn_Login_Msg}
			</Popup>
		</>
	);
};

export default Account;
