import { SITE_NAME } from "@/lib/constants";

/**
 * Who wrote a post, and what makes that checkable.
 *
 * Background: the six bylines the design shipped with ("Daniel Whitfield",
 * "Sarah Mahmood", …) were generated from a `const authors = [...]` array in
 * `website design/Blog.dc.html`. No bio, credential, or profile existed for any
 * of them. Under Google's quality guidelines an article whose author is a bare
 * name is an anonymous article — and a byline naming a person who cannot be
 * verified is worse than none, because inventing expertise signals is itself
 * what the spam policies call out.
 *
 * So posts are attributed to the organisation until a real writer is registered
 * here. MyStudyAlly is a checkable publisher: registered address, phone, email,
 * and a full `EducationalOrganization` node the article schema points at. That
 * is a weaker signal than a named credentialed expert, and a much stronger one
 * than a name nobody can confirm.
 *
 * To publish under a real person: add them to `AUTHORS` below and set the
 * post's `author:` frontmatter to the same key. The byline, the author bio
 * block, and the `Person` schema all follow automatically.
 */
export interface Author {
  /** Matches the `author:` value in a post's frontmatter. */
  name: string;
  /** e.g. "IGCSE Mathematics tutor" — shown next to the name. */
  jobTitle: string;
  /** Qualifications as they would appear in print, e.g. "M.Sc. Mathematics". */
  credentials: string;
  /** One or two sentences on why this person can speak to the topic. */
  bio: string;
  /**
   * Profile URLs that prove the person exists — LinkedIn, an institutional
   * staff page, ORCID. Only add URLs that actually resolve to this person: a
   * wrong one merges the wrong identity into the entity graph.
   */
  sameAs?: string[];
}

/**
 * Real, verifiable authors. Empty on purpose — see the note above. Do not add
 * an entry until every field can be backed up by something a reader could go
 * and check.
 */
export const AUTHORS: Author[] = [];

/**
 * The fallback identity: the organisation itself.
 *
 * Mirrors the wording the rest of the site already uses ("our academic team
 * observes and reviews", `/about/`), so the byline is not a new claim.
 */
export const EDITORIAL_TEAM_NAME = `${SITE_NAME} Academic Team`;

export function getAuthor(name: string): Author | undefined {
  return AUTHORS.find((a) => a.name === name);
}

/** True when a post is attributed to the organisation rather than a person. */
export function isEditorialTeam(name: string): boolean {
  return name === EDITORIAL_TEAM_NAME || !getAuthor(name);
}
