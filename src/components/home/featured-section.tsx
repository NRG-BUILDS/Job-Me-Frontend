import { Link } from "react-router-dom";
import { SkillCard } from "../skills-ui/skill-card";
import { ReactNode } from "react";

interface Props {
  title?: ReactNode | string;
  id?: string;
}
const skills = [
  {
    id: "1",
    name: "Adebayo Cooling",
    title: "Top artisan",
    description: "I will install your sinks and water closet professionally",
    rating: 5.0,
    reviews: 3,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    cover: "https://source.unsplash.com/600x400/?plumbing,bathroom",
    email: "adeocool@gmail.com",
    phone: "09011922193",
    response_time: "1 hour",
    extra_services: 3,
    category: "Plumbing",
    location: "KANO",
    status: "Away",
  },
  {
    id: "2",
    name: "Chinedu Fixit",
    title: "Expert Technician",
    description: "Professional AC installation and servicing for homes.",
    rating: 4.8,
    reviews: 12,
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
    cover: "https://source.unsplash.com/600x400/?air-conditioner,repair",
    email: "chinedu.fixit@gmail.com",
    phone: "08023456789",
    response_time: "2 hours",
    extra_services: 5,
    category: "Air Conditioning",
    location: "LAGOS",
    status: "Available",
  },
  {
    id: "3",
    name: "Grace Interiors",
    title: "Creative Designer",
    description: "Transform your living spaces with modern interior designs.",
    rating: 4.9,
    reviews: 8,
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    cover: "https://source.unsplash.com/600x400/?interior,design",
    email: "grace.designs@gmail.com",
    phone: "08198765432",
    response_time: "30 mins",
    extra_services: 2,
    category: "Interior Design",
    location: "ABUJA",
    status: "Available",
  },
];

export function FeatureSection({ title, id }: Props) {
  return (
    <section id={id || undefined} className="px-1 py-6 md:px-12">
      <div className="rounded bg-[#EFEFF0]/50 p-2 lg:p-4 xl:px-5 xl:py-6">
        {title && (
          <h2 className="mb-3 text-3xl font-extrabold xl:mb-6">{title}</h2>
        )}
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:gap-4 xl:grid-cols-5">
          {skills.map((skill, index) => (
            <Link to={`/service/${index}`}>
              <SkillCard key={index} skill={skill} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;
