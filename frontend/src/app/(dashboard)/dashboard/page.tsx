import HeroSection from '@/components/ui/herosection'
import Upcomingask from '@/components/dashboard/Upcomingtask'
import TodaysTask from '@/components/dashboard/Todaystask'

export default function ProfilePage(){
    return(
        <div>
            <HeroSection/>
            <div className="p-16 flex flex-col md:flex-row gap-8">
                <div className="flex-1 md:pr-8 md:border-r md:border-gray-300">
                <TodaysTask />
                </div>
                <div className="flex-1 md:pl-8">
                <Upcomingask />
                </div>
            </div>
        </div>
    )
}