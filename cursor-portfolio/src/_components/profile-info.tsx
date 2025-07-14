'use client';

const ProfileInfo = () => (
    <div className="flex gap-8">
        {/* 사진 */}
        <div className="flex-shrink-0 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full border-2 border-gray-400 flex items-center justify-center text-2xl text-gray-500 mb-4 bg-gray-100">
                사진
            </div>
        </div>
        {/* 정보 */}
        <div className="flex-1 text-sm text-gray-900">
            <div className="mb-2 font-bold">_I AM</div>
            <div className="mb-1">
                이름 : <span className="font-semibold">이프로</span>
            </div>
            <div className="mb-1">
                포지션: PM 서비스 기획 / FE Developer(jr)
            </div>
            <hr className="my-3 border-gray-300" />
            <div className="mb-2 font-bold">_Contact</div>
            <div className="mb-1">Email : leepro@naver.com</div>
            <div className="mb-1">Phone : +082 - 1234-5678</div>
            <hr className="my-3 border-gray-300" />
            <div className="mb-2 font-bold">_Channel</div>
            <div className="flex items-center gap-2 mb-1">
                <span>SNS :</span>
                <input
                    className="border rounded px-2 py-1 text-xs flex-1 text-gray-900"
                    placeholder="SNS 주소"
                />
            </div>
            <div className="flex items-center gap-2">
                <span>GitHub :</span>
                <input
                    className="border rounded px-2 py-1 text-xs flex-1 text-gray-900"
                    placeholder="GitHub 주소"
                />
            </div>
        </div>
    </div>
);

export default ProfileInfo;
