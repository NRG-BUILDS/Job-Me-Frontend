import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { AuthForm } from "@/components/auth/auth-form";
import { useState } from "react";

const Signup = () => {
  const [tab, setTab] = useState<"customer" | "business">("customer");
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <motion.div
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto w-fit overflow-hidden rounded-2xl bg-white"
      >
        <div className="p-6 md:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 flex w-full items-center justify-between">
              <Link to="/">
                <Logo size="sm" />
              </Link>
            </div>
            <AuthForm type="signup" user={tab} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
