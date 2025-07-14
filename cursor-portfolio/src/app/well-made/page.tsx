'use client';
import PageNavBar from '../../_components/page-nav-bar';
import ProfileCard from '../../_components/profile-card';
import ProfileInfo from '../../_components/profile-info';
import IntroduceCard from '../../_components/introduce-card';
import IntroduceContent from '../../_components/introduce-content';
import TechSkillCard from '../../_components/tech-skill-card';
import TechSkillList from '../../_components/tech-skill-list';

const WellMadePage = () => (
    <div className="min-h-screen bg-gray-50 py-10 px-2">
        <PageNavBar />
        <ProfileCard>
            <div className="font-semibold text-base mb-4 border-b pb-2">
                Profile : Title
            </div>
            <ProfileInfo />
        </ProfileCard>
        <IntroduceCard>
            <div className="font-semibold text-base mb-4 border-b pb-2">
                Introduce
            </div>
            <IntroduceContent />
        </IntroduceCard>
        <TechSkillCard>
            <div className="font-semibold text-base mb-4 border-b pb-2">
                Tech Skill
            </div>
            <TechSkillList />
        </TechSkillCard>
    </div>
);

export default WellMadePage;
