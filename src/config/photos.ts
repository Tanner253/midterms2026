// Candidate photos in /public/candidates, all from Wikimedia Commons.
// Every photo is public domain, CC0, CC BY, CC BY-SA or free to use, and all are credited on /credits/.
// Adding a candidate? Drop a photo in /public/candidates/<id>.jpg and add a line here.

export type Photo = { src: string; author: string; license: string; licenseUrl?: string; sourceUrl: string };

export const PHOTOS: Record<string, Photo> = {
  becerra: {"src": "/candidates/becerra.jpg", "author": "United States Department of Health and Human Services", "license": "Public domain", "sourceUrl": "https://commons.wikimedia.org/wiki/File:HHS_Xavier_Becerra_(cropped).jpg"},
  hilton: {"src": "/candidates/hilton.jpg", "author": "Gage Skidmore", "license": "CC BY 2.0", "licenseUrl": "https://creativecommons.org/licenses/by/2.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Steve_Hilton_(54233445987_crop).jpg"},
  talarico: {"src": "/candidates/talarico.jpg", "author": "Antonioaesparza", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:James_Talarico_Press_Conference_(centered).jpg"},
  paxton: {"src": "/candidates/paxton.jpg", "author": "Gage Skidmore", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Ken_Paxton_-_55022425595_(cropped).jpg"},
  "el-sayed": {"src": "/candidates/el-sayed.jpg", "author": "Conlan Houston", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Abdul_El-Sayed_meet-and-greet_by_Conlan_Houston_5_(cropped_2).jpg"},
  rogers: {"src": "/candidates/rogers.jpg", "author": "P.J. Siquig", "license": "Public domain", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Mike_Rogers_in_November_2019_(3x4_cropped).jpg"},
  jackson: {"src": "/candidates/jackson.jpg", "author": "ArenLeBrun", "license": "CC0", "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Troy_Jackson_in_the_Senate_Chamber_(cropped).jpg"},
  collins: {"src": "/candidates/collins.jpg", "author": "U.S. Congress", "license": "Public domain", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Senator_Susan_Collins_2014_official_portrait_(1).jpg"},
  brown: {"src": "/candidates/brown.jpg", "author": "U.S. Senate Photographic Services; Rebecca Hammel", "license": "Public domain", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Sherrod_Brown_117th_Congress_(2)_(3x4_crop).jpg"},
  husted: {"src": "/candidates/husted.jpg", "author": "United States Senate", "license": "Public domain", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Sen._Jon_Husted_official_portrait,_119th_Congress_(cropped_2).jpg"},
  peltola: {"src": "/candidates/peltola.jpg", "author": "Leah Herman, House Creative Services", "license": "Public domain", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Mary_Peltola_Congressional_Member_Portrait_(2)_(cropped).jpeg"},
  sullivan: {"src": "/candidates/sullivan.jpg", "author": "Senator Sullivan", "license": "CC0", "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Senator_Sullivan_Memorial_Day_2024_(cropped).jpg"},
  ricketts: {"src": "/candidates/ricketts.jpg", "author": "United States Congress", "license": "Public domain", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Sen._Pete_Ricketts_official_portrait,_118th_Congress_(cropped).jpg"},
  osborn: {"src": "/candidates/osborn.jpg", "author": "Ramseywill", "license": "CC BY 4.0", "licenseUrl": "https://creativecommons.org/licenses/by/4.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Osborn_Headshot_2_(cropped)_(cropped).jpg"},
  hamilton: {"src": "/candidates/hamilton.jpg", "author": "Western Pennsylvania Conference - United Methodist Church", "license": "Public domain", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Adam_Hamilton_at_podium_(cropped_2).jpg"},
  marshall: {"src": "/candidates/marshall.jpg", "author": "USDAgov", "license": "Public domain", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Roger_Marshall_in_January_2025_(cropped).jpg"},
  turek: {"src": "/candidates/turek.jpg", "author": "Iowa General Assembly", "license": "Copyrighted free use", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Joshua_Turek_(croppedb).jpg"},
  hinson: {"src": "/candidates/hinson.jpg", "author": "Office of Congresswoman Ashley Hinson", "license": "Public domain", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Congresswoman_Ashley_Hinson_Official_portrait_(cropped).jpg"},
  "kreiss-tomkins": {"src": "/candidates/kreiss-tomkins.jpg", "author": "Unknown author", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:JKTphoto_(cropped).jpg"},
  wilson: {"src": "/candidates/wilson.jpg", "author": "AKSenMajority", "license": "Public domain", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Bernadette_Wilson_at_Chris_Birch_memorial_service.jpg"},
  hinojosa: {"src": "/candidates/hinojosa.jpg", "author": "LBJ Library", "license": "Public domain", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Gina_Hinojosa_at_LBJ_Library_Forum_(3x4_cropped).jpg"},
  abbott: {"src": "/candidates/abbott.jpg", "author": "USDAgov", "license": "Public domain", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Greg_Abbott_2026.jpg"},
  andrews: {"src": "/candidates/andrews.jpg", "author": "Stimpus1", "license": "CC0", "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Annie_Andrews_Greenville_(cropped_2).jpg"},
  graham: {"src": "/candidates/graham.jpg", "author": "Rosa Pineda, United States Senate", "license": "Public domain", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Official_portrait_of_Darline_Graham,_member_of_the_United_States_Senate_from_South_Carolina_(2026).jpg"},
};
