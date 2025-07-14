'use client';
import ParkingAreaItem from './parking-area-item';

interface ParkingLot {
    name: string;
    visible: boolean;
}

interface ParkingArea {
    name: string;
    visible: boolean;
    lots: ParkingLot[];
}

interface ParkingAreaListProps {
    areas: ParkingArea[];
    onEditArea?: (idx: number) => void;
    onDeleteArea?: (idx: number) => void;
    onAddLot?: (areaIdx: number) => void;
}

const ParkingAreaList = ({
    areas,
    onEditArea,
    onDeleteArea,
    onAddLot,
}: ParkingAreaListProps) => (
    <section className="mb-8">
        <div className="font-semibold text-base mb-4">
            주차장 구역 리스트{' '}
            <span className="text-red-500">{areas.length}</span>
        </div>
        {areas.map((area, idx) => (
            <ParkingAreaItem
                key={area.name}
                area={area}
                onEdit={() => onEditArea?.(idx)}
                onDelete={() => onDeleteArea?.(idx)}
                onAddLot={() => onAddLot?.(idx)}
            />
        ))}
        <button className="mt-2 px-4 py-2 bg-black text-white rounded font-semibold text-sm hover:bg-gray-800">
            주차장 추가
        </button>
    </section>
);

export default ParkingAreaList;
