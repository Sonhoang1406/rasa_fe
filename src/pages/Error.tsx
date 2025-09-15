import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home } from "lucide-react";

export function Error() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-6">
      <motion.img
        src="/logo.png"
        alt="Error Logo"
        className="w-40 h-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      <motion.h1
        className="text-4xl font-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {t("Oops! Something went wrong.")}
      </motion.h1>
      <motion.p
        className="text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        {t("The page you're looking for doesn't exist or an error occurred.")}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <Link to="/">
          <Button className="cursor-pointer">
            <Home />
            <span>{t("Back to Home")}</span>
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
