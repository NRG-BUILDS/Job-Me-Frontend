import { Input } from "@/components/ui/input";
import { Mail, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "FCT",
];

interface AuthFormFieldsProps {
  type: "login" | "signup";
  confirmPassword?: string;
  user: "client" | "artisan" | "";
  form: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password2: string;
  };
  setForm: (form: any) => void;
}

export function AuthFormFields({
  type,
  form,
  user,
  setForm,
}: AuthFormFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswords = () => {
    setShowPassword((prev) => !prev);
  };

  const isArtisan = user === "artisan";
  const isClient = user === "" || user === "client";

  return (
    <div className="space-y-4">
      {type === "signup" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="First name"
                value={form.first_name || ""}
                onChange={(e) =>
                  setForm({ ...form, first_name: e.target.value })
                }
                required
              />
            </div>
            <div className="relative">
              <Input
                type="text"
                placeholder="Last name"
                value={form.last_name || ""}
                onChange={(e) =>
                  setForm({ ...form, last_name: e.target.value })
                }
                required
              />
            </div>
          </div>
        </>
      )}

      <div className="space-y-2">
        <div className="relative">
          <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            name="email"
            minLength={8}
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="pr-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <button
            onClick={togglePasswords}
            type="button"
            className="absolute right-3 top-3 text-muted-foreground *:h-4 *:w-4"
          >
            {showPassword ? <Eye /> : <EyeOff />}
          </button>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            minLength={8}
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="pr-10"
            required
          />
        </div>
        {type === "signup" && (
          <div className="relative">
            <button
              onClick={togglePasswords}
              type="button"
              className="absolute right-3 top-3 text-muted-foreground *:h-4 *:w-4"
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
            <Input
              type={showPassword ? "text" : "password"}
              name="password2"
              minLength={8}
              placeholder="Confirm Password"
              value={form.password2}
              onChange={(e) => setForm({ ...form, password2: e.target.value })}
              className="pr-10"
              required
            />
          </div>
        )}
      </div>
    </div>
  );
}
