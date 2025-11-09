import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";

const languageOptions = [
{ value: "en", label: "English" },
{ value: "zh-TW", label: "中文" },
{ value: "es", label: "Español" },
];

function LanguageSelect() {
  const { i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  const items = languageOptions.map((item) => ({
    id: item.value,
    label: item.label,
    onClick: () => changeLanguage(item.value),
  }));
  return (
    <Dropdown
      trigger={
        <Button variant="ghost" size="icon" className="rounded-full">
          <Languages />
        </Button>
      }
      items={items}
      label='語言'
    />
  );
}

export default LanguageSelect;
