import { Star, Menu, Heart } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Image } from "../ui/image";
import { Service } from "@/types/service";

type Props = {
  skill: Service;
};

export const SkillCard = ({ skill }: Props) => {
  return (
    <div className="border bg-white text-sm lg:text-base">
      {/* Cover image placeholder */}
      <div className="relative aspect-[4/3] w-full bg-gray-200">
        <Image
          src={skill.gallery[0].url}
          className="size-full object-cover object-top"
        />
        {skill.isPromoted && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-amber-500/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-sm">
            <Star className="size-3 fill-current" />
            Spotlight
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-2 md:p-3">
        <div className="mb-2.5 flex gap-2 md:items-center">
          <div className="size-8 overflow-hidden rounded-full bg-gray-200">
            {skill.artisan.first_name && (
              <img
                src={skill.artisan.profile?.profile_picture}
                alt={skill.artisan.username}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="font-semibold leading-tight">
            <p>{skill.title}</p>
            <p className="text-secondary">{skill.category.name}</p>
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
            {skill.rating_average}{" "}
            <span className="text-muted-foreground">
              ({skill.reviews_count})
            </span>
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
                  {skill.artisan.profile?.profile_picture && (
                    <img
                      src={skill.artisan.profile.profile_picture}
                      alt={skill.artisan.username}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {skill.artisan.first_name} {skill.artisan.last_name}
                  </p>
                  <p className="text-muted-foreground">
                    {skill.artisan.online_status}
                  </p>
                </div>
              </div>
              <div className="mb-7 space-y-2 p-4 pb-0">
                <p className="text-muted-foreground">
                  <span className="inline-block min-w-14">Email</span>•{" "}
                  {skill.artisan.email || "Not provided"}
                </p>
                <p className="text-muted-foreground">
                  <span className="inline-block min-w-14">Phone</span>•{" "}
                  {skill.artisan.profile?.phone_number || "Not provided"}
                </p>
              </div>
              <div className="p-4">
                <Button variant="outline" className="rounded-full">
                  Send a message
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          {/* <button>
            <Heart fill="currentColor" size={20} />
          </button> */}
        </div>

        <div className="text-right text-xs font-medium text-border">
          <p className="uppercase">{skill.category.name}</p>
          <p className="text-lg text-dark">
            {skill.artisan?.profile?.location?.state}
          </p>
        </div>
      </div>
    </div>
  );
};
