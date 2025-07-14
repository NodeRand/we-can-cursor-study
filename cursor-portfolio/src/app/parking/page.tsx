'use client';
import PageNavBar from '../../_components/page-nav-bar';
import HeaderBar from '../../_components/header-bar';
import Sidebar from '../../_components/sidebar';
import MainContainer from '../../_components/main-container';
import ParkingAreaForm from '../../_components/parking-area-form';
import ParkingAreaList from '../../_components/parking-area-list';
import { useState } from 'react';

const initialAreas = [
    {
        name: '서쪽 구역',
        visible: true,
        lots: [
            { name: '주차장 1', visible: true },
            { name: '주차장 2', visible: false },
            { name: '주차장 3', visible: true },
            { name: '주차장 4', visible: true },
        ],
    },
    {
        name: '동쪽 구역',
        visible: false,
        lots: [{ name: '주차장 5', visible: false }],
    },
    {
        name: '남쪽 구역',
        visible: false,
        lots: [],
    },
];

const ParkingPage = () => {
    const [areas] = useState(initialAreas);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <PageNavBar />
            <HeaderBar />
            <div className="flex flex-1">
                <Sidebar />
                <MainContainer>
                    <div className="mb-8">
                        <div className="font-bold text-xl mb-1">
                            주차장 리스트
                        </div>
                        <div className="text-gray-500 text-xs mb-4">
                            해당 페이지/기능에 대한 소개 설명
                        </div>
                        <ParkingAreaForm />
                    </div>
                    <ParkingAreaList areas={areas} />
                </MainContainer>
            </div>
        </div>
    );
};

export default ParkingPage;
