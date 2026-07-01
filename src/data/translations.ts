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
  scrollLabel: string;
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
}

export const TRANSLATIONS: Record<"en" | "fr", LanguageTranslations> = {
  en: {
    monologue: [
      { text: "I", italic: false },
      { text: "am", italic: false },
      { text: "a", italic: false },
      { text: "designer", italic: false },
      { text: "and", italic: false },
      { text: "full-stack", italic: false },
      { text: "software", italic: false },
      { text: "engineer", italic: false },
      { text: "who", italic: false },
      { text: "focuses", italic: false },
      { text: "on", italic: false },
      { text: "bridging", italic: false },
      { text: "the", italic: false },
      { text: "gap", italic: false },
      { text: "between", italic: false },
      { text: "aesthetics", italic: false },
      { text: "and", italic: false },
      { text: "clean", italic: false },
      { text: "code.", italic: false },
      { text: "I", italic: true },
      { text: "build", italic: true },
      { text: "performant", italic: true },
      { text: "front-ends", italic: true },
      { text: "and", italic: true },
      { text: "interactive", italic: true },
      { text: "experiences", italic: true },
      { text: "that", italic: true },
      { text: "are", italic: true },
      { text: "highly", italic: true },
      { text: "responsive", italic: true },
      { text: "and", italic: true },
      { text: "structured.", italic: true },
      { text: "Driven", italic: false },
      { text: "by", italic: false },
      { text: "curiosity,", italic: false },
      { text: "I", italic: false },
      { text: "aim", italic: false },
      { text: "to", italic: false },
      { text: "craft", italic: false },
      { text: "memorable", italic: false },
      { text: "digital", italic: false },
      { text: "products", italic: false },
      { text: "that", italic: false },
      { text: "look", italic: false },
      { text: "beautiful", italic: false },
      { text: "and", italic: false },
      { text: "feel", italic: false },
      { text: "extremely", italic: false },
      { text: "premium.", italic: false }
    ],
    background: "Currently pursuing software engineering at EPFL (École Polytechnique Fédérale de Lausanne), focusing on distributed architectures, interactive computer graphics, and engineering clean web environments.",
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
    scrollLabel: "SCROLL",
    openProjectLabel: "OPEN PROJECT",
    openProjectHover: "Open Project",
    sourceCodeLabel: "SOURCE CODE",
    featuredProjectLabel: "Featured Project",
    sandboxLabel: "Interactive Sandbox",
    vortexDesc: "An interactive digital gallery and OS mockup created to display high-performance frontend micro-interactions. Includes a ticking clock thread, custom responsive Dynamic Island widgets, parametric control docks, gooey physics morph filter elements, and custom Framer Motion spring sliders.",
    webDesignLabel: "Web Design",
    soccerDesc: "A clean, modern one-page website designed for a professional soccer club. Features a light flat theme with bold sporty typography, animated stat counters, interactive squad & fixture tabs, horizontal scroll tickers, and SVG stadium illustrations with draw-on scroll animations.",
    ramenLabel: "Gastronomy & Brand",
    ramenDesc: "A sensory digital showcase for a premium ramen sanctuary. Fuses wabi-sabi aesthetics with smooth scroll-driven typography reveals, asymmetric bento menu layouts, micro-interactive ingredient drawers, and a warm terracotta and charcoal canvas."
  },
  fr: {
    monologue: [
      { text: "Je", italic: false },
      { text: "suis", italic: false },
      { text: "un", italic: false },
      { text: "designer", italic: false },
      { text: "et", italic: false },
      { text: "ingénieur", italic: false },
      { text: "logiciel", italic: false },
      { text: "full-stack", italic: false },
      { text: "qui", italic: false },
      { text: "s'efforce", italic: false },
      { text: "de", italic: false },
      { text: "combler", italic: false },
      { text: "le", italic: false },
      { text: "fossé", italic: false },
      { text: "entre", italic: false },
      { text: "l'esthétique", italic: false },
      { text: "et", italic: false },
      { text: "le", italic: false },
      { text: "code", italic: false },
      { text: "propre.", italic: false },
      { text: "Je", italic: true },
      { text: "conçois", italic: true },
      { text: "des", italic: true },
      { text: "interfaces", italic: true },
      { text: "performantes", italic: true },
      { text: "et", italic: true },
      { text: "des", italic: true },
      { text: "expériences", italic: true },
      { text: "interactives", italic: true },
      { text: "qui", italic: true },
      { text: "sont", italic: true },
      { text: "hautement", italic: true },
      { text: "réactives", italic: true },
      { text: "et", italic: true },
      { text: "structurées.", italic: true },
      { text: "Guidé", italic: false },
      { text: "par", italic: false },
      { text: "la", italic: false },
      { text: "curiosité,", italic: false },
      { text: "je", italic: false },
      { text: "cherche", italic: false },
      { text: "à", italic: false },
      { text: "concevoir", italic: false },
      { text: "des", italic: false },
      { text: "produits", italic: false },
      { text: "numériques", italic: false },
      { text: "mémorables", italic: false },
      { text: "au", italic: false },
      { text: "design", italic: false },
      { text: "soigné", italic: false },
      { text: "et", italic: false },
      { text: "au", italic: false },
      { text: "ressenti", italic: false },
      { text: "extrêmement", italic: false },
      { text: "premium.", italic: false }
    ],
    background: "Actuellement étudiant en ingénierie logicielle à l'EPFL (École Polytechnique Fédérale de Lausanne), spécialisé dans les architectures distribuées, l'informatique graphique interactive et la conception d'environnements web épurés.",
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
    scrollLabel: "DÉFILER",
    openProjectLabel: "OUVRIR LE PROJET",
    openProjectHover: "Ouvrir le projet",
    sourceCodeLabel: "CODE SOURCE",
    featuredProjectLabel: "Projet Phare",
    sandboxLabel: "Sandbox Interactive",
    vortexDesc: "Une galerie numérique interactive et une maquette d'OS conçues pour illustrer des micro-interactions frontend haute performance. Comprend une horloge dynamique, des widgets Dynamic Island réactifs, des docks de contrôle paramétriques, des filtres de morphing physique et des curseurs Framer Motion avec ressorts physiques.",
    webDesignLabel: "Design Web",
    soccerDesc: "Un site web épuré et moderne d'une seule page conçu pour un club de football professionnel. Propose un thème clair et minimaliste avec une typographie sportive audacieuse, des compteurs de statistiques animés, des onglets d'équipe et de rencontres interactifs, des bandeaux de défilement horizontal et des illustrations SVG de stade s'animant au défilement.",
    ramenLabel: "Gastronomie & Image",
    ramenDesc: "Une vitrine numérique sensorielle pour un temple du ramen haut de gamme. Allie l'esthétique wabi-sabi à des révélations typographiques fluides au défilement, des grilles de menu bento asymétriques, des tiroirs d'ingrédients micro-interactifs et un canevas terre cuite et charbon."
  }
};
