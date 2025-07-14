'use client';
import { useState } from 'react';
import ParkingLotList from './parking-lot-list';

interface ParkingLot {
    name: string;
    visible: boolean;
}

interface ParkingArea {
    name: string;
    visible: boolean;
    lots: ParkingLot[];
}

interface ParkingAreaItemProps {
    area: ParkingArea;
    onEdit?: () => void;
    onDelete?: () => void;
    onAddLot?: () => void;
}

const ParkingAreaItem = ({
    area,
    onEdit,
    onDelete,
    onAddLot,
}: ParkingAreaItemProps) => {
    const [open, setOpen] = useState(true);
    return (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow">
            <div className="flex items-center gap-2 mb-2">
                <button
                    onClick={() => setOpen(o => !o)}
                    className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white"
                >
                    <span
                        className={`transition-transform duration-200 ${
                            open ? 'rotate-90' : ''
                        }`}
                    >
                        ▶
                    </span>
                </button>
                <span className="font-semibold text-sm flex-1">
                    {area.name}
                </span>
                <button
                    className={`w-10 h-5 rounded-full transition-colors duration-200 ${
                        area.visible ? 'bg-green-400' : 'bg-gray-300'
                    }`}
                    title="표시/미표시"
                >
                    <span
                        className={`block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
                            area.visible ? 'translate-x-5' : ''
                        }`}
                    ></span>
                </button>
                <button
                    className="text-xs text-gray-500 hover:text-black dark:hover:text-white px-2"
                    onClick={onEdit}
                >
                    이름 변경
                </button>
                <button
                    className="text-xs text-red-500 hover:underline px-2"
                    onClick={onDelete}
                >
                    삭제
                </button>
            </div>
            {open && (
                <>
                    <ParkingLotList lots={area.lots} />
                    <button
                        className="mt-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-semibold hover:bg-gray-300 dark:hover:bg-gray-600"
                        onClick={onAddLot}
                    >
                        주차장 추가
                    </button>
                </>
            )}
        </div>
    );
};

export default ParkingAreaItem;
