import { Star, Menu, Heart } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Image } from "../ui/image";

export type Skill = {
  id: string;
  name: string;
  title: string;
  description: string;
  rating: number;
  reviews: number;
  avatar?: string;
  email: string;
  phone: string;
  response_time: string;
  extra_services: number;
  category: string;
  location: string;
  status: string;
  cover: string;
};

type Props = {
  skill: Skill;
};

export const SkillCard = ({ skill }: Props) => {
  return (
    <div className="border bg-white text-sm lg:text-base">
      {/* Cover image placeholder */}
      <div className="h-36 bg-gray-200">
        <Image src={skill.cover} className="size-full object-cover" />
      </div>

      {/* Body */}
      <div className="p-2 md:p-3">
        <div className="mb-2.5 flex gap-2 md:items-center">
          <div className="size-8 overflow-hidden rounded-full bg-gray-200">
            {skill.avatar && (
              <img
                src={skill.avatar}
                alt={skill.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="font-semibold leading-tight">
            <p>{skill.name}</p>
            <p className="text-secondary">{skill.title}</p>
          </div>
        </div>

        <div className="mb-4 text-base leading-5 lg:text-lg lg:leading-6">
          <p title={skill.description} className="line-clamp-2">
            {skill.description}
          </p>
        </div>

        <div className="flex items-center gap-1 font-medium text-secondary">
          <Star size={16} fill="#FFBE5B" />
          <span>
            {skill.rating}{" "}
            <span className="text-muted-foreground">({skill.reviews})</span>
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t p-2 md:p-3 md:py-5">
        <div
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault(); // Also prevent default if needed
          }}
          className="flex items-center gap-1 text-border"
        >
          <Popover>
            <PopoverTrigger>
              <Menu />
            </PopoverTrigger>
            <PopoverContent className="w-fit overflow-clip rounded-[32px] p-0">
              <div className="flex items-center gap-4 border-b p-4">
                <div className="size-12 min-w-12 overflow-hidden rounded-full bg-gray-200">
                  {skill.avatar && (
                    <img
                      src={skill.avatar}
                      alt={skill.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold">{skill.name}</p>
                  <p className="text-muted-foreground">
                    {skill.status} • Avg. response time:{" "}
                    <span className="font-semibold">{skill.response_time}</span>
                  </p>
                </div>
              </div>
              <div className="mb-7 space-y-2 p-4 pb-0">
                <p className="text-muted-foreground">
                  <span className="inline-block min-w-14">Email</span>•
                  {skill.email}
                </p>
                <p className="text-muted-foreground">
                  <span className="inline-block min-w-14">Phone</span>•
                  {skill.phone}
                </p>
                <p className="font-medium text-primary">
                  Offers {skill.extra_services} other services
                </p>
              </div>
              <div className="p-4">
                <Button variant="outline" className="rounded-full">
                  Send a message
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <button>
            <Heart fill="currentColor" size={20} />
          </button>
        </div>

        <div className="text-right text-xs font-medium text-border">
          <p className="uppercase">{skill.category}</p>
          <p className="text-lg text-dark">{skill.location}</p>
        </div>
      </div>
    </div>
  );
};
