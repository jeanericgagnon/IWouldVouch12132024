export interface SkillType {
  name: string;
  type: 'soft' | 'hard';
}

export interface PortfolioItem {
  type: string;
  name: string;
  url: string;
}

export interface SocialConnections {
  twitter?: string;
  github?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
}