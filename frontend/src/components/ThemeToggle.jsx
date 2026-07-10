import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex bg-gray-100 rounded-lg p-1">
            <button onClick={() => setTheme('light')} className={`p-2 rounded-md ${theme === 'light' ? 'bg-white shadow' : ''}`}>
                <Sun size={16} />
            </button>
            <button onClick={() => setTheme('system')} className={`p-2 rounded-md ${theme === 'system' ? 'bg-white shadow' : ''}`}>
                <Monitor size={16} />
            </button>
            <button onClick={() => setTheme('dark')} className={`p-2 rounded-md ${theme === 'dark' ? 'bg-white shadow' : ''}`}>
                <Moon size={16} />
            </button>
        </div>
    );
};

export default ThemeToggle;