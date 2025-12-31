export type Project = "focuspilot" | "shiftrix" | "linguai";
export type PostType = "devlog" | "note";

export type LinkItem = { label: string; href: string };

export type PublicRow = {
  id: string;
  project: Project;
  type: PostType;
  status: "published";
  published_at: string | null;

  date: string;
  title: string;
  summary: string | null;
  content_md: string | null;

  tags: string[] | null;
  links: LinkItem[] | null;
};
