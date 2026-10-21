/** Approved reflections from HR VISTA 2.0. Keep this empty until supplied. */
export type Feedback = {
  quote: string;
  name: string;
  role: string;
  org: string;
  /** Public local portrait path, for example /media/people/name.jpg. */
  portrait?: string;
  /** Public attribution or original publication URL, when available. */
  source?: string;
};

export const feedback: Feedback[] = [];
