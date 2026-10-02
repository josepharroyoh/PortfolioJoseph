import { useTranslation } from "react-i18next";

/** Typed access to arrays/objects stored in the locale files. */
export function useCopy<T>(key: string): T {
  const { t } = useTranslation();
  return t(key, { returnObjects: true }) as T;
}
