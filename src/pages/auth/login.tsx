import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { AuthForm } from "@/components/auth/auth-form";
import { useState } from "react";

const Login = () => {
  const [tab, setTab] = useState<"customer" | "business">("customer");
  return (
    <main className="bg-secondary">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-between">
        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-fit overflow-hidden rounded-2xl bg-white"
        >
          <div className="p-6 md:p-12">
            <div className="w-full max-w-md">
              <div className="mb-8 flex w-full items-center justify-between">
                <Link to="/">
                  <Logo size="sm" />
                </Link>
              </div>
              <AuthForm type="login" user={tab} />
            </div>
          </div>
        </motion.div>
        <div>hello</div>
      </div>
    </main>
  );
};

export default Login;
