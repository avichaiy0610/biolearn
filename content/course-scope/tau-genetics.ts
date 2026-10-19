import type { CourseScope } from "./types";

// TAU 0455-2526 "גנטיקה כללית". Evidence: the official IMS syllabus (2026 topics) and the
// detailed syllabus of 2022-23 (lecture table + Griffiths reading), found by the
// course-track-builder skill. Generated with `course_sources.py scope --suggest`, reviewed by hand
// (imprinting lowered to likely: "epigenetics" in the reading does not name it).
export const tauGeneticsScope: CourseScope = {
  courseSlug: "tau-genetics",
  checkedAt: "2026-10-19",
  defaultSource: { labelHe: "הסילבוס ב-IMS של אוניברסיטת תל אביב", url: "https://www.ims.tau.ac.il/Tal/Syllabus/Syllabus_L.aspx?course=0455252601&year=2026" },
  sections: {
  "mendel-probability": {
    "method": {
      "level": "core",
      "evidence": "syllabus-named",
      "noteHe": "הסילבוס הרשמי: \"חוקי מנדל\""
    },
    "segregation": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"single-gene inheritance\"; גם בסילבוס הרשמי: \"חוקי מנדל\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    },
    "testcross": {
      "level": "core",
      "evidence": "syllabus-named",
      "noteHe": "הסילבוס הרשמי: \"חוקי מנדל\""
    },
    "assortment": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"independent assortment\"; גם בסילבוס הרשמי: \"חוקי מנדל\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    },
    "probability": {
      "level": "likely",
      "evidence": "syllabus-heading",
      "noteHe": "נכלל בנושא רחב בסילבוס, אבל הנושא הזה לא מוזכר בשמו"
    },
    "chi-square": {
      "level": "likely",
      "evidence": "syllabus-heading",
      "noteHe": "נכלל בנושא רחב בסילבוס, אבל הנושא הזה לא מוזכר בשמו"
    }
  },
  "dominance-alleles": {
    "dominance": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"dominance/recessiveness\"; גם בסילבוס הרשמי: \"דומיננטיות ורצסיביות\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    },
    "incomplete": {
      "level": "likely",
      "evidence": "syllabus-heading",
      "noteHe": "נכלל בנושא רחב בסילבוס, אבל הנושא הזה לא מוזכר בשמו"
    },
    "codominance": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"co-dominance\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    },
    "multiple": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"ABO\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    },
    "lethal": {
      "level": "likely",
      "evidence": "syllabus-heading",
      "noteHe": "נכלל בנושא רחב בסילבוס, אבל הנושא הזה לא מוזכר בשמו"
    },
    "pleiotropy": {
      "level": "likely",
      "evidence": "syllabus-heading",
      "noteHe": "נכלל בנושא רחב בסילבוס, אבל הנושא הזה לא מוזכר בשמו"
    },
    "sex-environment": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"environment\"; גם בסילבוס הרשמי: \"השפעות סביבה\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    }
  },
  "pedigrees": {
    "symbols": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"family tree\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    },
    "patterns": {
      "level": "likely",
      "evidence": "syllabus-heading",
      "noteHe": "נכלל בנושא רחב בסילבוס, אבל הנושא הזה לא מוזכר בשמו"
    },
    "deduction": {
      "level": "likely",
      "evidence": "syllabus-heading",
      "noteHe": "נכלל בנושא רחב בסילבוס, אבל הנושא הזה לא מוזכר בשמו"
    },
    "risk": {
      "level": "likely",
      "evidence": "syllabus-heading",
      "noteHe": "נכלל בנושא רחב בסילבוס, אבל הנושא הזה לא מוזכר בשמו"
    },
    "penetrance": {
      "level": "likely",
      "evidence": "syllabus-heading",
      "noteHe": "נכלל בנושא רחב בסילבוס, אבל הנושא הזה לא מוזכר בשמו"
    }
  },
  "chromosomal-theory": {
    "terms": {
      "level": "core",
      "evidence": "syllabus-named",
      "noteHe": "הסילבוס הרשמי: \"התיאוריה הכרומוזומלית\""
    },
    "meiosis": {
      "level": "core",
      "evidence": "syllabus-named",
      "noteHe": "הסילבוס הרשמי: \"התיאוריה הכרומוזומלית\""
    },
    "mendel": {
      "level": "core",
      "evidence": "syllabus-named",
      "noteHe": "הסילבוס הרשמי: \"התיאוריה הכרומוזומלית\""
    },
    "proof": {
      "level": "core",
      "evidence": "syllabus-named",
      "noteHe": "הסילבוס הרשמי: \"התיאוריה הכרומוזומלית\""
    }
  },
  "sex-determination": {
    "systems": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"sex determination\"; גם בסילבוס הרשמי: \"קביעת מין\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    },
    "human-vs-fly": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"sex determination\"; גם בסילבוס הרשמי: \"קביעת מין\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    },
    "sex-linkage": {
      "level": "likely",
      "evidence": "syllabus-heading",
      "noteHe": "נכלל בנושא רחב בסילבוס, אבל הנושא הזה לא מוזכר בשמו"
    },
    "dosage": {
      "level": "likely",
      "evidence": "syllabus-heading",
      "noteHe": "נכלל בנושא רחב בסילבוס, אבל הנושא הזה לא מוזכר בשמו"
    }
  },
  "linkage-mapping": {
    "intro": {
      "level": "core",
      "evidence": "syllabus-named",
      "noteHe": "הסילבוס הרשמי: \"תאחיזה\""
    },
    "gametes": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"recombination\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    },
    "crossover": {
      "level": "core",
      "evidence": "syllabus-named",
      "noteHe": "הסילבוס הרשמי: \"שחלוף\""
    },
    "rf": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"mapping\"; גם בסילבוס הרשמי: \"מיפוי\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    },
    "three-point": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"mapping\"; גם בסילבוס הרשמי: \"שיטות למיפוי גנים\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    },
    "interference": {
      "level": "likely",
      "evidence": "syllabus-heading",
      "noteHe": "נכלל בנושא רחב בסילבוס, אבל הנושא הזה לא מוזכר בשמו"
    },
    "map-vs-physical": {
      "level": "likely",
      "evidence": "syllabus-heading",
      "noteHe": "נכלל בנושא רחב בסילבוס, אבל הנושא הזה לא מוזכר בשמו"
    },
    "human": {
      "level": "likely",
      "evidence": "syllabus-heading",
      "noteHe": "נכלל בנושא רחב בסילבוס, אבל הנושא הזה לא מוזכר בשמו"
    },
    "tetrads": {
      "level": "likely",
      "evidence": "syllabus-heading",
      "noteHe": "נכלל בנושא רחב בסילבוס, אבל הנושא הזה לא מוזכר בשמו"
    }
  },
  "mutations": {
    "definition": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"mutation\"; גם בסילבוס הרשמי: \"מוטציות\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    },
    "point": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"mutations\"; גם בסילבוס הרשמי: \"מוטציות\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    },
    "spontaneous": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"mutations\"; גם בסילבוס הרשמי: \"מוטציות\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    },
    "mutagens": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"mutations\"; גם בסילבוס הרשמי: \"חומרים מוטגניים\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    },
    "reversion": {
      "level": "likely",
      "evidence": "syllabus-heading",
      "noteHe": "נכלל בנושא רחב בסילבוס, אבל הנושא הזה לא מוזכר בשמו"
    },
    "ames": {
      "level": "likely",
      "evidence": "syllabus-heading",
      "noteHe": "נכלל בנושא רחב בסילבוס, אבל הנושא הזה לא מוזכר בשמו"
    },
    "repair": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"DNA repair\"; גם בסילבוס הרשמי: \"תיקון\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    }
  },
  "chromosome-structure": {
    "overview": {
      "level": "core",
      "evidence": "syllabus-named",
      "noteHe": "הסילבוס הרשמי: \"מבנה הכרומוזומים\""
    },
    "deletion": {
      "level": "core",
      "evidence": "syllabus-named",
      "noteHe": "הסילבוס הרשמי: \"שינויים במבנה הכרומוזומים\""
    },
    "duplication": {
      "level": "core",
      "evidence": "syllabus-named",
      "noteHe": "הסילבוס הרשמי: \"שינויים במבנה הכרומוזומים\""
    },
    "inversion": {
      "level": "core",
      "evidence": "syllabus-named",
      "noteHe": "הסילבוס הרשמי: \"שינויים במבנה הכרומוזומים\""
    },
    "translocation": {
      "level": "core",
      "evidence": "syllabus-named",
      "noteHe": "הסילבוס הרשמי: \"שינויים במבנה הכרומוזומים\""
    },
    "fragile": {
      "level": "likely",
      "evidence": "syllabus-heading",
      "noteHe": "נכלל בנושא רחב בסילבוס, אבל הנושא הזה לא מוזכר בשמו"
    }
  },
  "chromosome-number": {
    "terms": {
      "level": "core",
      "evidence": "syllabus-named",
      "noteHe": "הסילבוס הרשמי: \"במספרם\""
    },
    "nondisjunction": {
      "level": "core",
      "evidence": "syllabus-named",
      "noteHe": "הסילבוס הרשמי: \"ובמספרם\""
    },
    "human": {
      "level": "core",
      "evidence": "syllabus-named",
      "noteHe": "הסילבוס הרשמי: \"ובמספרם\""
    },
    "polyploidy": {
      "level": "core",
      "evidence": "syllabus-named",
      "noteHe": "הסילבוס הרשמי: \"ובמספרם\""
    }
  },
  "nature-of-gene": {
    "dna": {
      "level": "likely",
      "evidence": "syllabus-heading",
      "noteHe": "נכלל בנושא רחב בסילבוס, אבל הנושא הזה לא מוזכר בשמו"
    },
    "function": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"co-linearity\"; גם בסילבוס הרשמי: \"טבע הגן\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    },
    "complementation": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"complementation\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    },
    "benzer": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"Benzer\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    },
    "definition": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"what is a gene\"; גם בסילבוס הרשמי: \"טבע הגן\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    }
  },
  "gene-interaction": {
    "one-gene-one-enzyme": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"Beadle\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    },
    "ordering": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"biochemical pathway\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    },
    "epistasis": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"gene interaction\"; גם בסילבוס הרשמי: \"אינטראקציה בין גנים\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    },
    "complementary": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"gene interaction\"; גם בסילבוס הרשמי: \"אינטראקציה בין גנים\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    },
    "recessive": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"gene interaction\"; גם בסילבוס הרשמי: \"אינטראקציה בין גנים\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    },
    "dominant": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"gene interaction\"; גם בסילבוס הרשמי: \"אינטראקציה בין גנים\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    },
    "duplicate": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"gene interaction\"; גם בסילבוס הרשמי: \"אינטראקציה בין גנים\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    },
    "suppression": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"gene interaction\"; גם בסילבוס הרשמי: \"אינטראקציה בין גנים\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    },
    "analysis": {
      "level": "core",
      "evidence": "reading",
      "noteHe": "בסילבוס המפורט של הקורס (תשפ\"ג): \"gene interaction\"; גם בסילבוס הרשמי: \"אינטראקציה בין גנים\"",
      "source": {
        "labelHe": "הסילבוס המפורט (תשפ\"ג)",
        "url": "https://www.ims.tau.ac.il/Tal/Scans/Syllabus_Download.aspx?kurs=04552526&syllabus=kr_syllabus_s20221_k00_v00.pdf"
      }
    }
  },
  "non-mendelian": {
    "overview": {
      "level": "extension",
      "evidence": "none",
      "noteHe": "אין מסמך של הקורס שמכסה את הנושא הזה"
    },
    "maternal-effect": {
      "level": "extension",
      "evidence": "none",
      "noteHe": "אין מסמך של הקורס שמכסה את הנושא הזה"
    },
    "organelles": {
      "level": "extension",
      "evidence": "none",
      "noteHe": "אין מסמך של הקורס שמכסה את הנושא הזה"
    },
    "imprinting": {
      "level": "likely",
      "evidence": "syllabus-heading",
      "noteHe": "נכלל בהרצאה על אפיגנטיקה בסילבוס המפורט, אבל החתמה גנומית לא מוזכרת בשמה"
    }
  }
},
};
