import { useState, useRef } from 'react';
import { Icon, Switch } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux';
import { setSettings, setSettingsBoard } from '../../redux/features/chess';

export default function ChessSettings() {
    
    const { settings } = useSelector((state) => state.chess)
    const dispatch = useDispatch()
    
    const [change, setChange] = useState(settings)
    const [selectedLightColor, setSelectedLightColor] = useState(settings.lightSquareColor || '#FFFFFF')
    const [selectedDarkColor, setSelectedDarkColor] = useState(settings.darkSquareColor || '#5309B3')

    const lightColors = [
        { color: '#F0D9B5', title: 'Classic yellow' },
        { color: '#FFFFFF', title: 'White' },
        { color: '#E8E8E8', title: 'Light gray' },
        { color: '#FFEAA7', title: 'Light yellow' },
        { color: '#FAB1A0', title: 'Light orange' },
        { color: '#FD79A8', title: 'Light pink' }
    ];

    const darkColors = [
        { color: '#B58863', title: 'Classic brown' },
        { color: '#769656', title: 'Green' },
        { color: '#8B4513', title: 'Dark brown' },
        { color: '#2D3436', title: 'Black gray' },
        { color: '#5309B3', title: 'Purple' },
        { color: '#0984E3', title: 'Blue' }
    ]

    const handleColorSelect = (color, type) => {
        if (type === 'light') {
            setSelectedLightColor(color);
            setChange(prev => ({ ...prev, lightSquareColor: color }));
        } else {
            setSelectedDarkColor(color);
            setChange(prev => ({ ...prev, darkSquareColor: color }));
        }
    }

    const handleCustomColorChange = (e, type) => {
        const color = e.target.value;
        if (type === 'light') {
            setSelectedLightColor(color);
            setChange(prev => ({ ...prev, lightSquareColor: color }));
        } else {
            setSelectedDarkColor(color);
            setChange(prev => ({ ...prev, darkSquareColor: color }));
        }
    }

    const handleSwitchChange = (e, field) => {
        setChange(prev => ({
            ...prev,
            [field]: e.target.checked
        }))
    }

    const handleSaveChange = () => {
        localStorage.setItem("chess-theme", JSON.stringify(change))
        dispatch(setSettings(change))
        dispatch(setSettingsBoard(false))
    }

    const handleBackupChange = () => {
        setChange(settings)
        setSelectedLightColor(settings.lightSquareColor)
        setSelectedDarkColor(settings.darkSquareColor)
    }

    const renderChessboardPreview = () => {
        const board = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const isLightSquare = (i + j) % 2 === 0;
                const color = isLightSquare ? change.lightSquareColor : change.darkSquareColor;

                board.push(
                    <div
                        key={`${i}-${j}`}
                        className="preview-square"
                        style={{ backgroundColor: color }}
                    ></div>
                );
            }
        }
        return board;
    }

    return (
        <div className="chess-settings-container">
            <div className="preview-section">
                <div className="preview-title flex-div"><Icon>visibility</Icon><p>Preview</p></div>
                <div className={`chess-preview ${change.showBorder ? "border" : "none"}`}>
                    {renderChessboardPreview()}
                </div>
            </div>

            <div className="settings-section">
                <h1>Settings</h1>
                <Icon 
                    className="close-btn"
                    onClick={() => { dispatch(setSettingsBoard(false)) }}
                >close</Icon>
                <div className="settings-grid">
                    <div className="game-settings">
                        <div className="settings-title flex-div">
                            <Icon className="settings-icon">sports_esports</Icon>
                            <p>Settings in game</p>
                        </div>

                        <div className="setting-card flex-div">
                            <div className="setting-info">
                                <h3>Show suggested moves</h3>
                                <p>Shows the possible moves of a piece</p>
                            </div>
                            <Switch 
                                checked={change.showHints} 
                                onChange={(e) => { handleSwitchChange(e, "showHints") }}/>
                        </div>

                        <div className="setting-card flex-div">
                            <div className="setting-info">
                                <h3>Automatically flip the chessboard</h3>
                                <p>Automatically rotate the chess board according to the move</p>
                            </div>
                            <Switch 
                                checked={change.autoRotate} 
                                onChange={(e) => { handleSwitchChange(e, "autoRotate") }} 
                            />
                        </div>

                        <div className="setting-card flex-div">
                            <div className="setting-info">
                                <h3>Animation effects</h3>
                                <p>Smoother movement effects</p>
                            </div>
                            <Switch 
                                checked={change.animation} 
                                onChange={(e) => { handleSwitchChange(e, "animation") }}    
                            />
                        </div>

                        <div className="setting-card flex-div">
                            <div className="setting-info">
                                <h3>Show coordinates</h3>
                                <p>Show numbers and letters on the board</p>
                            </div>
                            <Switch 
                                checked={change.showCoordinates} 
                                onChange={(e) => { handleSwitchChange(e, "showCoordinates") }}
                            />
                        </div>

                        <div className="setting-card flex-div">
                            <div className="setting-info">
                                <h3>Show board border</h3>
                                <p>Add decorative borders around the board</p>
                            </div>
                            <Switch
                                checked={change.showBorder}
                                onChange={(e) => { handleSwitchChange(e, "showBorder") }}
                            />
                        </div>
                    </div>

                    <div className="appearance-settings">
                        <div className="settings-title flex-div">
                            <Icon className="settings-icon">palette</Icon>
                            <p>Interface settings</p>
                        </div>
                        <div className="setting-card setting-card__col flex-div">
                            <h3>Light colored</h3>
                            <div className="color-grid">
                                {lightColors.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`color-option ${selectedLightColor === item.color ? 'selected' : ''}`}
                                        style={{ backgroundColor: item.color }}
                                        title={item.title}
                                        onClick={() => handleColorSelect(item.color, 'light')}
                                    ></div>
                                ))}
                            </div>
                            <div className="custom-color">
                                <div className="custom-color-label flex-div">
                                    <Icon sx={{
                                        color: `${change.lightSquareColor}`
                                    }}>format_color_fill</Icon>
                                    <p>Customize:</p>
                                </div>
                                <input
                                    type="color"
                                    className="custom-color-input"
                                    value={selectedLightColor}
                                    onChange={(e) => handleCustomColorChange(e, 'light')}
                                />
                            </div>
                        </div>

                        <div className="setting-card setting-card__col flex-div">
                            <h3>Dark colored</h3>
                            <div className="color-grid">
                                {darkColors.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`color-option ${selectedDarkColor === item.color ? 'selected' : ''}`}
                                        style={{ backgroundColor: item.color }}
                                        title={item.title}
                                        onClick={() => handleColorSelect(item.color, 'dark')}
                                    ></div>
                                ))}
                            </div>
                            <div className="custom-color">
                                <div className="custom-color-label flex-div">
                                    <Icon sx={{
                                        color: `${change.darkSquareColor}`
                                    }}>format_color_fill</Icon>
                                    <p>Customize:</p>
                                </div>
                                <input
                                    type="color"
                                    className="custom-color-input"
                                    value={selectedDarkColor}
                                    onChange={(e) => handleCustomColorChange(e, 'dark')}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="action-buttons">
                    <button 
                        className="btn-save"
                        onClick={() => {handleSaveChange()}}
                    >
                        Save
                    </button>
                    <button 
                        className="btn-reset"
                        onClick={() => { handleBackupChange() }}
                    >
                        Return
                    </button>
                </div>
            </div>
        </div>
    );
};