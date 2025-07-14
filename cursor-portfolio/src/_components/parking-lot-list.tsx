'use client';
import { useState } from 'react';
import ParkingLotItem from './parking-lot-item';

interface ParkingLot {
    name: string;
    visible: boolean;
}

interface ParkingLotListProps {
    lots: ParkingLot[];
    onEdit?: (idx: number) => void;
    onDelete?: (idx: number) => void;
}

const ParkingLotList = ({
    lots: initialLots,
    onEdit,
    onDelete,
}: ParkingLotListProps) => {
    const [lots, setLots] = useState(initialLots);
    const handleToggle = (idx: number, visible: boolean) => {
        setLots(lots =>
            lots.map((lot, i) => (i === idx ? { ...lot, visible } : lot)),
        );
    };
    return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 mt-2">
            <div className="text-xs text-gray-500 mb-2">주차장 리스트</div>
            {lots.map((lot, idx) => (
                <ParkingLotItem
                    key={lot.name}
                    name={lot.name}
                    visible={lot.visible}
                    onEdit={() => onEdit?.(idx)}
                    onDelete={() => onDelete?.(idx)}
                    onToggle={visible => handleToggle(idx, visible)}
                />
            ))}
        </div>
    );
};

export default ParkingLotList;
