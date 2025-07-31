import { useTranslation } from 'react-i18next';
import asim from '../../images/asim.jpeg'
import hassan from '../../images/haasan.jpeg'
import awais from '../../images/awais.jpg'
import UrduFont from '../../components/utills/UrduFont';

const About = () => {
  
  const teamMembers = [hassan, awais, asim]
  const { t } = useTranslation()
  
  return (
    <div className="min-h-screen text-gray-800 lg:mt-6">
      {/* Hero Section */}
      <header className='w-full h-[60svh] min-[500px]:h-[80svh] lg:h-[85svh] relative'>
        <div className='w-full h-full bg-[#101820] mb-4 overflow-hidden'>
            <div className='w-[calc(100%+25px)] h-1/4 absolute -left-2 bottom-0 rotate-1'>
                <svg className='absolute bottom-2 min-[692px]:-bottom-5 min-[836px]:-bottom-7 lg:-bottom-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#facc15" fillOpacity="1" d="M0,128L48,144C96,160,192,192,288,181.3C384,171,480,117,576,133.3C672,149,768,235,864,240C960,245,1056,171,1152,160C1248,149,1344,203,1392,229.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </div>
            <svg className='w-[calc(100%+25px)] absolute -bottom-3 min-[692px]:-bottom-10 min-[836px]:-bottom-12 lg:-bottom-14' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#fff" fillOpacity="1" d="M0,128L48,144C96,160,192,192,288,181.3C384,171,480,117,576,133.3C672,149,768,235,864,240C960,245,1056,171,1152,160C1248,149,1344,203,1392,229.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
        </div>
      </header>
      <section className='absolute top-[16%] min-[500px]:top-1/4 left-1/2 -translate-x-1/2 w-full flex flex-col justify-center items-center gap-y-8 sm:gap-y-12'>
        <div className="h-full w-full flex justify-center items-center max-[500px]:mt-8">
          <div className="site-heading relative text-center space-y-5">
          <h1 className='text-center max-[506px]:text-4xl text-6xl text-white'>
            <UrduFont><span className='text-yellow-400'>{t('aboutPage.titleP1')}</span> {t('aboutPage.titleP2')}</UrduFont>
          </h1>
              <p className="max-[506px]:text-sm max-sm:px-2 sm:w-3/4 lg:w-2/3 mx-auto text-[clamp(18px,1.6vw,40px)] font-semibold text-gray-400"> 
                <UrduFont>{t('aboutPage.heroDescription')}</UrduFont>
              </p>
          </div>
        </div>
      </section>

      {/* Project Description Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className='text-center text-4xl text-yellow-500'>
            <UrduFont><span className='text-[#101820]'>{t('aboutPage.visionMissionTitleP1')} </span> {t('aboutPage.visionMissionTitleP2')}</UrduFont>
          </h1>
          {/* <h2 className="text-3xl font-bold  mb-6 text-center">Our Vision & Mission</h2> */}
          <p className="text-lg leading-relaxed my-4 text-center">
            <UrduFont>{t("aboutPage.visionMissionDes.0")}</UrduFont>
          </p>
          <p className="text-lg leading-relaxed text-center">
            <UrduFont>{t('aboutPage.visionMissionDes.1')}</UrduFont>
         </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className='text-center text-4xl text-yellow-500 font-bold mb-5'>
            <UrduFont><span className='text-[#101820]'>{t('aboutPage.teamTitleP1')} </span> {t('aboutPage.teamTitleP2')}</UrduFont>
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Member 1: Awais */}
            {teamMembers.map((member, i)=>{
              return(
                <div key={i} className="bg-[#101820] shadow-lg rounded-lg p-6 text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-yellow-500">
                    <img src={member} alt={t(`aboutPage.teamMembers.${i}.name`)} className="w-full h-full object-fill text-white/60" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-200"><UrduFont>{t(`aboutPage.teamMembers.${i}.name`)}</UrduFont></h3>
                  <p className="text-lg font-medium text-yellow-400 mb-2"><UrduFont>{t(`aboutPage.teamMembers.${i}.role`)}</UrduFont></p>
                  <p className="text-gray-400">
                    <UrduFont>{t(`aboutPage.teamMembers.${i}.description`)}</UrduFont>
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
