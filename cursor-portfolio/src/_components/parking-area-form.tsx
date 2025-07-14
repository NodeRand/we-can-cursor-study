'use client';
import { useState } from 'react';

const ParkingAreaForm = () => {
    const [name, setName] = useState('');
    const [visible, setVisible] = useState(true);

    return (
        <form className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-6">
            <input
                className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none"
                placeholder="구역 이름 작성"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <label className="flex items-center gap-1 text-xs">
                <span>사용자 웹사이트 표시 여부</span>
                <button
                    type="button"
                    className={`w-10 h-6 rounded-full transition-colors duration-200 ${
                        visible ? 'bg-green-400' : 'bg-gray-300'
                    }`}
                    onClick={() => setVisible(v => !v)}
                >
                    <span
                        className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${
                            visible ? 'translate-x-4' : ''
                        }`}
                    ></span>
                </button>
                <span
                    className={`ml-1 font-semibold ${
                        visible ? 'text-green-600' : 'text-gray-400'
                    }`}
                >
                    {visible ? '표시' : '미표시'}
                </span>
            </label>
            <button
                type="submit"
                className="bg-black text-white rounded px-4 py-2 text-sm font-semibold hover:bg-gray-800"
            >
                구역 생성
            </button>
        </form>
    );
};

export default ParkingAreaForm;
