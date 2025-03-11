import React from "react";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const languages = [
    { code: "en", nativeName: "English", englishName: "English", flag: "🇬🇧" },
    { code: "hi", nativeName: "हिन्दी", englishName: "Hindi", flag: "🇮🇳" },
    { code: "bn", nativeName: "বাংলা", englishName: "Bengali", flag: "🇧🇩" },
    { code: "gu", nativeName: "ગુજરાતી", englishName: "Gujarati", flag: "🇮🇳" },
    { code: "pa", nativeName: "ਪੰਜਾਬੀ", englishName: "Punjabi", flag: "🇮🇳" }
  ];
  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <Dropdown>
      <Dropdown.Toggle variant="secondary" id="dropdown-basic">
        {currentLang.flag} {currentLang.name}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {languages.map(lang => (
          <Dropdown.Item
            key={lang.code}
            onClick={() => {
              i18n.changeLanguage(lang.code);
              localStorage.setItem("preferredLanguage", lang.code);
              console.log("Language changed to:", lang.code);
            }}
          >
            {lang.flag} {lang.nativeName} {lang.englishName}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageSwitcher;