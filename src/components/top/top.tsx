import { NavLink }  from 'react-router-dom';
import OnlineIcon from '@mui/icons-material/WifiSharp';
import ConnectingIcon from '@mui/icons-material/NetworkCheckSharp';
import OfflineIcon from '@mui/icons-material/WifiOffSharp';
import ThemeIcon from '@mui/icons-material/WbSunnySharp';
import { Status } from './status';
import useThemeStore from '../../stores/theme';
import useConnectionStore from '../../stores/connection';
import useWriteStore from '../../stores/states';

function ThemeToggle() {
    const { switchTheme } = useThemeStore();
    return (
        <button onClick={switchTheme}><ThemeIcon /></button>
    )
}


function ConnectionIcon(isConnecting: boolean, isOffline: boolean) {
    if (isConnecting) {
        return ConnectingIcon;
    } else if (isOffline) {
        return OfflineIcon;
    } 
    return OnlineIcon;
}

function ConnectionToggle() {
    const { isOffline, isConnecting } = useConnectionStore()
    const { syncTexts } = useWriteStore();
    const Icon = ConnectionIcon(isConnecting, isOffline)

    return (
        <button onClick={syncTexts}><Icon /></button>
    )
}

export default function Top() {
    return (
        <nav id="nav">
        <NavLink to="/" end>Write</NavLink>
        <NavLink to="/texts/">Texts</NavLink>
        {/* <NavLink to="/queue/">Local</NavLink> */ }
        <nav className="options">
        <Status>
            <ConnectionToggle />
        </Status>
        <ThemeToggle />
        </nav>
        </nav>
    );
}

