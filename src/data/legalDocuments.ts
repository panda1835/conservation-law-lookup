// Import the JSON data
import nd06Data from "@/lib/nd06_2019.json";
import nd64Data from "@/lib/nd64_2019.json";
import nd84Data from "@/lib/nd84_2021.json";
import nd160Data from "@/lib/nd160_2013.json";
import tt27Data from "@/lib/tt27_2025.json";

// Define types based on new structure
export interface LawEntry {
  name: {
    vi: string;
    en: string;
  };
  value: string;
  note: string;
}

export interface Species {
  scientific_name: {
    value: string;
    note: string;
  };
  common_name: {
    value: string;
    note: string;
  };
  kingdom_latin: string;
  kingdom_vi: string;
  phylum_latin: string;
  phylum_vi: string;
  class_latin: string;
  class_vi: string;
  order_latin: string;
  order_vi: string;
  family_latin: string;
  family_vi: string;
  note: string;
  laws: LawEntry[];
}

export interface LegalDocument {
  id: string;
  name: {
    vi: string;
    en: string;
  };
  shortName: {
    vi: string;
    en: string;
  };
  data: Species[];
  url: string;
  description: {
    vi: string;
    en: string;
  };
}

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    id: "nd160",
    name: {
      vi: "Nghị định số 160/2013/NĐ-CP của Chính phủ: Về tiêu chí xác định loài và chế độ quản lý loài thuộc Danh mục loài nguy cấp, quý, hiếm được ưu tiên bảo vệ.",
      en: "Decree No. 160/2013/ND-CP of the Government: On the criteria for identifying species and the management regime for species in the List of endangered, precious and rare species prioritized for protection.",
    },
    shortName: {
      vi: "NĐ 160/2013",
      en: "Decree 160/2013",
    },
    data: nd160Data as Species[],
    url: "https://chinhphu.vn/default.aspx?pageid=27160&docid=170893",
    description: {
      vi: "",
      en: "",
    },
  },
  {
    id: "nd06",
    name: {
      vi: "Nghị định số 06/2019/NĐ-CP của Chính phủ: Về quản lý thực vật rừng, động vật rừng nguy cấp, quý, hiếm và thực thi Công ước về buôn bán quốc tế các loài động vật, thực vật hoang dã nguy cấp.",
      en: "Decree No. 06/2019/ND-CP of the Government: On the management of endangered, precious and rare forest plants and animals and the implementation of the Convention on International Trade in Endangered Species of Wild Fauna and Flora.",
    },
    shortName: {
      vi: "NĐ 06/2019",
      en: "Decree 06/2019",
    },
    data: nd06Data as Species[],
    url: "https://vanban.chinhphu.vn/default.aspx?pageid=27160&docid=196022",
    description: {
      vi: "",
      en: "",
    },
  },
  {
    id: "nd64",
    name: {
      vi: "Nghị định số 64/2019/NĐ-CP của Chính phủ: Sửa đổi Điều 7 Nghị định số 160/2013/NĐ-CP ngày 12 tháng 11 năm 2013 của Chính phủ về tiêu chí xác định loài và chế độ quản lý loài thuộc Danh mục loài nguy cấp, quý, hiếm được ưu tiên bảo vệ.",
      en: "Decree No. 64/2019/ND-CP of the Government: Amending Article 7 of Decree No. 160/2013/ND-CP dated November 12, 2013 of the Government on the criteria for identifying species and the management regime for species in the List of endangered, precious and rare species prioritized for protection.",
    },
    shortName: {
      vi: "NĐ 64/2019",
      en: "Decree 64/2019",
    },
    data: nd64Data as Species[],
    url: "https://chinhphu.vn/default.aspx?pageid=27160&docid=197392",
    description: {
      vi: "",
      en: "",
    },
  },
  {
    id: "nd84",
    name: {
      vi: "Nghị định số 84/2021/NĐ-CP của Chính phủ: Sửa đổi, bổ sung một số điều của Nghị định số 06/2019/NĐ-CP ngày 22 tháng 01 năm 2019 của Chính phủ về quản lý thực vật rừng, động vật rừng nguy cấp, quý, hiếm và thực thi Công ước về buôn bán quốc tế các loài động vật, thực vật hoang dã nguy cấp.",
      en: "Decree No. 84/2021/ND-CP of the Government: Amending and supplementing a number of articles of Decree No. 06/2019/ND-CP dated January 22, 2019 of the Government on the management of endangered, precious and rare forest plants and animals and the implementation of the Convention on International Trade in Endangered Species of Wild Fauna and Flora.",
    },
    shortName: {
      vi: "NĐ 84/2021",
      en: "Decree 84/2021",
    },
    data: nd84Data as Species[],
    url: "https://vanban.chinhphu.vn/default.aspx?pageid=27160&docid=204157",
    description: {
      vi: "",
      en: "",
    },
  },

  {
    id: "tt27",
    name: {
      vi: "Thông tư số 27/2025/TT-BNNMT của Bộ Nông nghiệp và Môi trường: Quy định về quản lý loài nguy cấp, quý, hiếm; nuôi động vật rừng thông thường và thực thi Công ước về buôn bán quốc tế các loài động vật, thực vật hoang dã nguy cấp.",
      en: "Circular No. 27/2025/TT-BNNMT of the Ministry of Agriculture and Rural Development: Regulations on the management of endangered, precious and rare species; breeding of common forest animals and the implementation of the Convention on International Trade in Endangered Species of Wild Fauna and Flora.",
    },
    shortName: {
      vi: "TT 27/2025",
      en: "Circular 27/2025",
    },
    data: tt27Data as Species[],
    url: "https://chinhphu.vn/?pageid=27160&docid=214371&classid=1&orggroupid=4",
    description: {
      vi: "",
      en: "",
    },
  },
];
