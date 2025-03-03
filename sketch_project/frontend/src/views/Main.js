import TabLayout, {Tab} from '@enact/sandstone/TabLayout';
import {Header, Panel} from '@enact/sandstone/Panels';
import $L from '@enact/i18n/$L';
import Home from './Home';
import Sketch from './Sketch';
import Account from './Account';
import { useEffect, useState, useRef } from 'react';
import Profile from './Profile';
import Status from './Status';

const Main = (props) => {
	const nullUser = useRef({
		_id: '',
		username: '',
		password: '',
		mode: '0'
	});

	const [ResetCanvas, setResetCanvas] = useState(false);
	const [CanvasTitle, setCanvasTitle] = useState('Untitled');
	const [curPainting, setcurPainting] = useState('');
	const [curPage,setcurPage] = useState(1);
	const [LoginUser,setLoginUser] = useState(nullUser);
	const [isTabLocked, setisTabLocked] = useState(true);
	const [MainTitle, setMainTitle] = useState("Enact Sketch App");
	const [CanvasList, setCanvasList] = useState([]);
	const [CanvasIDList, setCanvasIDList] = useState([]);
	
	const ExitPage = ()=>{
		if (curPage == 2) {
			setcurPage(1);
		}
		else if (curPage == 3) {
			setcurPage(2);
		}
		else if (curPage == 4) {
			setcurPage(3);
		}
	}
	
	useEffect(()=>{
		if (curPage == 1) {
			setMainTitle("Enact Sketch App");
		}
		else if (curPage == 2) {
			setMainTitle('Profile');
		}
		else if (curPage == 3) {
			setMainTitle(CanvasTitle);
		}
		else {
			setMainTitle("System Status");
		}
	},[curPage])

	//onExpand={(e)=>{setisTabLocked(false)}} onCollapse={(e)=>{setisTabLocked(true)}}
	return (
		<Panel {...props} onClose={ExitPage}>
			<Header title={$L(MainTitle)} />
			<TabLayout index={curPage} collapsed={isTabLocked} onSelect={(e)=>{setcurPage(e.index)}}>
				<Tab title={$L('Home')}>
					<Home />
				</Tab>
				<Tab title={$L('Account')}>
					<Account setcurPage={setcurPage} setLoginUser={setLoginUser}/>
				</Tab>
				<Tab title={$L('Profile')}>
					<Profile CanvasIDList={CanvasIDList} setCanvasIDList={setCanvasIDList} CanvasList={CanvasList} setCanvasList={setCanvasList} setResetCanvas={setResetCanvas} setCanvasTitle={setCanvasTitle} nullUser={nullUser} LoginUser={LoginUser} setLoginUser={setLoginUser} setcurPage={setcurPage} setcurPainting={setcurPainting}/>
				</Tab>
				<Tab title={$L('Sketch')}>
					<Sketch CanvasIDList={CanvasIDList} CanvasList={CanvasList} setCanvasList={setCanvasList} setMainTitle={setMainTitle} ResetCanvas={ResetCanvas} setResetCanvas={setResetCanvas} setCanvasTitle={setCanvasTitle} CanvasTitle={CanvasTitle} setcurPage={setcurPage} LoginUser={LoginUser} setcurPainting={setcurPainting} curPainting={curPainting}/>
				</Tab>
				<Tab title={$L('Status')}>
					<Status />
				</Tab>
			</TabLayout>
		</Panel>
	);
};
export default Main;
