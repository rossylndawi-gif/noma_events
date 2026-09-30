import { createElement } from "react";
import {
  Briefcase,
  Dumbbell,
  GraduationCap,
  Landmark,
  Laugh,
  Music,
  Plane,
  Shirt,
  Sparkles,
  Users,
  UtensilsCrossed,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  musique: Music,
  "culture-patrimoine": Landmark,
  "comedie-divertissement": Laugh,
  "business-tech": Briefcase,
  "sport-bien-etre": Dumbbell,
  gastronomie: UtensilsCrossed,
  "mode-beaute": Shirt,
  "education-formation": GraduationCap,
  "famille-communaute": Users,
  "tourisme-experiences": Plane,
};

export function categoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICONS[slug] ?? Sparkles;
}

/** Renders the icon for a category slug. */
export function CategoryIcon({ slug, ...props }: { slug: string } & LucideProps) {
  return createElement(categoryIcon(slug), props);
}
