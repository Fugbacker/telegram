import {
  // Fa Icons (Font Awesome)
  FaUser, // blogs
  FaNewspaper, // news
  FaLaugh, // entertainment
  FaLaptopCode, // tech
  FaChartLine, // economics
  FaBusinessTime, // business
  FaBitcoin, // crypto
  FaPlane, // travels
  FaBullhorn, // marketing
  FaBrain, // psychology
  FaPalette, // design
  FaLandmark, // politics
  FaTheaterMasks, // art
  FaGavel, // law
  FaGraduationCap, // education
  FaBook, // books
  FaLanguage, // language
  FaBriefcase, // career
  FaLightbulb, // edutainment
  FaChalkboardTeacher, // courses
  FaFutbol, // sport
  FaSpa, // beauty
  FaMedkit, // medicine
  FaHeartbeat, // health
  FaImages, // pics
  FaLaptop, // apps
  FaVideo, // video
  FaMusic, // music
  FaGamepad, // games
  FaUtensils, // food
  FaQuoteRight, // quotes
  FaHandsHelping, // handmade
  FaBaby, // babies
  FaTree, // nature
  FaCouch, // construction (интерьер)
  FaHammer, // construction (строительство)
  FaPaperPlane, // telegram
  FaInstagram, // instagram
  FaTag, // sales
  FaCar, // transport
  FaCross, // religion
  FaMagic, // esoterics
  FaSkull, // darknet
  FaDice, // gambling
  FaExclamationTriangle, // shock
  FaHeart, // erotica (можно FaHeartBroken)
  FaUserAltSlash, // adult
  FaEllipsisH, // other
} from "react-icons/fa";

import {
  // Md Icons (Material Design)
  MdPsychology, // psychology (альтернатива)
  MdLocalLibrary, // books (альтернатива)
  MdWork, // career (альтернатива)
  MdSchool, // courses (альтернатива)
  MdDirectionsCar, // transport (альтернатива)
  MdLocalHospital, // medicine (альтернатива)
  MdFitnessCenter, // health (альтернатива)
  MdBrush, // design (альтернатива)
  MdTheaterComedy, // entertainment (альтернатива)
  MdAttachMoney, // economics (альтернатива)
  MdBusiness, // business (альтернатива)
  MdFlight, // travels (альтернатива)
  MdCampaign, // marketing (альтернатива)
  MdComputer, // tech (альтернатива)
  MdNewspaper, // news (альтернатива)
  MdPalette, // art (альтернатива)
  MdEmojiFoodBeverage, // food (альтернатива)
  MdVideogameAsset, // games (альтернатива)
  MdMusicNote, // music (альтернатива)
  MdMovie, // video (альтернатива)
  MdApps, // apps (альтернатива)
  MdPhotoLibrary, // pics (альтернатива)
  MdMenuBook, // quotes (альтернатива)
  MdFamilyRestroom, // babies (альтернатива)
  MdNature, // nature (альтернатива)
  MdHome, // construction (альтернатива)
  MdSports, // sport (альтернатива)
  MdLocalFlorist, // beauty (альтернатива)
  MdLocalOffer, // sales (альтернатива)
  MdDirectionsBus, // transport (альтернатива)
  MdChurch, // religion (альтернатива)
  MdPublic, // politics (альтернатива)
  MdScience, // edutainment (альтернатива)
  MdEmojiObjects, // esoterics (альтернатива)
  MdSecurity, // darknet (альтернатива)
  MdCasino, // gambling (альтернатива)
  MdWarning, // shock (альтернатива)
  MdExplicit, // adult (альтернатива)
  MdMoreHoriz, // other (альтернатива)
} from "react-icons/md";

import {
  // Tb Icons (Tabler Icons)
  TbBrandTelegram, // telegram (альтернатива)
  TbBrandInstagram, // instagram (альтернатива)
  TbHeartHandshake, // handmade (альтернатива)
  TbBuildingEstate, // construction (альтернатива)
  TbPlaneInflight, // travels (альтернатива)
  TbChartInfographic, // edutainment (альтернатива)
  TbBook2, // books (альтернатива)
  TbDeviceLaptop, // tech (альтернатива)
  TbBusinessplan, // business (альтернатива)
  TbCoinBitcoin, // crypto (альтернатива)
  TbMoodKid, // babies (альтернатива)
  TbForklift, // transport (альтернатива)
  TbCrane, // construction (альтернатива)
  TbSportBillard, // sport (альтернатива)
  TbBrandPicsart, // pics (альтернатива)
  TbBrandCampaignmonitor, // marketing (альтернатива)
  TbBrandCodesandbox, // apps (альтернатива)
  TbMovie, // video (альтернатива)
  TbMusic, // music (альтернатива)
  TbBrandXbox, // games (альтернатива)
  TbChefHat, // food (альтернатива)
  TbQuote, // quotes (альтернатива)
  TbPlant, // nature (альтернатива)
  TbFlower, // beauty (альтернатива)
  TbTheater, // entertainment (альтернатива)
  TbNews, // news (альтернатива)
  TbPalette, // design (альтернатива)
  TbArtboard, // art (альтернатива)
  TbScale, // law (альтернатива)
  TbSchool, // education (альтернатива)
  TbLanguage, // language (альтернатива)
  TbBriefcase, // career (альтернатива)
  TbChartLine, // economics (альтернатива)
  TbHeart, // erotica (альтернатива)
  TbSkull, // darknet (альтернатива)
  TbDice, // gambling (альтернатива)
  TbExclamationMark, // shock (альтернатива)
  TbUserExclamation, // adult (альтернатива)
  TbDots, // other (альтернатива)
} from "react-icons/tb";

// Выберите один набор иконок для каждой категории.
// Здесь представлены варианты, включая альтернативы.
// Для простоты я буду использовать основной набор (Fa), если нет лучшей альтернативы в Tb или Md.

const categoryIconsMap = {
  blogs: <FaUser />, // или <FaBlog /> если доступен
  news: <FaNewspaper />, // или <TbNews /> или <MdNewspaper />
  entertainment: <FaLaugh />, // или <MdTheaterComedy /> или <TbTheater />
  tech: <FaLaptopCode />, // или <MdComputer /> или <TbDeviceLaptop />
  economics: <FaChartLine />, // или <MdAttachMoney /> или <TbChartLine /> или <VscGraph />
  business: <FaBusinessTime />, // или <MdBusiness /> или <TbBusinessplan />
  crypto: <FaBitcoin />, // или <CiBitcoin /> или <TbCoinBitcoin />
  travels: <FaPlane />, // или <MdFlight /> или <TbPlaneInflight />
  marketing: <FaBullhorn />, // или <MdCampaign /> или <TbBrandCampaignmonitor />
  psychology: <FaBrain />, // или <MdPsychology />
  design: <FaPalette />, // или <MdBrush /> или <TbPalette /> или <GoProject />
  politics: <FaLandmark />, // или <MdPublic />
  art: <FaTheaterMasks />, // или <MdPalette /> или <TbArtboard />
  law: <FaGavel />, // или <TbScale />
  education: <FaGraduationCap />, // или <TbSchool /> или <MdSchool />
  books: <FaBook />, // или <MdLocalLibrary /> или <TbBook2 />
  language: <FaLanguage />, // или <TbLanguage />
  career: <FaBriefcase />, // или <MdWork /> или <TbBriefcase />
  edutainment: <FaLightbulb />, // или <MdScience /> или <TbChartInfographic />
  courses: <FaChalkboardTeacher />, // или <MdSchool /> или <TbSchool />
  sport: <FaFutbol />, // или <MdSports /> или <TbSportBillard />
  beauty: <FaSpa />, // или <MdLocalFlorist /> или <TbFlower />
  medicine: <FaMedkit />, // или <MdLocalHospital />
  health: <FaHeartbeat />, // или <MdFitnessCenter />
  pics: <FaImages />, // или <MdPhotoLibrary /> или <TbBrandPicsart />
  apps: <FaLaptop />, // или <MdApps /> или <TbBrandCodesandbox />
  video: <FaVideo />, // или <MdMovie /> или <TbMovie />
  music: <FaMusic />, // или <MdMusicNote /> или <TbMusic />
  games: <FaGamepad />, // или <MdVideogameAsset /> или <TbBrandXbox />
  food: <FaUtensils />, // или <MdEmojiFoodBeverage /> или <TbChefHat />
  quotes: <FaQuoteRight />, // или <MdMenuBook /> или <TbQuote />
  handmade: <FaHandsHelping />, // или <TbHeartHandshake />
  babies: <FaBaby />, // или <MdFamilyRestroom /> или <TbMoodKid />
  nature: <FaTree />, // или <MdNature /> или <TbPlant />
  construction: <FaCouch />, // или <MdHome /> или <TbBuildingEstate /> или <TbCrane />
  telegram: <FaPaperPlane />, // или <TbBrandTelegram />
  instagram: <FaInstagram />, // или <TbBrandInstagram />
  sales: <FaTag />, // или <MdLocalOffer />
  transport: <FaCar />, // или <MdDirectionsCar /> или <TbForklift />
  religion: <FaCross />, // или <MdChurch />
  esoterics: <FaMagic />, // или <MdEmojiObjects />
  darknet: <FaSkull />, // или <MdSecurity /> или <TbSkull />
  gambling: <FaDice />, // или <MdCasino /> или <TbDice />
  shock: <FaExclamationTriangle />, // или <MdWarning /> или <TbExclamationMark />
  erotica: <FaHeart />, // или <TbHeart />
  adult: <FaUserAltSlash />, // или <MdExplicit /> или <TbUserExclamation />
  other: <FaEllipsisH />, // или <MdMoreHoriz /> или <TbDots />
};

export default categoryIconsMap;