import { SVGProps, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { JSX } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";
import { getLanguage, setLanguage } from "../locales/i18n";

import vietnamFlag from "@/assets/vietnam-flag.png";
import ukFlag from "@/assets/uk-flag.png";

export function LanguageSwicher() {
  const [selectedLanguage, setSelectedLanguage] = useState(
    getLanguage() === "vi" ? "Tiếng Việt" : "English"
  );
  const { t, i18n } = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <img
            src={selectedLanguage === "Tiếng Việt" ? vietnamFlag : ukFlag}
            alt="US Flag"
            width={24}
            height={24}
            className="rounded-full"
            style={{ aspectRatio: "24/24", objectFit: "cover" }}
          />
          <span className="font-medium">{selectedLanguage}</span>
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>{t("Select Language")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              setSelectedLanguage("English");
              setLanguage("en");
              i18n.changeLanguage("en");
            }}
          >
            <div className="flex items-center gap-2">
              <img
                src={ukFlag}
                alt="US Flag"
                width={24}
                height={24}
                className="rounded-full"
                style={{ aspectRatio: "24/24", objectFit: "cover" }}
              />
              <span>{t("English")}</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSelectedLanguage("Tiếng Việt");
              setLanguage("vi");
              i18n.changeLanguage("vi");
            }}
          >
            <div className="flex items-center gap-2">
              <img
                src={vietnamFlag}
                alt="Vietnamese Flag"
                width={24}
                height={24}
                className="rounded-full"
                style={{ aspectRatio: "24/24", objectFit: "cover" }}
              />
              <span>{t("Vietnamese")}</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ChevronDownIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
