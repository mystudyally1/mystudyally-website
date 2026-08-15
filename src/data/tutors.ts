export interface Tutor {
  slug: string;
  photo: string;
  name: string;
  qualification: string;
  years: string;
  expertise: string;
  bio: string;
}

// Sourced from MyStudyAlly Homepage.dc.html's `tutors` array.
export const FEATURED_TUTORS: Tutor[] = [
  {
    slug: "sarah-a",
    photo: "/images/tutors/tutor-photo-sarah.webp",
    name: "Sarah A.",
    qualification: "M.Sc. Mathematics",
    years: "8 years teaching",
    expertise: "IGCSE & A Level Mathematics, Additional Mathematics",
    bio: "Known for turning Extended-tier problem solving into a step-by-step method students actually remember.",
  },
  {
    slug: "omar-k",
    photo: "/images/tutors/tutor-photo-omar.webp",
    name: "Omar K.",
    qualification: "B.Eng., PGCE",
    years: "6 years teaching",
    expertise: "IGCSE & GCSE Physics, Chemistry",
    bio: "Specialises in past-paper technique and mark-scheme thinking for the sciences.",
  },
  {
    slug: "nadia-r",
    photo: "/images/tutors/tutor-photo-nadia.webp",
    name: "Nadia R.",
    qualification: "M.A. English Literature",
    years: "10 years teaching",
    expertise: "IB English A, IELTS Preparation",
    bio: "Helps students move from good essays to examiner-level structure and analysis.",
  },
  {
    slug: "daniel-l",
    photo: "/images/tutors/tutor-photo-daniel.webp",
    name: "Daniel L.",
    qualification: "B.Sc. Economics",
    years: "7 years teaching",
    expertise: "A Level Economics, SAT Math",
    bio: "Builds exam confidence with timed drills matched to the current digital SAT format.",
  },
];
