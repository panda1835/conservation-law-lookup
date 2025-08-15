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
      vi: "Nghị định 160/2013/NĐ-CP",
      en: "Decree 160/2013/ND-CP",
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
      vi: "Nghị định 06/2019/NĐ-CP",
      en: "Decree 06/2019/ND-CP",
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
      vi: "Nghị định 64/2019/NĐ-CP",
      en: "Decree 64/2019/ND-CP",
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
      vi: "Nghị định 84/2021/NĐ-CP",
      en: "Decree 84/2021/ND-CP",
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
      vi: "Thông tư 27/2025/TT-BNNMT",
      en: "Circular 27/2025/TT-BNNMT",
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
