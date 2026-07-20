export interface MonologueWord {
  text: string;
  italic: boolean;
}

export interface LanguageTranslations {
  // Home keys
  monologue: MonologueWord[];
  background: string;
  coreStack: string;
  languages: string;
  skills: string;
  gateway: string;
  contact: string;
  portfolio: string;
  riscVName: string;
  creativeWebDesignName: string;

  // Portfolio keys
  portfolioTitle: string;
  portfolioIntro: string;
  openProjectLabel: string;
  openProjectHover: string;
  sourceCodeLabel: string;
  featuredProjectLabel: string;
  sandboxLabel: string;
  vortexDesc: string;
  webDesignLabel: string;
  soccerDesc: string;
  ramenLabel: string;
  ramenDesc: string;

  // Broadsheet chrome keys — Portfolio contents-index kicker.
  broadsheetContentsLabel: string;
}

export const TRANSLATIONS: Record<"en" | "fr", LanguageTranslations> = {
  en: {
    monologue: [
      { text: "I", italic: false },
      { text: "am", italic: false },
      { text: "a", italic: false },
      { text: "computer", italic: false },
      { text: "science", italic: false },
      { text: "student", italic: false },
      { text: "and", italic: false },
      { text: "I", italic: false },
      { text: "enjoy", italic: false },
      { text: "designing", italic: false },
      { text: "many", italic: false },
      { text: "things,", italic: false },
      { text: "from", italic: false },
      { text: "websites", italic: false },
      { text: "and", italic: false },
      { text: "book", italic: false },
      { text: "covers", italic: false },
      { text: "to", italic: false },
      { text: "sports", italic: false },
      { text: "jerseys", italic: false },
      { text: "and", italic: false },
      { text: "more.", italic: false },
      { text: "I", italic: false },
      { text: "love", italic: false },
      { text: "playing", italic: false },
      { text: "sports", italic: false },
      { text: "and", italic: false },
      { text: "learning", italic: false },
      { text: "new", italic: false },
      { text: "skills.", italic: false },
      { text: "I", italic: true },
      { text: "build", italic: true },
      { text: "performant", italic: true },
      { text: "front-ends,", italic: true },
      { text: "back-ends,", italic: true },
      { text: "and", italic: true },
      { text: "interactive", italic: true },
      { text: "pages", italic: true },
      { text: "that", italic: true },
      { text: "feel", italic: true },
      { text: "premium.", italic: true },
      { text: "If", italic: false },
      { text: "you", italic: false },
      { text: "need", italic: false },
      { text: "a", italic: false },
      { text: "website", italic: false },
      { text: "for", italic: false },
      { text: "your", italic: false },
      { text: "business,", italic: false },
      { text: "you", italic: false },
      { text: "can", italic: false },
      { text: "find", italic: false },
      { text: "my", italic: false },
      { text: "contact", italic: false },
      { text: "info", italic: false },
      { text: "at", italic: false },
      { text: "the", italic: false },
      { text: "bottom", italic: false },
      { text: "of", italic: false },
      { text: "the", italic: false },
      { text: "page.", italic: false }
    ],
    background: "Currently pursuing Computer Science at EPFL, Lausanne — I applied as a TA for Analysis I. Having mentored two kids in math and physics, I helped them get the grades they wanted.",
    coreStack: "01 / Core Stack",
    languages: "LANGUAGES",
    skills: "SKILLS",
    gateway: "02 / Gateway",
    contact: "CONTACT",
    portfolio: "PORTFOLIO",
    riscVName: "Risc-V Assembly",
    creativeWebDesignName: "Creative Web Design",

    portfolioTitle: "Portfolio",
    portfolioIntro: "My personal projects along with client issued ones, mainly websites and school projects.",
    openProjectLabel: "OPEN PROJECT",
    openProjectHover: "Open Project",
    sourceCodeLabel: "SOURCE CODE",
    featuredProjectLabel: "Featured Project",
    sandboxLabel: "Creative Tech",
    vortexDesc: "An interactive digital gallery and OS mockup created to display high-performance frontend micro-interactions. Includes a ticking clock thread, custom responsive Dynamic Island widgets, parametric control docks, gooey physics morph filter elements, and custom Framer Motion spring sliders.",
    webDesignLabel: "Web Design",
    soccerDesc: "A clean, modern one-page website designed for a professional soccer club. Features a light flat theme with bold sporty typography, animated stat counters, interactive squad & fixture tabs, horizontal scroll tickers, and SVG stadium illustrations with draw-on scroll animations.",
    ramenLabel: "Gastronomy & Brand",
    ramenDesc: "A sensory digital showcase for a premium ramen sanctuary. Fuses wabi-sabi aesthetics with smooth scroll-driven typography reveals, asymmetric bento menu layouts, micro-interactive ingredient drawers, and a warm terracotta and charcoal canvas.",

    broadsheetContentsLabel: "Contents"
  },
  fr: {
    monologue: [
      { text: "Je", italic: false },
      { text: "suis", italic: false },
      { text: "étudiant", italic: false },
      { text: "en", italic: false },
      { text: "informatique", italic: false },
      { text: "et", italic: false },
      { text: "j'aime", italic: false },
      { text: "concevoir", italic: false },
      { text: "toutes", italic: false },
      { text: "sortes", italic: false },
      { text: "de", italic: false },
      { text: "choses,", italic: false },
      { text: "des", italic: false },
      { text: "sites", italic: false },
      { text: "web", italic: false },
      { text: "aux", italic: false },
      { text: "couvertures", italic: false },
      { text: "de", italic: false },
      { text: "livres", italic: false },
      { text: "en", italic: false },
      { text: "passant", italic: false },
      { text: "par", italic: false },
      { text: "les", italic: false },
      { text: "maillots", italic: false },
      { text: "de", italic: false },
      { text: "sport.", italic: false },
      { text: "J'aime", italic: false },
      { text: "pratiquer", italic: false },
      { text: "du", italic: false },
      { text: "sport", italic: false },
      { text: "et", italic: false },
      { text: "apprendre", italic: false },
      { text: "de", italic: false },
      { text: "nouvelles", italic: false },
      { text: "compétences.", italic: false },
      { text: "Je", italic: true },
      { text: "conçois", italic: true },
      { text: "des", italic: true },
      { text: "front-ends,", italic: true },
      { text: "des", italic: true },
      { text: "back-ends", italic: true },
      { text: "et", italic: true },
      { text: "des", italic: true },
      { text: "pages", italic: true },
      { text: "interactives", italic: true },
      { text: "performants,", italic: true },
      { text: "au", italic: true },
      { text: "rendu", italic: true },
      { text: "premium.", italic: true },
      { text: "Si", italic: false },
      { text: "vous", italic: false },
      { text: "avez", italic: false },
      { text: "besoin", italic: false },
      { text: "d'un", italic: false },
      { text: "site", italic: false },
      { text: "web", italic: false },
      { text: "pour", italic: false },
      { text: "votre", italic: false },
      { text: "entreprise,", italic: false },
      { text: "vous", italic: false },
      { text: "trouverez", italic: false },
      { text: "mes", italic: false },
      { text: "coordonnées", italic: false },
      { text: "en", italic: false },
      { text: "bas", italic: false },
      { text: "de", italic: false },
      { text: "la", italic: false },
      { text: "page.", italic: false }
    ],
    background: "Actuellement étudiant en informatique à l'EPFL, Lausanne — j'ai postulé comme assistant pour le cours d'Analyse I. Ayant encadré deux enfants en mathématiques et en physique, je les ai aidés à obtenir les notes qu'ils visaient.",
    coreStack: "01 / Stack Technique",
    languages: "LANGAGES",
    skills: "COMPÉTENCES",
    gateway: "02 / Passerelle",
    contact: "CONTACT",
    portfolio: "PORTFOLIO",
    riscVName: "Assembleur Risc-V",
    creativeWebDesignName: "Design Web Créatif",

    portfolioTitle: "Portfolio",
    portfolioIntro: "Mes projets personnels ainsi que des projets clients, principalement des sites web et des projets universitaires.",
    openProjectLabel: "OUVRIR LE PROJET",
    openProjectHover: "Ouvrir le projet",
    sourceCodeLabel: "CODE SOURCE",
    featuredProjectLabel: "Projet Phare",
    sandboxLabel: "Tech Créative",
    vortexDesc: "Une galerie numérique interactive et une maquette d'OS conçues pour illustrer des micro-interactions frontend haute performance. Comprend une horloge dynamique, des widgets Dynamic Island réactifs, des docks de contrôle paramétriques, des filtres de morphing physique et des curseurs Framer Motion avec ressorts physiques.",
    webDesignLabel: "Design Web",
    soccerDesc: "Un site web épuré et moderne d'une seule page conçu pour un club de football professionnel. Propose un thème clair et minimaliste avec une typographie sportive audacieuse, des compteurs de statistiques animés, des onglets d'équipe et de rencontres interactifs, des bandeaux de défilement horizontal et des illustrations SVG de stade s'animant au défilement.",
    ramenLabel: "Gastronomie & Image",
    ramenDesc: "Une vitrine numérique sensorielle pour un temple du ramen haut de gamme. Allie l'esthétique wabi-sabi à des révélations typographiques fluides au défilement, des grilles de menu bento asymétriques, des tiroirs d'ingrédients micro-interactifs et un canevas terre cuite et charbon.",

    broadsheetContentsLabel: "Sommaire"
  }
};
