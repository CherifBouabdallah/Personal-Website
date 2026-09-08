import BackToPortfolioButton from "../components/BackToPortfolioButton";

interface CampusDropProps {
  isPreview?: boolean;
}

// ponytail: CampusDrop's marketing site (RunmiGrow repo) is one page of a react-native-web
// Expo app (~3k lines across landing-screen/phone-mock/web-page-css, plus an OGL
// backdrop) — porting it here would fork it and rot. We frame the live deploy
// instead, so the portfolio always shows the shipped site. Port it in only if the
// live URL goes away or the frame needs to react to this site's theme/language.
export default function CampusDrop({ isPreview = false }: CampusDropProps) {
  return (
    <div className={`${isPreview ? "absolute rounded-[28px] overflow-hidden" : "fixed"} inset-0 bg-[#1B1517]`}>
      {!isPreview && <BackToPortfolioButton />}
      <iframe
        src="https://runmigrow.vercel.app/"
        title="CampusDrop"
        loading="lazy"
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
}
