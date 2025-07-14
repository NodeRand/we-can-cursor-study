'use client';
import { useState } from 'react';

interface ParkingLotItemProps {
    name: string;
    visible: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onToggle?: (visible: boolean) => void;
}

const ParkingLotItem = ({
    name,
    visible,
    onEdit,
    onDelete,
    onToggle,
}: ParkingLotItemProps) => {
    const [isPressed, setIsPressed] = useState(false);
    return (
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 mb-2 text-xs shadow-sm">
            <span
                className="w-3 h-3 bg-gray-300 dark:bg-gray-700 rounded cursor-move mr-2"
                title="드래그"
            />
            <span className="flex-1 text-gray-700 dark:text-gray-200">
                {name}
            </span>
            <button
                className={`w-10 h-5 rounded-full transition-colors duration-300 ${
                    visible ? 'bg-green-400' : 'bg-gray-300'
                } flex items-center px-1 relative`}
                title="표시/미표시"
                onClick={() => onToggle?.(!visible)}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                onMouseLeave={() => setIsPressed(false)}
                style={{
                    boxShadow: isPressed ? '0 0 0 4px #a7f3d0' : undefined,
                }}
            >
                <span
                    className={`block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${
                        visible ? 'translate-x-5' : ''
                    } ${isPressed ? 'scale-90' : 'scale-100'}`}
                    style={{
                        transitionTimingFunction:
                            'cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                ></span>
            </button>
            <button
                className="text-gray-500 hover:text-black dark:hover:text-white px-2"
                onClick={onEdit}
            >
                편집
            </button>
            <button
                className="text-red-500 hover:underline px-2"
                onClick={onDelete}
            >
                삭제
            </button>
        </div>
    );
};

export default ParkingLotItem;
